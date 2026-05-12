# AIE Clothing Africa — Store Owner's Guide

**Your store:** https://www.aieclothing.com  
**Admin dashboard:** https://www.aieclothing.com/admin  
**Admin email:** admin@aieclothing.com  

---

## Table of Contents
1. [Logging In](#1-logging-in)
2. [Adding a Product](#2-adding-a-product)
3. [Managing Orders](#3-managing-orders)
4. [Managing Categories](#4-managing-categories)
5. [Understanding the Dashboard](#5-understanding-the-dashboard)
6. [How Payments Work](#6-how-payments-work)
7. [How Delivery Works](#7-how-delivery-works)
8. [Emails & Notifications](#8-emails--notifications)
9. [Tips for Great Product Photos](#9-tips-for-great-product-photos)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Logging In

1. Go to **https://www.aieclothing.com/admin/login**
2. Enter your email and password
3. You will land on the **Dashboard**

> If you forget your password, contact your developer (Abdulazeez).

---

## 2. Adding a Product

This is how a new piece goes live on the store.

1. Go to **Admin → Products → Add Product** (or click the orange button)
2. Fill in the details:

| Field | What to enter | Example |
|-------|--------------|---------|
| **Product Name** | Full name of the piece | "Red Ankara Peplum Dress" |
| **Description** | Describe it well — fabric, style, fit, occasions | "A stunning peplum dress crafted from bold red Ankara print..." |
| **Price (₦)** | Price in Naira, numbers only | 22000 |
| **Stock** | How many you have available | 5 |
| **Category** | Pick the right category | Bubu Designs |
| **Featured** | Tick this to show on the home page | ✅ |
| **Active** | Must be ticked for customers to see it | ✅ |

3. **Upload Photos:**
   - Click **"Upload from device"** and select photos from your phone/computer
   - You can upload multiple photos (show front, back, detail)
   - Photos are automatically compressed — any size works
   - First photo uploaded becomes the main display photo

4. **Add Sizes** (e.g. S, M, L, XL, XXL) — type each size and press Enter

5. **Add Colours/Variants** (e.g. "Red Ankara", "Blue Ankara") — type and press Enter

6. Click **"Create Product"** — it goes live immediately

---

## 3. Managing Orders

Every time a customer pays, the order appears here.

### Viewing Orders
- Go to **Admin → Orders**
- Click any row to see the full order details

### Order Details page shows:
- Customer name, email, phone number
- Delivery address
- Items ordered with sizes and colours
- Amount paid
- **"WhatsApp Customer"** button — click to message them directly

### Updating Order Status
Use the dropdown on each order to update the status:

| Status | When to use |
|--------|------------|
| **Pending** | Just received, not processed yet |
| **Processing** | You are preparing the order |
| **Shipped** | Sent out for delivery |
| **Delivered** | Customer received it |
| **Cancelled** | Order was cancelled |

> **Tip:** Update the status when you ship — customers will feel informed.

---

## 4. Managing Categories

Categories help customers find items faster.

**Current categories:**
- Tops and Short
- Asooke Patch Work
- Bubu Designs
- Men Kaftan
- Asooke
- Tops and Trousers
- Ankara and Asooke Jacket

### Adding a new category:
1. Go to **Admin → Categories**
2. Type the category name → click **Add**

### Deleting a category:
- You can only delete a category that has **no products** in it
- Move or delete products first

---

## 5. Understanding the Dashboard

The dashboard shows at a glance:

- **Total Revenue** — all money received from confirmed payments
- **Total Orders** — how many orders have been placed
- **Active Products** — how many pieces are listed
- **Average Order Value** — average spend per customer
- **Recent Orders** — last 5 orders with quick links

---

## 6. How Payments Work

- Customers pay through **Paystack** (card, bank transfer, USSD)
- Money goes directly to your Paystack account
- Paystack settles to your bank account **next business day**
- Paystack charges **1.5% + ₦100** per transaction (max ₦2,000)

**Example:** A ₦22,000 order — Paystack takes ₦430, you receive ₦21,570.

### To withdraw from Paystack to your bank:
1. Log in at **dashboard.paystack.com**
2. Go to **Settings → Accounts** — make sure your bank account is added
3. Settlements happen automatically every business day

---

## 7. How Delivery Works

Delivery fees are added automatically at checkout:

| Location | Fee |
|----------|-----|
| Lagos | ₦2,500 |
| All other states | ₦3,500 |

> These fees are included in what the customer pays. You arrange delivery yourself after receiving the order.

**Recommended delivery services in Nigeria:**
- **GIG Logistics** — reliable nationwide
- **Kwik Delivery** — fast in Lagos
- **DHL Nigeria** — premium option

---

## 8. Emails & Notifications

When a customer places an order, **two emails are sent automatically:**

1. **Customer** receives an order confirmation with:
   - Order reference number
   - Items ordered
   - Total amount paid
   - Delivery address
   - WhatsApp link to contact you

2. **You (admin)** receive a new order alert with:
   - All customer details
   - Link straight to the order in the dashboard
   - WhatsApp button to message the customer immediately

---

## 9. Tips for Great Product Photos

Good photos = more sales. Here's what works:

**✅ Do:**
- Use natural daylight — near a window is perfect
- Take photos on a plain background (white, cream, or your brand colour)
- Show the full outfit — front view, back view, and a detail shot
- Show the fabric texture up close
- Show it on a model if possible

**❌ Avoid:**
- Dark or blurry photos
- Cluttered backgrounds
- Logos or watermarks covering the garment

**Phone tip:** On iPhone, use **Portrait mode** for clean, professional-looking shots.

---

## 10. Troubleshooting

### "I can't log in"
- Check your email and password are correct
- Make sure you're on https://www.aieclothing.com/admin/login (not localhost)
- Contact Abdulazeez if the issue persists

### "A product is showing as Sold Out but I have stock"
- Go to **Admin → Products → Edit** the product
- Update the **Stock** number
- Click Save

### "A customer says they paid but I don't see the order"
- Check **Admin → Orders** — it should be there
- Check Paystack dashboard to confirm the payment
- The order may show as "Pending" if payment verification is delayed
- Contact Abdulazeez with the payment reference number

### "I want to hide a product temporarily"
- Go to **Admin → Products → Edit** the product
- Untick **"Active"**
- Save — product disappears from the store but is NOT deleted

### "I want to delete a product permanently"
- Go to **Admin → Products**
- Click the trash icon on the product row
- Confirm deletion

---

## Key Links

| Page | URL |
|------|-----|
| Your store | https://www.aieclothing.com |
| Admin login | https://www.aieclothing.com/admin/login |
| Dashboard | https://www.aieclothing.com/admin |
| Products | https://www.aieclothing.com/admin/products |
| Orders | https://www.aieclothing.com/admin/orders |
| Paystack | https://dashboard.paystack.com |

---

## Contact Your Developer

For technical issues, contact **Abdulazeez Alhassan**  
Email: abdulazeezalasa@gmail.com  
WhatsApp: +2347079727740

---

*Document prepared by Abdulazeez Alhassan — May 2026*  
*AIE Clothing Africa — a style for everyone...*
