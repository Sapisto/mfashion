import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";

const BRAND   = "#C4773B";
const DARK    = "#111111";
const MUTED   = "#777777";
const ROW_A   = "#FDF8F4";
const ROW_B   = "#FFFFFF";
const DIVIDER = "#E8DDD0";

const W = 595.28;   // A4 width
const ML = 55;      // left margin
const MR = 55;      // right margin
const CONTENT_W = W - ML - MR;

const doc = new PDFDocument({
  margins: { top: 55, bottom: 55, left: ML, right: MR },
  size: "A4",
  info: { Title: "AIE Clothing Africa — Store Guide", Author: "Abdulazeez Alasa" },
  autoFirstPage: false,
});

doc.pipe(createWriteStream("AIE-Clothing-Store-Guide.pdf"));
doc.addPage();

// ── Utilities ─────────────────────────────────────────────────────────────────

function gap(n = 0.5) { doc.moveDown(n); }

function sectionTitle(text) {
  gap(0.6);
  const y = doc.y;
  doc.rect(ML - 4, y - 2, CONTENT_W + 8, 24).fill(DARK);
  doc.font("Helvetica-Bold").fontSize(11).fillColor(BRAND)
     .text(text, ML + 4, y + 5, { width: CONTENT_W });
  doc.y = y + 28;
  gap(0.3);
}

function subTitle(text) {
  gap(0.2);
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor(DARK)
     .text(text, ML, doc.y);
  doc.moveTo(ML, doc.y + 1).lineTo(ML + CONTENT_W, doc.y + 1)
     .strokeColor(DIVIDER).lineWidth(0.5).stroke();
  gap(0.3);
}

function body(text) {
  doc.font("Helvetica").fontSize(10).fillColor(DARK)
     .text(text, ML, doc.y, { width: CONTENT_W, lineGap: 2 });
  gap(0.2);
}

function bullet(text, boldPart = "") {
  const bx = ML + 12;
  const bw = CONTENT_W - 12;
  doc.font("Helvetica").fontSize(10).fillColor(MUTED)
     .text("•", ML, doc.y, { width: 10, continued: false });
  const y = doc.y - doc.currentLineHeight() - 1;
  if (boldPart) {
    doc.font("Helvetica-Bold").fontSize(10).fillColor(DARK)
       .text(boldPart, bx, y, { continued: true, width: bw });
    doc.font("Helvetica").fillColor(DARK).text(text, { lineGap: 2, width: bw });
  } else {
    doc.font("Helvetica").fontSize(10).fillColor(DARK)
       .text(text, bx, y, { width: bw, lineGap: 2 });
  }
  gap(0.1);
}

function step(num, boldLabel, rest = "") {
  const bx = ML + 18;
  const bw = CONTENT_W - 18;
  doc.font("Helvetica-Bold").fontSize(10).fillColor(BRAND)
     .text(`${num}.`, ML, doc.y, { width: 16, continued: false });
  const y = doc.y - doc.currentLineHeight() - 1;
  doc.font("Helvetica-Bold").fontSize(10).fillColor(DARK)
     .text(boldLabel, bx, y, { continued: !!rest, width: bw });
  if (rest) {
    doc.font("Helvetica").fillColor(MUTED).text(rest, { lineGap: 2, width: bw });
  }
  gap(0.15);
}

function note(text) {
  gap(0.1);
  doc.rect(ML, doc.y, CONTENT_W, 1).fill(DIVIDER);
  gap(0.15);
  doc.font("Helvetica-Oblique").fontSize(9).fillColor(MUTED)
     .text(`💡  ${text}`, ML + 6, doc.y, { width: CONTENT_W - 6, lineGap: 2 });
  gap(0.3);
}

function table(rows) {
  const col1 = 165;
  const col2 = CONTENT_W - col1;
  const rh   = 20;
  let y = doc.y;

  rows.forEach(([label, value], i) => {
    if (y + rh > 780) { doc.addPage(); y = 55; }
    doc.rect(ML, y, CONTENT_W, rh).fill(i % 2 === 0 ? ROW_A : ROW_B);
    doc.rect(ML, y, CONTENT_W, rh).strokeColor(DIVIDER).lineWidth(0.4).stroke();
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor(DARK)
       .text(label, ML + 7, y + 5, { width: col1 - 10, lineBreak: false });
    doc.font("Helvetica").fontSize(9.5).fillColor(DARK)
       .text(value, ML + col1 + 7, y + 5, { width: col2 - 10, lineBreak: false });
    y += rh;
  });

  doc.y = y;
  gap(0.4);
}

// ── COVER ─────────────────────────────────────────────────────────────────────

doc.rect(0, 0, W, 120).fill(DARK);
doc.font("Helvetica-Bold").fontSize(30).fillColor(BRAND)
   .text("AIE CLOTHING AFRICA", 0, 28, { align: "center", width: W });
doc.font("Helvetica").fontSize(13).fillColor("#FFFFFF")
   .text("Store Owner's Guide", 0, 72, { align: "center", width: W });
doc.font("Helvetica-Oblique").fontSize(10).fillColor(BRAND)
   .text("a style for everyone...", 0, 96, { align: "center", width: W });

doc.y = 135;

body("Your store is live at www.aieclothing.com. Customers shop, pay online, and the money goes straight to your bank. Everything — products, orders, customer messages — is managed from your Admin Dashboard.");

// ── SECTION 1 ─────────────────────────────────────────────────────────────────

sectionTitle("SECTION 1 — Login Details");

subTitle("Admin Dashboard");
table([
  ["Website", "https://www.aieclothing.com/admin"],
  ["Email", "admin@aieclothing.com"],
  ["Password", "Password@123"],
]);

subTitle("Paystack");
table([
  ["Website", "https://dashboard.paystack.com"],
  ["Email", "aieuniquethread@gmail.com"],
  ["Password", "Aieclothing@32"],
]);
note("Payments from customers land here first, then move to your bank account the next business day.");

subTitle("Resend (sends order emails automatically — rarely need to log in)");
table([
  ["Website", "https://resend.com"],
  ["Login", "Sign in with your Google account"],
]);

// ── SECTION 2 ─────────────────────────────────────────────────────────────────

sectionTitle("SECTION 2 — How It Works");

bullet("Customer visits www.aieclothing.com, browses, picks their size, adds to cart");
bullet("They checkout, fill in their delivery address, and pay — card, bank transfer, or USSD");
bullet("Money hits your ", "Paystack account immediately");
bullet("You get an ", "email notification with all the order details");
bullet("You prepare and ship the order, then update the status in your dashboard");
bullet("Paystack moves the money to your ", "bank account the next business day");

// ── SECTION 3 ─────────────────────────────────────────────────────────────────

sectionTitle("SECTION 3 — Adding a Product");

step(1, "Go to Admin → Products → click Add Product");
step(2, "Product Name — ", 'e.g. "Red Ankara Peplum Short Dress"');
step(3, "Description — ", "describe the fabric, fit, style, and what occasions it suits. Good descriptions help people decide to buy.");
step(4, "Price — ", "numbers only, no ₦ symbol. e.g. 22000");
step(5, "Stock — ", "how many pieces you have. If you have 3, type 3.");
step(6, "Category — ", "Bubu Designs, Asooke, Tops and Short, Men Kaftan, etc.");
step(7, "Tick Featured", " if you want it on the home page. Always tick Active so customers can see it.");
step(8, "Upload from device — ", "select photos from your phone. You can upload multiple. The first photo becomes the main display image.");
step(9, "Sizes — ", "type S, M, L, XL, XXL etc. and press Enter after each one");
step(10, "Colours — ", 'type the colour name e.g. "Red Ankara" and press Enter');
step(11, "Click Create Product — ", "the piece goes live on the store immediately");

gap(0.3);
subTitle("Photo Tips");
bullet("Take photos near a window in natural light — colours look accurate and bright");
bullet("Use a plain background — white wall, cream fabric, or a plain door");
bullet("Take at least 3 shots: front view, back view, and a close-up of the fabric");
bullet("If you have a model or mannequin, use it — pieces sell better on a person");
bullet("Portrait mode on iPhone gives clean, professional-looking results");
bullet("Avoid dark photos, cluttered backgrounds, or watermarks on the garment");

// ── SECTION 4 ─────────────────────────────────────────────────────────────────

sectionTitle("SECTION 4 — Managing Orders");

body("Every paid order appears here automatically. You will also get an email notification.");

step(1, "Go to Admin → Orders");
step(2, "Click on any row to open the full order details");
step(3, "Click WhatsApp Customer", " to message them directly");
step(4, "Use the Status dropdown to update as you go:");

gap(0.1);
bullet("Pending", " — just received, not processed yet");
bullet("Processing", " — you are preparing the order");
bullet("Shipped", " — sent out for delivery");
bullet("Delivered", " — customer has received it");
bullet("Cancelled", " — if the order needs to be cancelled");

gap(0.2);
note("Always update the status when you ship — it keeps your records clean and customers feel informed.");

subTitle("What You See Inside an Order");
bullet("Customer name, email, and phone number");
bullet("Delivery address");
bullet("Every item ordered — product name, size, colour, quantity");
bullet("Total amount paid");
bullet("WhatsApp button to message the customer with one click");

// ── SECTION 5 ─────────────────────────────────────────────────────────────────

sectionTitle("SECTION 5 — Payments & Money");

body("Customers pay through Paystack — card, bank transfer, or USSD. The moment they pay, money enters your Paystack account. It then transfers to your bank account automatically the next business day.");

gap(0.2);
table([
  ["Paystack fee", "1.5% + ₦100 per order (max ₦2,000)"],
  ["₦15,000 order", "Fee: ₦325  →  You receive ₦14,675"],
  ["₦30,000 order", "Fee: ₦550  →  You receive ₦29,450"],
  ["₦50,000 order", "Fee: ₦850  →  You receive ₦49,150"],
]);
note("Fees are deducted automatically — you never pay them separately.");

subTitle("To Receive Money in Your Bank");
step(1, "Log into dashboard.paystack.com");
step(2, "Go to Settings → Accounts");
step(3, "Add your bank account — enter your bank name and account number");
step(4, "Paystack verifies it, and all future payments settle there automatically");

// ── SECTION 6 ─────────────────────────────────────────────────────────────────

sectionTitle("SECTION 6 — Emails & Notifications");

body("The store sends emails automatically on every order — you do not need to do anything.");

subTitle("Customer receives");
bullet("Order reference number");
bullet("Full list of items with sizes and prices");
bullet("Total amount paid");
bullet("Delivery address");
bullet("A WhatsApp button to contact you directly");

gap(0.2);
subTitle("You receive");
bullet("Customer's full name, email address, and phone number");
bullet("Complete delivery address");
bullet("Every item ordered with sizes and colours");
bullet("Total order value");
bullet("A direct link to view the order in your dashboard");
bullet("A WhatsApp button to message the customer with one click");

// ── SECTION 7 ─────────────────────────────────────────────────────────────────

sectionTitle("SECTION 7 — Common Quick Tasks");

subTitle("Hide a product temporarily (sold out or being remade)");
step(1, "Admin → Products → find the product → click Edit");
step(2, "Untick Active and click Save");
step(3, "The product disappears from the store but is NOT deleted");
step(4, "To bring it back, edit it again and tick Active");

gap(0.2);
subTitle("Update stock when you make more pieces");
step(1, "Admin → Products → Edit the product");
step(2, "Change the Stock number to the new quantity → Save");

gap(0.2);
subTitle("Change a product's price");
step(1, "Admin → Products → Edit the product");
step(2, "Update the Price number → Save — new price shows immediately");

gap(0.2);
subTitle("Add a new category");
step(1, "Admin → Categories");
step(2, "Type the new category name → click Add");

// ── SECTION 8 ─────────────────────────────────────────────────────────────────

sectionTitle("SECTION 8 — Troubleshooting");

subTitle("Cannot log in");
bullet("Make sure you are on www.aieclothing.com/admin — not the shop page");
bullet("Email: admin@aieclothing.com   Password: Password@123");
bullet("Try a different browser or phone");
bullet("If it still does not work, call Abdulazeez");

gap(0.2);
subTitle("Product shows Sold Out but you have stock");
bullet("Admin → Products → Edit → update the Stock number → Save");

gap(0.2);
subTitle("Customer says they paid but order is not showing");
bullet("Check Admin → Orders — scroll down or check the next page");
bullet("Log into Paystack to confirm the payment came through");
bullet("Call Abdulazeez with the customer's name and payment amount");

gap(0.2);
subTitle("Store looks broken or will not open");
bullet("Pull down to refresh on your phone");
bullet("Switch between WiFi and mobile data");
bullet("If the problem continues, call Abdulazeez immediately");

// ── SECTION 9 ─────────────────────────────────────────────────────────────────

sectionTitle("SECTION 9 — All Your Important Links");

table([
  ["Your Store", "https://www.aieclothing.com"],
  ["Admin Dashboard", "https://www.aieclothing.com/admin"],
  ["Admin Login", "https://www.aieclothing.com/admin/login"],
  ["Products", "https://www.aieclothing.com/admin/products"],
  ["Orders", "https://www.aieclothing.com/admin/orders"],
  ["Paystack", "https://dashboard.paystack.com"],
  ["Instagram", "https://www.instagram.com/aieclothingafrica"],
]);

// ── Developer Contact ─────────────────────────────────────────────────────────

sectionTitle("Developer Contact");

table([
  ["Name", "Abdulazeez Alasa"],
  ["WhatsApp", "+234 707 972 7740"],
  ["Email", "abdulazeezalasa@gmail.com"],
]);

gap(0.5);
doc.font("Helvetica-Oblique").fontSize(11).fillColor(BRAND)
   .text("AIE Clothing Africa  —  a style for everyone...  🇳🇬", ML, doc.y, {
     align: "center", width: CONTENT_W,
   });

doc.end();
