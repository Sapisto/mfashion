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

      p(t("Your store is live at "), bold("www.aieclothing.com"), t(". Customers shop, pay online, and the money goes straight to your bank. Everything — products, orders, customer messages — is managed from your Admin Dashboard.")),

      space(),

      // ── Login Details ─────────────────────────────────────────────────────
      section("SECTION 1 — Login Details"),
      space(),

      sub("Admin Dashboard"),
      table([
        ["Website", "https://www.aieclothing.com/admin"],
        ["Email", "admin@aieclothing.com"],
        ["Password", "Password@123", true],
      ]),
      space(),

      sub("Paystack"),
      table([
        ["Website", "https://dashboard.paystack.com"],
        ["Email", "aieuniquethread@gmail.com"],
        ["Password", "Aieclothing@32", true],
      ]),
      note("Payments from customers land here first, then move to your bank account the next business day."),
      space(),

      sub("Resend (sends order emails automatically — rarely need to log in)"),
      table([
        ["Website", "https://resend.com"],
        ["Login", "Sign in with Google"],
      ]),

      space(),

      // ── What the App Does ─────────────────────────────────────────────────
      section("SECTION 2 — What Your Store Does"),

      bullet(t("Customer visits "), bold("www.aieclothing.com"), t(", browses, picks their size, adds to cart")),
      bullet(t("They checkout, fill in their address, and pay — card, bank transfer, or USSD")),
      bullet(t("Money hits your "), bold("Paystack account"), t(" immediately")),
      bullet(t("You get an "), bold("email notification"), t(" with all the order details")),
      bullet(t("You prepare and ship the order, then update the status in your dashboard")),
      bullet(t("Paystack moves the money to your "), bold("bank account the next business day")),

      space(),

      // ── Adding Products ────────────────────────────────────────────────────
      section("SECTION 3 — Adding a Product"),

      step(1, t("Go to "), bold("Admin → Products → Add Product")),
      step(2, t("Enter the "), bold("Product Name"), t(" — e.g. "), italic('"Red Ankara Peplum Short Dress"')),
      step(3, t("Write a "), bold("Description"), t(" — fabric, fit, what occasions it works for")),
      step(4, t("Set the "), bold("Price"), t(" in Naira — numbers only, e.g. "), italic("22000")),
      step(5, t("Set "), bold("Stock"), t(" — how many you have. If 3, type 3.")),
      step(6, t("Pick the "), bold("Category"), t(" — Bubu Designs, Asooke, etc.")),
      step(7, t("Tick "), bold("Featured"), t(" to show it on the home page. Always tick "), bold("Active"), t(" so it's visible.")),
      step(8, t("Click "), bold("Upload from device"), t(" — select photos from your phone. First photo = main display image.")),
      step(9, t("Add "), bold("Sizes"), t(" — type S, M, L, XL etc. and press Enter after each")),
      step(10, t("Add "), bold("Colours"), t(" if needed — e.g. "), italic('"Red Ankara"'), t(", press Enter")),
      step(11, t("Click "), bold("Create Product"), t(" — live immediately")),

      space(),
      sub("Photo tips"),
      bullet(t("Natural light near a window — colours look much better")),
      bullet(t("Plain background — white wall or plain fabric")),
      bullet(t("At least 3 shots: front, back, close-up of fabric")),
      bullet(t("Portrait mode on iPhone works great")),

      space(),

      // ── Orders ────────────────────────────────────────────────────────────
      section("SECTION 4 — Managing Orders"),

      p(t("Every paid order appears here automatically. You'll also get an email.")),
      step(1, t("Go to "), bold("Admin → Orders")),
      step(2, t("Click any row to open the full order details")),
      step(3, t("Hit "), bold("WhatsApp Customer"), t(" to message them directly")),
      step(4, t("Use the "), bold("Status dropdown"), t(" to update as you go:")),
      bullet(bold("Pending"), t(" → just received")),
      bullet(bold("Processing"), t(" → preparing")),
      bullet(bold("Shipped"), t(" → sent out")),
      bullet(bold("Delivered"), t(" → received by customer")),
      bullet(bold("Cancelled"), t(" → if needed")),

      space(),

      // ── Payments ──────────────────────────────────────────────────────────
      section("SECTION 5 — Payments"),

      p(t("Customers pay via Paystack — card, bank transfer, or USSD. Money goes into your Paystack account immediately, then to your bank "), bold("next business day"), t(".")),
      space(),
      table([
        ["Fee", "1.5% + ₦100 per order (max ₦2,000)"],
        ["₦15,000 order", "You receive ₦14,675"],
        ["₦30,000 order", "You receive ₦29,450"],
        ["₦50,000 order", "You receive ₦49,150"],
      ]),
      space(),
      sub("To receive money in your bank"),
      step(1, t("Log into "), bold("dashboard.paystack.com")),
      step(2, t("Go to "), bold("Settings → Accounts → add your bank account")),
      step(3, t("Done — settlements happen automatically from then on")),

      space(),

      // ── Emails ────────────────────────────────────────────────────────────
      section("SECTION 6 — Emails"),

      p(t("Emails go out automatically on every order — nothing to set up.")),
      space(),
      sub("Customer gets"),
      bullet(t("Order reference, items, total paid, delivery address, WhatsApp link to reach you")),
      space(),
      sub("You get"),
      bullet(t("Customer name, phone, address, items ordered, total — plus a direct link to the order and a WhatsApp button")),

      space(),

      // ── Common Tasks ──────────────────────────────────────────────────────
      section("SECTION 7 — Quick Tasks"),

      sub("Hide a product"),
      bullet(t("Admin → Products → Edit → untick "), bold("Active"), t(" → Save. Not deleted, just hidden.")),
      space(),
      sub("Update stock"),
      bullet(t("Admin → Products → Edit → change the Stock number → Save")),
      space(),
      sub("Change a price"),
      bullet(t("Admin → Products → Edit → update Price → Save")),
      space(),
      sub("Add a category"),
      bullet(t("Admin → Categories → type name → click Add")),

      space(),

      // ── Troubleshooting ────────────────────────────────────────────────────
      section("SECTION 8 — Troubleshooting"),

      sub("Can't log in"),
      bullet(t("Make sure you're on "), bold("www.aieclothing.com/admin"), t(", not the shop")),
      bullet(t("Password is "), new TextRun({ text: "Password@123", bold: true, font: "Courier New", size: 20 })),
      bullet(t("Try a different browser or phone — if still stuck, call Abdulazeez")),
      space(),

      sub("Product shows Sold Out but you have stock"),
      bullet(t("Admin → Products → Edit → update Stock number → Save")),
      space(),

      sub("Customer paid but order isn't showing"),
      bullet(t("Check Admin → Orders (scroll down or go to next page)")),
      bullet(t("Check Paystack to confirm payment — then call Abdulazeez with the reference")),
      space(),

      sub("Store looks broken or won't open"),
      bullet(t("Pull down to refresh on your phone")),
      bullet(t("Switch between WiFi and mobile data")),
      bullet(t("If it continues, call Abdulazeez")),

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
