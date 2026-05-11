import {
  Body, Container, Column, Head, Heading, Hr, Html,
  Img, Link, Preview, Row, Section, Text,
} from "@react-email/components";

interface OrderItem {
  productName: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
  price: number;
  productImage?: string | null;
}

interface OrderConfirmationProps {
  customerName: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  address: string;
  city: string;
  state: string;
  whatsappNumber: string;
}

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function OrderConfirmationEmail({
  customerName,
  orderId,
  items,
  total,
  address,
  city,
  state,
  whatsappNumber,
}: OrderConfirmationProps) {
  const firstName = customerName.split(" ")[0];
  const shortId = orderId.slice(-8).toUpperCase();
  const waLink = `https://wa.me/${whatsappNumber}?text=Hi! I just placed order ${shortId}. When will it be ready?`;

  return (
    <Html>
      <Head />
      <Preview>Your AIE Clothing order #{shortId} is confirmed 🎉</Preview>
      <Body style={body}>

        {/* Header */}
        <Section style={header}>
          <Text style={brandName}>AIE CLOTHING AFRICA</Text>
          <Text style={tagline}>a style for everyone...</Text>
        </Section>

        {/* Hero */}
        <Container style={container}>
          <Section style={heroSection}>
            <Heading style={heroHeading}>Order Confirmed! 🎉</Heading>
            <Text style={heroText}>
              Thank you, <strong>{firstName}</strong>. We've received your order
              and it's being processed. We'll notify you when it ships.
            </Text>
            <Text style={orderIdText}>Order #{shortId}</Text>
          </Section>

          <Hr style={divider} />

          {/* Items */}
          <Section>
            <Heading style={sectionHeading}>Your Items</Heading>
            {items.map((item, i) => (
              <Row key={i} style={itemRow}>
                <Column style={itemDetails}>
                  <Text style={itemName}>{item.productName}</Text>
                  {(item.size || item.color) && (
                    <Text style={itemMeta}>
                      {[item.size, item.color].filter(Boolean).join(" · ")}
                    </Text>
                  )}
                  <Text style={itemMeta}>Qty: {item.quantity}</Text>
                </Column>
                <Column style={itemPrice}>
                  <Text style={itemPriceText}>{formatNGN(item.price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Total */}
          <Row style={totalRow}>
            <Column>
              <Text style={totalLabel}>Total Paid</Text>
            </Column>
            <Column style={{ textAlign: "right" }}>
              <Text style={totalAmount}>{formatNGN(total)}</Text>
            </Column>
          </Row>

          <Hr style={divider} />

          {/* Delivery */}
          <Section>
            <Heading style={sectionHeading}>Delivery Address</Heading>
            <Text style={addressText}>{address}</Text>
            <Text style={addressText}>{city}, {state}</Text>
          </Section>

          <Hr style={divider} />

          {/* WhatsApp CTA */}
          <Section style={ctaSection}>
            <Text style={ctaText}>
              Track your order or ask us anything — we're always available on WhatsApp.
            </Text>
            <Link href={waLink} style={ctaButton}>
              Chat on WhatsApp
            </Link>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              AIE Clothing Africa · a style for everyone...
            </Text>
            <Text style={footerText}>
              Follow us on{" "}
              <Link
                href="https://www.instagram.com/aieclothingafrica"
                style={footerLink}
              >
                @aieclothingafrica
              </Link>
            </Text>
            <Text style={{ ...footerText, marginTop: "8px" }}>
              Made with ♥ in Nigeria 🇳🇬
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "#faf9f7",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: 0,
};

const header: React.CSSProperties = {
  backgroundColor: "#111111",
  textAlign: "center",
  padding: "28px 20px",
};

const brandName: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "700",
  letterSpacing: "0.25em",
  margin: "0 0 4px 0",
};

const tagline: React.CSSProperties = {
  color: "#c4773b",
  fontSize: "11px",
  letterSpacing: "0.15em",
  margin: 0,
  fontStyle: "italic",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: "580px",
  margin: "0 auto",
  borderRadius: "4px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

const heroSection: React.CSSProperties = {
  padding: "40px 40px 32px",
  textAlign: "center",
  backgroundColor: "#fdf8f4",
};

const heroHeading: React.CSSProperties = {
  color: "#111111",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 0 12px 0",
};

const heroText: React.CSSProperties = {
  color: "#555555",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const orderIdText: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#c4773b",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.15em",
  padding: "6px 16px",
  borderRadius: "2px",
};

const divider: React.CSSProperties = {
  borderColor: "#f0e6d6",
  margin: "0",
};

const sectionHeading: React.CSSProperties = {
  color: "#111111",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  margin: "24px 40px 12px",
};

const itemRow: React.CSSProperties = {
  padding: "10px 40px",
};

const itemDetails: React.CSSProperties = {
  verticalAlign: "top",
};

const itemName: React.CSSProperties = {
  color: "#111111",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 2px 0",
};

const itemMeta: React.CSSProperties = {
  color: "#888888",
  fontSize: "12px",
  margin: "0",
};

const itemPrice: React.CSSProperties = {
  textAlign: "right",
  verticalAlign: "top",
};

const itemPriceText: React.CSSProperties = {
  color: "#111111",
  fontSize: "14px",
  fontWeight: "600",
  margin: 0,
};

const totalRow: React.CSSProperties = {
  padding: "16px 40px",
};

const totalLabel: React.CSSProperties = {
  color: "#111111",
  fontSize: "16px",
  fontWeight: "700",
  margin: 0,
};

const totalAmount: React.CSSProperties = {
  color: "#c4773b",
  fontSize: "20px",
  fontWeight: "700",
  margin: 0,
};

const addressText: React.CSSProperties = {
  color: "#555555",
  fontSize: "14px",
  margin: "0 40px 4px",
  lineHeight: "1.5",
};

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  padding: "32px 40px",
};

const ctaText: React.CSSProperties = {
  color: "#555555",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 20px 0",
};

const ctaButton: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#25D366",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "700",
  letterSpacing: "0.05em",
  padding: "14px 32px",
  borderRadius: "2px",
  textDecoration: "none",
};

const footerSection: React.CSSProperties = {
  backgroundColor: "#111111",
  textAlign: "center",
  padding: "24px 40px",
};

const footerText: React.CSSProperties = {
  color: "#888888",
  fontSize: "12px",
  margin: "0 0 4px 0",
  lineHeight: "1.5",
};

const footerLink: React.CSSProperties = {
  color: "#c4773b",
  textDecoration: "none",
};
