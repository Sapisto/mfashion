import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, AlignmentType,
  BorderStyle,
} from "docx";
import { writeFileSync } from "fs";

const BRAND = "C4773B";
const DARK = "111111";
const MUTED = "666666";

// ── Helpers ──────────────────────────────────────────────────────────────────

function section(title) {
  return new Paragraph({
    children: [new TextRun({ text: title, bold: true, size: 28, color: BRAND })],
    spacing: { before: 360, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "E8DDD0" } },
  });
}

function sub(title) {
  return new Paragraph({
    children: [new TextRun({ text: title, bold: true, size: 22, color: DARK })],
    spacing: { before: 200, after: 80 },
  });
}

function p(...runs) {
  return new Paragraph({
    children: runs,
    spacing: { after: 100 },
  });
}

function t(text, opts = {}) {
  return new TextRun({ text, size: 20, ...opts });
}

function bold(text) { return t(text, { bold: true }); }
function italic(text) { return t(text, { italics: true, color: MUTED }); }
function brand(text) { return t(text, { bold: true, color: BRAND }); }
function mono(text) { return t(text, { bold: true, size: 18, font: "Courier New" }); }

function step(num, ...runs) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${num}.`, bold: true, color: BRAND, size: 20 }),
      new TextRun({ text: "  " }),
      ...runs,
    ],
    indent: { left: 360 },
    spacing: { after: 100 },
  });
}

function bullet(...runs) {
  return new Paragraph({
    children: [new TextRun({ text: "•  " }), ...runs],
    indent: { left: 360 },
    spacing: { after: 80 },
  });
}

function note(...runs) {
  return new Paragraph({
    children: [new TextRun({ text: "Note:  ", bold: true, color: BRAND, size: 18 }), ...runs.map(r => typeof r === "string" ? new TextRun({ text: r, italics: true, color: MUTED, size: 18 }) : r)],
    spacing: { after: 120 },
    indent: { left: 360 },
  });
}

function space() {
  return new Paragraph({ text: "", spacing: { after: 120 } });
}

function infoRow(label, value, isMonospace = false) {
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20 })] })],
        width: { size: 32, type: WidthType.PERCENTAGE },
        margins: { top: 80, bottom: 80, left: 120, right: 80 },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, ...(isMonospace ? { font: "Courier New", bold: true } : {}) })] })],
        width: { size: 68, type: WidthType.PERCENTAGE },
        margins: { top: 80, bottom: 80, left: 120, right: 80 },
      }),
    ],
  });
}

function table(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(([l, v, mono]) => infoRow(l, v, mono)),
  });
}

// ── Document ──────────────────────────────────────────────────────────────────

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 20, color: DARK } } },
  },
  sections: [{
    properties: { page: { margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } },
    children: [

      // ── Opening letter ────────────────────────────────────────────────────
      new Paragraph({
        children: [new TextRun({ text: "AIE CLOTHING AFRICA", bold: true, size: 56, color: BRAND })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Your Online Fashion Store — A Complete Guide", size: 22, color: MUTED, italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),

      p(t("This guide covers everything you need to know to run your online store. You do not need to know anything about technology — just follow the steps. Keep this document somewhere safe and refer back to it whenever you need to.")),
      p(t("Your store is live at "), bold("www.aieclothing.com"), t(". Customers can browse your pieces, choose their size, pay online, and you get the money straight into your bank account. Everything else — adding new pieces, seeing orders, contacting customers — you do from your Admin Dashboard.")),

      space(),

      // ── Login Details ─────────────────────────────────────────────────────
      section("SECTION 1 — Your Login Details"),
      p(t("These are the details you need to access and manage your store. Write them down and keep them very safe.")),
      space(),

      sub("Admin Dashboard (where you manage the store)"),
      table([
        ["Website Address", "https://www.aieclothing.com/admin"],
        ["Your Email", "admin@aieclothing.com"],
        ["Your Password", "Password@123", true],
      ]),
      note("Go to this address on your phone or computer, enter your email and password, and you are in."),
      space(),

      sub("Paystack (where your money is collected)"),
      table([
        ["Paystack Website", "https://dashboard.paystack.com"],
        ["Login Email", "abdulazeezalasa@gmail.com"],
        ["Password", "Your Paystack account password"],
      ]),
      note("Paystack is the company that collects payment from your customers. Your money sits here until it moves to your bank account — usually the next business day."),
      space(),

      sub("Resend (the service that sends your emails)"),
      table([
        ["Resend Website", "https://resend.com"],
        ["Login", "Sign in with your Google account"],
      ]),
      note("You do not need to log into Resend regularly. It works automatically in the background sending order emails."),

      space(),

      // ── What the App Does ─────────────────────────────────────────────────
      section("SECTION 2 — What Your Store Does"),

      p(t("Here is a simple picture of how your business works now with the online store:")),
      space(),
      bullet(bold("Customer visits www.aieclothing.com "), t("on their phone or computer")),
      bullet(t("They browse your pieces, choose their size and quantity, and add to their cart")),
      bullet(t("They go to checkout, fill in their name, phone number, and delivery address")),
      bullet(t("They pay securely using their bank card, bank transfer, or USSD (no cash needed)")),
      bullet(t("Their payment goes into your "), bold("Paystack account"), t(" immediately")),
      bullet(t("You receive an "), bold("email notification"), t(" telling you someone has ordered")),
      bullet(t("You also receive a "), bold("WhatsApp message option"), t(" to contact the customer directly")),
      bullet(t("You prepare the order, ship it, and update the status in your dashboard")),
      bullet(t("Paystack sends the money to your "), bold("bank account the next business day")),
      space(),
      p(t("Everything happens automatically — you just need to check your orders and prepare the pieces for delivery.")),

      space(),

      // ── Adding Products ────────────────────────────────────────────────────
      section("SECTION 3 — How to Add a New Product"),

      p(t("Every time you have a new piece to sell, follow these steps to add it to your store. It takes about 5 minutes.")),
      space(),
      step(1, bold("Log into your Admin Dashboard"), t(" — go to www.aieclothing.com/admin on your phone")),
      step(2, t("Click "), bold("'Products'"), t(" in the menu, then click the orange "), bold("'Add Product'"), t(" button")),
      step(3, t("Fill in the "), bold("Product Name"), t(" — be clear and descriptive. Example: "), italic('"Red Ankara Peplum Short Dress"')),
      step(4, t("Write a "), bold("Description"), t(" — talk about the fabric, the style, what occasions it suits, how it fits. Good descriptions help customers decide to buy.")),
      step(5, t("Enter the "), bold("Price"), t(" in Naira — numbers only, no ₦ symbol. Example: "), italic("22000")),
      step(6, t("Enter the "), bold("Stock"), t(" — how many pieces you have available. If you have 3, type 3.")),
      step(7, t("Choose the "), bold("Category"), t(" — pick the right one (Bubu Designs, Asooke, Tops and Short, etc.)")),
      step(8, t("Tick "), bold("'Featured'"), t(" if you want this piece to appear on the home page. Tick "), bold("'Active'"), t(" so customers can see it — always tick this.")),
      step(9, t("Click "), bold("'Upload from device'"), t(" to add your photos from your phone. You can upload multiple photos. The first one becomes the main photo customers see.")),
      step(10, t("Add "), bold("Sizes"), t(" — type each size and press Enter: S, M, L, XL, XXL, 3XL. Add whichever sizes you have.")),
      step(11, t("Add "), bold("Colours or variants"), t(" if needed — type the colour name and press Enter. Example: "), italic('"Red Ankara", "Blue Ankara"')),
      step(12, t("Click "), bold("'Create Product'"), t(" — the piece is now live on your store immediately")),

      space(),
      sub("Tips for Good Product Photos"),
      bullet(t("Take photos near a "), bold("window in natural light"), t(" — this makes colours look accurate and bright")),
      bullet(t("Use a "), bold("plain background"), t(" — white wall, cream fabric, or plain door")),
      bullet(t("Take at least 3 photos: "), bold("front, back, and a close-up"), t(" of the fabric or detail")),
      bullet(t("If you have a model or mannequin, use it — pieces sell better when shown on a person")),
      bullet(t("On iPhone: use "), bold("Portrait mode"), t(" for clean, professional-looking shots")),
      bullet(t("Avoid dark photos, cluttered backgrounds, or photos with watermarks on them")),

      space(),

      // ── Orders ────────────────────────────────────────────────────────────
      section("SECTION 4 — How to See and Manage Your Orders"),

      p(t("Every time a customer pays and places an order, it appears in your Orders section. You will also receive an email notification.")),
      space(),

      sub("Viewing Your Orders"),
      step(1, t("Log into your Admin Dashboard")),
      step(2, t("Click "), bold("'Orders'"), t(" in the menu")),
      step(3, t("You will see a list of all orders — newest at the top")),
      step(4, t("Click on any order row to open it and see all the details")),
      space(),

      sub("What You See in an Order"),
      bullet(bold("Customer name, email, and phone number")),
      bullet(bold("Delivery address"), t(" — the address they want it sent to")),
      bullet(bold("Items ordered"), t(" — which pieces, what size, what colour, how many")),
      bullet(bold("Total amount paid")),
      bullet(t("A "), bold("'WhatsApp Customer' button"), t(" — click this to message them directly on WhatsApp")),
      space(),

      sub("Updating the Order Status"),
      p(t("Use the Status dropdown on each order to show where things are:")),
      bullet(bold("Pending"), t(" — you just received it, not processed yet")),
      bullet(bold("Processing"), t(" — you are preparing the order")),
      bullet(bold("Shipped"), t(" — you have sent it out for delivery")),
      bullet(bold("Delivered"), t(" — the customer has received it")),
      bullet(bold("Cancelled"), t(" — the order was cancelled for any reason")),
      note("Always update the status when you ship — it helps you track everything and looks professional to customers."),

      space(),

      // ── Payments ──────────────────────────────────────────────────────────
      section("SECTION 5 — Payments and Money"),

      sub("How It Works"),
      p(t("Customers pay through "), bold("Paystack"), t(" — they can use their debit card, bank transfer, or USSD. The moment they pay, the money enters your Paystack account. Paystack then transfers it to your bank account "), bold("automatically the next business day"), t(".")),
      space(),

      sub("Paystack Fees"),
      p(t("Paystack charges a small fee on each transaction — this is standard and taken automatically:")),
      table([
        ["Fee Rate", "1.5% of the order + ₦100 flat fee"],
        ["Maximum fee ever", "₦2,000 (no matter how large the order)"],
        ["Example — ₦15,000 order", "Fee: ₦325 → You receive: ₦14,675"],
        ["Example — ₦30,000 order", "Fee: ₦550 → You receive: ₦29,450"],
        ["Example — ₦50,000 order", "Fee: ₦850 → You receive: ₦49,150"],
      ]),
      note("You never pay these fees separately — they are automatically deducted before the money reaches you."),
      space(),

      sub("How to Get Your Money from Paystack"),
      step(1, t("Log into "), bold("dashboard.paystack.com"), t(" with your email and password")),
      step(2, t("Go to "), bold("Settings → Accounts")),
      step(3, t("Add your bank account — enter your bank name and account number")),
      step(4, t("Paystack will verify it, then all future payments settle there automatically every business day")),
      note("Once your bank account is added, you do not need to do anything — money moves on its own."),

      space(),

      // ── Emails ────────────────────────────────────────────────────────────
      section("SECTION 6 — Emails and Notifications"),

      p(t("The store sends emails automatically — you do not need to do anything.")),
      space(),

      sub("What the Customer Receives"),
      p(t("After every successful payment, the customer receives a beautiful confirmation email with:")),
      bullet(t("Their order reference number")),
      bullet(t("A full list of what they ordered with sizes and prices")),
      bullet(t("The total amount paid")),
      bullet(t("Their delivery address")),
      bullet(t("A WhatsApp button to contact you if they have questions")),
      space(),

      sub("What You Receive"),
      p(t("At the same time, you (the admin) receive a notification email with:")),
      bullet(t("The customer's full name, email address, and phone number")),
      bullet(t("Their complete delivery address")),
      bullet(t("Every item they ordered")),
      bullet(t("The total order value")),
      bullet(t("A direct link to view the order in your dashboard")),
      bullet(t("A WhatsApp button to message the customer with one click")),

      space(),

      // ── Common Tasks ──────────────────────────────────────────────────────
      section("SECTION 7 — Common Things You Will Do"),

      sub("Hide a product temporarily (e.g. it is sold out or being remade)"),
      step(1, t("Go to Admin → Products")),
      step(2, t("Find the product and click the pencil/edit icon")),
      step(3, t("Untick "), bold("'Active'"), t(" and click Save — it disappears from the store but is NOT deleted")),
      step(4, t("To bring it back, edit it again and tick Active")),
      space(),

      sub("Update stock when you make more pieces"),
      step(1, t("Go to Admin → Products → Edit the product")),
      step(2, t("Change the "), bold("Stock"), t(" number to the new quantity")),
      step(3, t("Click Save")),
      space(),

      sub("Add a new category"),
      step(1, t("Go to Admin → Categories")),
      step(2, t("Type the new category name in the box and click "), bold("'Add'")),
      space(),

      sub("Change a product's price"),
      step(1, t("Go to Admin → Products → Edit the product")),
      step(2, t("Change the Price number and click Save — the new price shows immediately")),

      space(),

      // ── Troubleshooting ────────────────────────────────────────────────────
      section("SECTION 8 — If Something Goes Wrong"),

      sub("'I cannot log in'"),
      bullet(t("Make sure you are visiting "), bold("www.aieclothing.com/admin"), t(" — not the shop page")),
      bullet(t("Check your email and password are typed correctly (password is: "), new TextRun({ text: "Password@123", bold: true, font: "Courier New", size: 20 }), t(")")),
      bullet(t("Try opening it in a different browser or on a different phone")),
      bullet(t("If still not working, call Abdulazeez")),
      space(),

      sub("'A product is showing Sold Out but I have stock'"),
      bullet(t("Go to Admin → Products → Edit the product → update the Stock number → Save")),
      space(),

      sub("'A customer says they paid but I cannot see the order'"),
      bullet(t("Go to Admin → Orders — scroll down or check the next page")),
      bullet(t("Log into Paystack to confirm the payment came through")),
      bullet(t("Contact Abdulazeez with the customer's name and payment amount")),
      space(),

      sub("'The store is not opening / something looks broken'"),
      bullet(t("Try refreshing the page (pull down on your phone)")),
      bullet(t("Try opening it on a different network (switch from WiFi to mobile data or vice versa)")),
      bullet(t("If the problem continues, contact Abdulazeez immediately")),

      space(),

      // ── Key Links ─────────────────────────────────────────────────────────
      section("SECTION 9 — All Your Important Links"),
      table([
        ["Your Store", "https://www.aieclothing.com"],
        ["Admin Dashboard", "https://www.aieclothing.com/admin"],
        ["Admin Login", "https://www.aieclothing.com/admin/login"],
        ["Products", "https://www.aieclothing.com/admin/products"],
        ["Orders", "https://www.aieclothing.com/admin/orders"],
        ["Paystack Dashboard", "https://dashboard.paystack.com"],
        ["Instagram", "https://www.instagram.com/aieclothingafrica"],
      ]),

      space(),

      // ── Closing ───────────────────────────────────────────────────────────
      section("Developer Contact"),
      p(t("For any technical issues with the store, contact your developer:")),
      table([
        ["Name", "Abdulazeez Alhassan"],
        ["WhatsApp", "+234 707 972 7740"],
        ["Email", "abdulazeezalasa@gmail.com"],
      ]),
      space(),
      p(t("Your fashion is genuinely great and this store will help more people discover it. Just log in, add your pieces, and respond to your orders — the technology handles everything else.")),
      space(),

      new Paragraph({
        children: [new TextRun({ text: "AIE Clothing Africa  —  a style for everyone...  🇳🇬", italics: true, color: BRAND, size: 20 })],
        alignment: AlignmentType.CENTER,
      }),
    ],
  }],
});

const buffer = await Packer.toBuffer(doc);
writeFileSync("AIE-Clothing-Store-Guide.docx", buffer);
console.log("✅ Done — AIE-Clothing-Store-Guide.docx");
