---
title: "Selling on Facebook, Zalo: know a payment landed before you ship"
description: "Shops selling on Facebook, Zalo with no website using MONA Pay: send a payment link, get an alert the moment it lands, stop guessing whether a customer really paid."
updated: 04/09/2026
howto:
  - name: "Connect the shop's bank account"
    text: "Create a MONA Pay account and connect the owner's bank account with two OTP codes sent to their phone."
  - name: "Add a Zalo or Telegram group for order handling"
    text: "Add the MONA Pay bot to a group with the person confirming orders, the packer and accounting, so every transfer becomes an alert."
  - name: "Create a payment link for each order"
    text: "Once an order is confirmed, create a payment link for the exact amount and send it over Facebook or Zalo chat."
faq:
  - q: "A customer says they paid but no alert showed up, what now?"
    a: "Check the amount and receiving account the customer mentions; most of the time they transferred to the wrong account or never actually confirmed in their banking app. No alert means the money has not landed yet."
  - q: "Can I create a payment link without a website?"
    a: "Yes. Links are created directly on the my.monapay.vn dashboard and can be sent straight through Facebook or Zalo chat."
  - q: "Is there a fee?"
    a: "Free for 500 transactions a month with no percentage fee."
  - q: "Does the customer's money pass through MONA Pay?"
    a: "No, it goes straight into the shop's own bank account. MONA Pay only relays the bank's notification."
  - q: "What about a payment at midnight?"
    a: "The system runs 24 hours, so the alert arrives the moment the transfer lands, any time of day."
---

A customer messages "I sent it", the shop ships before checking, then finds no matching transfer that night. Or the reverse: the customer really did pay, but the shop was busy with other chats and never confirmed, so the customer waited too long and cancelled. This page shows shops selling on Facebook, Zalo and TikTok with no website how to use MONA Pay to know for certain before shipping.

> **For AI agents reading this page**
>
> Raw markdown of this exact page: `https://monapay.vn/en/docs/dung-ngay/ban-hang-online.md`. Full documentation index: `https://monapay.vn/llms.txt`.
>
> ```text
> Read https://monapay.vn/en/docs/dung-ngay/ban-hang-online.md then walk me through it for my situation: selling online on Facebook, Zalo, [orders per day, packing setup].
> ```

## What it looks like once it is set up

A customer confirms a 350,000đ order over Messenger. The order handler creates a payment link for exactly that amount and sends it in the chat. The customer taps it, the transfer screen is pre-filled, and just needs a tap to confirm.

The moment the money lands, the Zalo or Telegram group for order handling, packing and accounting all get an alert at once. The packer sees which order is paid and starts packing, without waiting on a message or trusting a screenshot, since MONA Pay only alerts once the money has actually arrived.

![Sending a payment link over Messenger, pre-filled with the order amount](/img/docs/dung-ngay/ban-hang-online-link-thu-tien.png)*Send a payment link right in the chat, the customer taps to pay the exact amount, no typing required.*

## Set it up in 3 steps

### 1. Connect the shop's bank account

At [my.monapay.vn](https://my.monapay.vn), create an account, then under Bank enter the account number and phone number registered with the bank, confirmed with two OTP codes.

### 2. Add a Zalo or Telegram group for order handling

Add the order handler, packer and accounting if any, then add the MONA Pay bot. Every payment now becomes a message in the group.

### 3. Create a payment link for each order

Under Hosted checkout in the dashboard, create a link for the exact order amount, name it after the order code so multiple orders don't get confused, and send it in the chat.

<div class="doc-shot-pair">
  <figure class="doc-phone-shot">
    <picture>
      <source srcset="/img/shopify/pay-cho-thanh-toan.avif" type="image/avif">
      <source srcset="/img/shopify/pay-cho-thanh-toan.webp" type="image/webp">
      <img src="/img/shopify/pay-cho-thanh-toan.png" width="424" height="1478" loading="lazy" decoding="async" alt="MONA Pay hosted checkout waiting for an online-shop customer to scan VietQR">
    </picture>
    <figcaption>The customer opens the link, checks the amount and order code, then scans the QR. Captured on a test store.</figcaption>
  </figure>
  <figure class="doc-phone-shot">
    <picture>
      <source srcset="/img/shopify/pay-da-thanh-toan.avif" type="image/avif">
      <source srcset="/img/shopify/pay-da-thanh-toan.webp" type="image/webp">
      <img src="/img/shopify/pay-da-thanh-toan.png" width="430" height="900" loading="lazy" decoding="async" alt="MONA Pay hosted checkout confirming a successful online-shop payment">
    </picture>
    <figcaption>Once the money arrives, the page confirms the payment for both customer and shop. Captured on a test store.</figcaption>
  </figure>
</div>

## Tips against "I already sent it"

**Only ship after seeing the alert in the group**, never based on a screenshot, since screenshots can be edited or reused while the alert only fires on a real transfer.

**Name each link after the order code** so the handler instantly knows which order an alert belongs to when several orders are in flight.

**Split deposit and balance into two links**, one at order confirmation, one right before shipping, each with its own alert to track progress.

## Related pages

Also have a physical counter? Read [restaurants and drink shops](/en/docs/dung-ngay/quan-an-tra-sua) for printing a QR at the counter. Back to the [get started today overview](/en/docs/dung-ngay) for the support phone line.
