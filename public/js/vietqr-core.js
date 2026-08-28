/* MonaQR — bộ mã hoá QR thuần JS (byte mode UTF-8, version 1-40, chọn mask theo penalty).
   Thuật toán theo chuẩn ISO/IEC 18004 (cấu trúc bám qrcodegen của Nayuki, MIT).
   Đã pass bộ self-test roundtrip: đọc ngược ma trận, check Reed-Solomon từng block,
   check BCH format bits, so từng byte UTF-8 với input (2026-08-27). */
var MonaQR = (function(){
  'use strict';
  var ECC_PER_BLOCK = [
    [-1,  7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
  ];
  var NUM_BLOCKS = [
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4,  4,  4,  4,  4,  6,  6,  6,  6,  7,  8,  8,  9,  9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5,  5,  8,  9,  9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8,  8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
  ];
  var LVL = { L:0, M:1, Q:2, H:3 };
  var FMT = { L:1, M:0, Q:3, H:2 };

  var EXP = new Array(512), LOG = new Array(256);
  (function(){
    var x = 1;
    for (var i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11D; }
    for (var i2 = 255; i2 < 512; i2++) EXP[i2] = EXP[i2 - 255];
  })();
  function gmul(a, b){ return (a && b) ? EXP[LOG[a] + LOG[b]] : 0; }
  function genPoly(deg){
    var poly = [1];
    for (var i = 0; i < deg; i++) {
      var next = new Array(poly.length + 1);
      for (var j = 0; j < next.length; j++) next[j] = 0;
      for (var k = 0; k < poly.length; k++) {
        next[k] ^= gmul(poly[k], EXP[i]);
        next[k + 1] ^= poly[k];
      }
      poly = next;
    }
    // poly đang ở bậc TĂNG dần (hệ số 1 nằm cuối) — rsRemainder cần bậc GIẢM dần (gen[0]=1)
    return poly.reverse();
  }
  function rsRemainder(data, gen){
    var deg = gen.length - 1;
    var res = new Array(deg);
    for (var i = 0; i < deg; i++) res[i] = 0;
    for (var j = 0; j < data.length; j++) {
      var factor = data[j] ^ res[0];
      res.shift(); res.push(0);
      if (factor) for (var k = 0; k <= deg - 1; k++) res[k] ^= gmul(gen[k + 1], factor);
    }
    return res;
  }
  function utf8Bytes(str){
    var out = [];
    for (var i = 0; i < str.length; i++) {
      var c = str.codePointAt(i);
      if (c > 0xFFFF) i++;
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xC0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0x10000) out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else out.push(0xF0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
  }
  function rawDataModules(v){
    var r = (16 * v + 128) * v + 64;
    if (v >= 2) {
      var na = Math.floor(v / 7) + 2;
      r -= (25 * na - 10) * na - 55;
      if (v >= 7) r -= 36;
    }
    return r;
  }
  function totalCodewords(v){ return Math.floor(rawDataModules(v) / 8); }
  function dataCodewords(v, li){ return totalCodewords(v) - ECC_PER_BLOCK[li][v] * NUM_BLOCKS[li][v]; }
  function alignPositions(v){
    if (v === 1) return [];
    var na = Math.floor(v / 7) + 2;
    var size = v * 4 + 17;
    var step = (v === 32) ? 26 : Math.ceil((v * 4 + 4) / (na * 2 - 2)) * 2;
    var res = [6];
    for (var pos = size - 7; res.length < na; pos -= step) res.splice(1, 0, pos);
    return res;
  }
  function getBit(x, i){ return ((x >>> i) & 1) !== 0; }

  function make(text, ecl){
    var li = LVL[ecl];
    var bytes = utf8Bytes(text);
    var version = -1;
    for (var v = 1; v <= 40; v++) {
      var cntBits = v <= 9 ? 8 : 16;
      var used = 4 + cntBits + bytes.length * 8;
      if (bytes.length < (1 << cntBits) && used <= dataCodewords(v, li) * 8) { version = v; break; }
    }
    if (version < 0) throw new Error('qua dai');
    var size = version * 4 + 17;
    var cntBits2 = version <= 9 ? 8 : 16;
    var capBits = dataCodewords(version, li) * 8;

    var bits = [];
    function push(val, n){ for (var i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); }
    push(4, 4);
    push(bytes.length, cntBits2);
    for (var b = 0; b < bytes.length; b++) push(bytes[b], 8);
    var term = Math.min(4, capBits - bits.length);
    push(0, term);
    if (bits.length % 8) push(0, 8 - (bits.length % 8));
    var padToggle = true;
    while (bits.length < capBits) { push(padToggle ? 0xEC : 0x11, 8); padToggle = !padToggle; }
    var data = [];
    for (var i2 = 0; i2 < bits.length; i2 += 8) {
      var by = 0;
      for (var j2 = 0; j2 < 8; j2++) by = (by << 1) | bits[i2 + j2];
      data.push(by);
    }

    var numBlocks = NUM_BLOCKS[li][version];
    var eccLen = ECC_PER_BLOCK[li][version];
    var raw = totalCodewords(version);
    var numShort = numBlocks - raw % numBlocks;
    var shortLen = Math.floor(raw / numBlocks);
    var gen = genPoly(eccLen);
    var blocks = [];
    var k2 = 0;
    for (var bi = 0; bi < numBlocks; bi++) {
      var datLen = shortLen - eccLen + (bi < numShort ? 0 : 1);
      var dat = data.slice(k2, k2 + datLen); k2 += datLen;
      var ecc = rsRemainder(dat, gen);
      var blk = dat.slice();
      if (bi < numShort) blk.push(0);
      blocks.push(blk.concat(ecc));
    }
    var all = [];
    for (var col = 0; col < blocks[0].length; col++)
      for (var bj = 0; bj < blocks.length; bj++)
        if (col !== shortLen - eccLen || bj >= numShort) all.push(blocks[bj][col]);

    var modules = [], isFunc = [];
    for (var r0 = 0; r0 < size; r0++) { modules.push(new Array(size).fill(false)); isFunc.push(new Array(size).fill(false)); }
    function setF(x, y, dark){ modules[y][x] = dark; isFunc[y][x] = true; }
    function drawFinder(x, y){
      for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
        var d = Math.max(Math.abs(dx), Math.abs(dy));
        var xx = x + dx, yy = y + dy;
        if (xx >= 0 && xx < size && yy >= 0 && yy < size) setF(xx, yy, d !== 2 && d !== 4);
      }
    }
    function drawAlign(x, y){
      for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++)
        setF(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
    function drawFormat(mask){
      var d0 = FMT[ecl] << 3 | mask;
      var rem = d0;
      for (var i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      var fb = ((d0 << 10) | rem) ^ 0x5412;
      for (var a = 0; a <= 5; a++) setF(8, a, getBit(fb, a));
      setF(8, 7, getBit(fb, 6));
      setF(8, 8, getBit(fb, 7));
      setF(7, 8, getBit(fb, 8));
      for (var a2 = 9; a2 < 15; a2++) setF(14 - a2, 8, getBit(fb, a2));
      for (var c0 = 0; c0 <= 7; c0++) setF(size - 1 - c0, 8, getBit(fb, c0));
      for (var c1 = 8; c1 < 15; c1++) setF(8, size - 15 + c1, getBit(fb, c1));
      setF(8, size - 8, true);
    }
    for (var t = 0; t < size; t++) { setF(6, t, t % 2 === 0); setF(t, 6, t % 2 === 0); }
    drawFinder(3, 3); drawFinder(size - 4, 3); drawFinder(3, size - 4);
    var ap = alignPositions(version);
    for (var ai = 0; ai < ap.length; ai++) for (var aj = 0; aj < ap.length; aj++) {
      if ((ai === 0 && aj === 0) || (ai === 0 && aj === ap.length - 1) || (ai === ap.length - 1 && aj === 0)) continue;
      drawAlign(ap[ai], ap[aj]);
    }
    drawFormat(0);
    if (version >= 7) {
      var rem2 = version;
      for (var i3 = 0; i3 < 12; i3++) rem2 = (rem2 << 1) ^ ((rem2 >>> 11) * 0x1F25);
      var vb = version << 12 | rem2;
      for (var i4 = 0; i4 < 18; i4++) {
        var bit = getBit(vb, i4);
        var a3 = size - 11 + i4 % 3, b3 = Math.floor(i4 / 3);
        setF(a3, b3, bit); setF(b3, a3, bit);
      }
    }
    var bitIdx = 0;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) {
        for (var jj = 0; jj < 2; jj++) {
          var x2 = right - jj;
          var upward = ((right + 1) & 2) === 0;
          var y2 = upward ? size - 1 - vert : vert;
          if (!isFunc[y2][x2] && bitIdx < all.length * 8) {
            modules[y2][x2] = ((all[bitIdx >>> 3] >>> (7 - (bitIdx & 7))) & 1) !== 0;
            bitIdx++;
          }
        }
      }
    }
    function maskBit(m, x, y){
      switch (m) {
        case 0: return (x + y) % 2 === 0;
        case 1: return y % 2 === 0;
        case 2: return x % 3 === 0;
        case 3: return (x + y) % 3 === 0;
        case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
        case 5: return x * y % 2 + x * y % 3 === 0;
        case 6: return (x * y % 2 + x * y % 3) % 2 === 0;
        default: return ((x + y) % 2 + x * y % 3) % 2 === 0;
      }
    }
    function applyMask(m){
      for (var y = 0; y < size; y++) for (var x = 0; x < size; x++)
        if (!isFunc[y][x] && maskBit(m, x, y)) modules[y][x] = !modules[y][x];
    }
    function penalty(){
      var p = 0, y, x;
      function scanLine(get){
        var pp = 0;
        for (var u = 0; u < size; u++) {
          var run = 0, prev = -1;
          var arr = [0,0,0,0];
          for (var w = 0; w < size; w++) arr.push(get(u, w) ? 1 : 0);
          arr.push(0,0,0,0);
          for (var w2 = 0; w2 < arr.length; w2++) {
            if (arr[w2] === prev) run++;
            else {
              if (prev === 1 && run >= 5) pp += 3 + (run - 5);
              else if (prev === 0 && run >= 5 && w2 > 4 && w2 - run >= 4) pp += 3 + (run - 5);
              prev = arr[w2]; run = 1;
            }
          }
          if (prev === 1 && run >= 5) pp += 3 + (run - 5);
          for (var s = 0; s + 11 <= arr.length; s++) {
            var pat1 = [1,0,1,1,1,0,1,0,0,0,0], pat2 = [0,0,0,0,1,0,1,1,1,0,1];
            var m1 = true, m2 = true;
            for (var q = 0; q < 11; q++) {
              if (arr[s + q] !== pat1[q]) m1 = false;
              if (arr[s + q] !== pat2[q]) m2 = false;
              if (!m1 && !m2) break;
            }
            if (m1) pp += 40;
            if (m2) pp += 40;
          }
        }
        return pp;
      }
      p += scanLine(function(u, w){ return modules[u][w]; });
      p += scanLine(function(u, w){ return modules[w][u]; });
      for (y = 0; y < size - 1; y++) for (x = 0; x < size - 1; x++) {
        var c = modules[y][x];
        if (c === modules[y][x + 1] && c === modules[y + 1][x] && c === modules[y + 1][x + 1]) p += 3;
      }
      var dark = 0;
      for (y = 0; y < size; y++) for (x = 0; x < size; x++) if (modules[y][x]) dark++;
      var total = size * size;
      p += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
      return p;
    }
    var best = 0, minP = Infinity;
    for (var m0 = 0; m0 < 8; m0++) {
      applyMask(m0); drawFormat(m0);
      var pv = penalty();
      if (pv < minP) { minP = pv; best = m0; }
      applyMask(m0);
    }
    applyMask(best); drawFormat(best);
    return { size: size, version: version, mask: best, ecl: ecl, modules: modules, isFunction: isFunc };
  }
  return { make: make };
})();

/* ================== CẤU HÌNH ASSET ================== */
var BANKS = [
  ['Vietcombank','970436'],['VietinBank','970415'],['BIDV','970418'],['Agribank','970405'],
  ['Techcombank','970407'],['MB Bank','970422'],['ACB','970416'],['VPBank','970432'],
  ['TPBank','970423'],['Sacombank','970403'],['HDBank','970437'],['VIB','970441'],
  ['SHB','970443'],['Eximbank','970431'],['MSB','970426'],['OCB','970448'],
  ['SeABank','970440'],['LPBank','970449'],['Nam A Bank','970428'],['ABBANK','970425'],
  ['PVcomBank','970412'],['SCB','970429'],['Bac A Bank','970409'],['NCB','970419'],
  ['KienlongBank','970452'],['BVBank','970454'],['Viet A Bank','970427'],['VietBank','970433'],
  ['BaoViet Bank','970438'],['PGBank','970430'],['Co-opBank','970446'],['Woori Bank','970457'],
  ['Shinhan Bank','970424'],['Public Bank','970439'],['UOB','970458'],['CIMB','422589']
];
function tlv(id, value){
  var len = ('0' + value.length).slice(-2);
  return id + len + value;
}
function crc16ccitt(str){
  var crc = 0xFFFF;
  for (var i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (var j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xFFFF;
    }
  }
  return ('000' + crc.toString(16).toUpperCase()).slice(-4);
}
function buildVietQR(bin, account, amount, note){
  var beneficiary = tlv('00', bin) + tlv('01', account);
  var merchant = tlv('00', 'A000000727') + tlv('01', beneficiary) + tlv('02', 'QRIBFTTA');
  var payload = tlv('00', '01')
    + tlv('01', amount ? '12' : '11')
    + tlv('38', merchant)
    + tlv('53', '704');
  if (amount) payload += tlv('54', amount);
  payload += tlv('58', 'VN');
  if (note) payload += tlv('62', tlv('08', note));
  payload += '6304';
  return payload + crc16ccitt(payload);
}
