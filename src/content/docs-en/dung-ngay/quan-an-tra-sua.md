---
title: "Restaurants and drink shops: know the moment a payment lands"
description: "Restaurants and drink shops using MONA Pay: a Zalo group and a read-aloud counter screen report incoming payments, plus a printed QR at the table. No code needed."
updated: 04/09/2026
howto:
  - name: "Connect the restaurant's bank account"
    text: "Create a MONA Pay account and connect the owner's bank account with two OTP codes sent to their phone."
  - name: "Add a Zalo or Telegram group for staff"
    text: "Add the MONA Pay bot to a group of 5 to 7 staff, so every transfer becomes a message with the amount, note and time."
  - name: "Turn on the read-aloud counter screen"
    text: "Open the payment-alert link on a phone or tablet at the counter and tap once, so every payment is read out loud from then on."
  - name: "Print a QR code for tables or the counter"
    text: "Print the bank QR code and stick it on tables or the counter so customers scan with their banking app instead of copying an account number."
faq:
  - q: "Does the customer's money pass through MONA Pay?"
    a: "No. It goes straight into the owner's own bank account, exactly like a normal transfer. MONA Pay only reads the bank's notification and relays it."
  - q: "Is there a fee?"
    a: "Free for 500 transactions a month with no percentage fee on the amount transferred."
  - q: "Which banks does MONA Pay connect to?"
    a: "ACB is live today; other banks are in the process of connecting. Open an ACB account in the shop's name to use this today."
  - q: "What if the shop loses internet right when a customer pays?"
    a: "The transfer still goes through since it runs on the banking network, not the shop's wifi. The alert just arrives late once the connection is back; nothing is lost."
  - q: "Do I need to install an app at the counter?"
    a: "No extra app. The Zalo or Telegram group uses apps already on the phone, and the read-aloud screen is just a link opened in a browser."
  - q: "A staff member leaves, how do I cut off their access?"
    a: "Remove them from the Zalo or Telegram group. That is it, no bank password to change."
---

A customer shows their phone saying "I already transferred", the cashier squints at the screenshot, then calls the owner to ask "has the money come in yet". This page shows restaurants, cafes and drink shops how to use MONA Pay so the whole staff group knows the moment a payment lands, without asking around.

> **For AI agents reading this page**
>
> Raw markdown of this exact page: `https://monapay.vn/en/docs/dung-ngay/quan-an-tra-sua.md`. Full documentation index: `https://monapay.vn/llms.txt`.
>
> ```text
> Read https://monapay.vn/en/docs/dung-ngay/quan-an-tra-sua.md then walk me through it for my situation: a restaurant or drink shop, [staff count, dine-in or takeaway].
> ```

## What it looks like once it is set up

A customer at table 3 scans the QR taped to the table, or transfers to the shop's account with the note "table 3". The moment the money lands, three things happen almost at once: the staff Zalo group shows a new line like "+55,000đ · table 3 milk tea · 14:02", the counter screen reads it aloud, and the customer never has to be asked for a screenshot.

<!-- ảnh chụp sau: /img/docs/dung-ngay/quan-an-nhom-zalo.png (Staff Zalo group showing an incoming-payment alert with amount and note) -->*The whole staff group sees the alert the moment a customer pays, no one has to ask anyone else.*

## Set it up in 4 steps

### 1. Connect the shop's bank account

At [my.monapay.vn](https://my.monapay.vn), create an account, then under Bank enter the account number and phone number registered with the bank. Confirm with the two OTP codes sent to the owner's phone.

### 2. Add a staff Zalo or Telegram group

Create a group with the owner and 5 to 7 staff on shift, add the MONA Pay bot following the dashboard instructions. Every payment into the connected account now becomes a message in the group.

### 3. Turn on the read-aloud counter screen

Open the payment-alert link from the dashboard on a phone or tablet fixed at the counter, tap once to allow audio, and leave the screen on. It reads new payments aloud without anyone touching it again, useful when the cashier's hands are busy.

<figure class="photo">
  <picture>
    <source srcset="/img/dashboard/loa-dashboard.avif" type="image/avif" />
    <source srcset="/img/dashboard/loa-dashboard.webp" type="image/webp" />
    <img src="/img/dashboard/loa-dashboard.png" width="1280" height="860" loading="lazy" decoding="async" alt="MONA Pay dashboard Read-aloud alert screen with instructions for a counter phone or tablet" />
  </picture>
  <figcaption>The Read-aloud alert section creates a dedicated link for the device at the counter, captured from the my.monapay.vn dashboard.</figcaption>
</figure>

<figure class="doc-phone-shot doc-phone-shot-single">
  <picture>
    <source srcset="/img/dashboard/loa-public.avif" type="image/avif" />
    <source srcset="/img/dashboard/loa-public.webp" type="image/webp" />
    <img src="/img/dashboard/loa-public.png" width="424" height="1132" loading="lazy" decoding="async" alt="MONA Pay read-aloud counter screen enabled on a phone with the latest milk tea shop transactions" />
  </picture>
  <figcaption>The counter screen is enabled, showing the latest 450,000đ payment and recent alerts, captured from the my.monapay.vn dashboard.</figcaption>
</figure>

### 4. Print a QR code for tables or the counter

Print the shop's bank QR code and stick it on tables, or one shared code at the counter. Customers scan with their banking app and land on the right account automatically.

## Tips for restaurants and drink shops

**Give transfer notes a pattern**, like "table 3" or "takeaway 12", so staff reading the group alert instantly know which order it belongs to.

**A customer transfers a few thousand short.** The alert always shows the real amount received, so staff catch a mismatch immediately instead of at end-of-day reconciliation.

**Night shifts with no owner on site** still get the same alerts and read-aloud audio, since the system runs 24 hours regardless of who is on duty.

**Multiple counters or branches** can each use their own virtual account and their own Zalo group, so one counter never sees another counter's alerts unless the owner wants a combined view.

## Related pages

Selling takeaway orders through Facebook or Zalo too? Read [selling online](/en/docs/dung-ngay/ban-hang-online). Back to the [get started today overview](/en/docs/dung-ngay) for the support phone line.
