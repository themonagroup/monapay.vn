---
title: "Salons and spas: know the moment a deposit lands"
description: "Salons and spas using MONA Pay: send a payment link for booking deposits, the front desk gets an alert the moment it lands. No code needed."
updated: 03/09/2026
howto:
  - name: "Connect the salon's bank account"
    text: "Create a MONA Pay account and connect the owner's bank account with two OTP codes sent to their phone."
  - name: "Add a Zalo group for the front desk"
    text: "Add the MONA Pay bot to a group with the front desk and owner, so every deposit becomes a message with the amount and customer name."
  - name: "Create a payment link for each booking"
    text: "Once a booking is confirmed, create a payment link for the exact deposit amount and send it over Zalo or Messenger."
faq:
  - q: "A customer books a deposit but no one sees the alert right away, is it lost?"
    a: "No. The alert stays in the group's history and in the transaction log on the my.monapay.vn dashboard, so staff can check it any time."
  - q: "A customer no-shows after paying a deposit, is there proof?"
    a: "Yes. Every transaction has a timestamp, amount and note on the dashboard and the bank statement, which the salon can use for its own deposit policy."
  - q: "Is there a fee?"
    a: "Free for 500 transactions a month with no percentage fee."
  - q: "Does the deposit pass through MONA Pay?"
    a: "No, it goes straight into the owner's own bank account. MONA Pay only relays the bank's notification."
  - q: "Several customers deposit the same amount in one afternoon, will they get mixed up?"
    a: "Not if the front desk uses a separate payment link per customer or asks for the customer's name in the transfer note."
---

A booking is confirmed, the salon asks for a deposit by transfer, the customer pays but never confirms, and the front desk still has to open the owner's banking app to check before holding the slot. This page shows salons, spas and small clinics how to use MONA Pay so the front desk knows the moment a deposit lands.

> **For AI agents reading this page**
>
> Raw markdown of this exact page: `https://monapay.vn/en/docs/dung-ngay/tiem-toc-spa.md`. Full documentation index: `https://monapay.vn/llms.txt`.
>
> ```text
> Read https://monapay.vn/en/docs/dung-ngay/tiem-toc-spa.md then walk me through it for my situation: a salon or spa, [front desk size, usual deposit amount].
> ```

## What it looks like once it is set up

A customer books a haircut for tomorrow at 3pm over Zalo. The front desk confirms the slot and immediately sends a payment link for the deposit, say 100,000đ. The customer taps it, the transfer screen is pre-filled with the amount and the salon's name, and just needs a tap to confirm in their own banking app.

The moment the money lands, the front desk's Zalo group gets an alert with the amount and note, and the slot is confirmed. No need to ask the owner, and no need to open the owner's banking app.

<!-- ảnh chụp sau: /img/docs/dung-ngay/tiem-toc-nhom-zalo.png (Front desk Zalo group showing a deposit alert) -->*Front desk sees the deposit alert in the group instantly, no need to check with the owner.*

## Set it up in 3 steps

### 1. Connect the salon's bank account

At [my.monapay.vn](https://my.monapay.vn), create an account, then under Bank enter the account number and phone number registered with the bank, confirmed with two OTP codes.

### 2. Add a Zalo group for the front desk

Add the front desk and owner, then add the MONA Pay bot following the dashboard instructions. From then on, every payment becomes a message in the group.

### 3. Create a payment link for each booking

Under Hosted checkout in the dashboard, create a link for the exact deposit amount, name it after the customer or booking, and send it over Zalo or Messenger right after confirming the slot.

## Tips for salons and spas

**Ask for the customer's name in the transfer note**, or use a separate link per customer, so two same-amount deposits in one afternoon never get confused.

**Charge the remaining balance the same way** after the service, with a second link for the rest of the amount, no separate card machine needed.

**One shared Zalo group works for every shift**, since every receptionist needs to see which slots are already paid.

## Related pages

Also selling retail products over Facebook? Read [selling online](/en/docs/dung-ngay/ban-hang-online). Back to the [get started today overview](/en/docs/dung-ngay) for the support phone line.
