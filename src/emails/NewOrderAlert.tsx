import {
  Body, Container, Head, Heading, Hr, Html,
  Link, Preview, Row, Column, Section, Text,
} from "@react-email/components";

interface OrderItem {
  productName: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
  price: number;
}

interface NewOrderAlertProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  address: string;
  city: string;
  state: string;
  notes?: string | null;
  adminUrl: string;
}

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function NewOrderAlertEmail({
  customerName,
  customerEmail,
  customerPhone,
  orderId,
  items,
  total,
  address,
  city,
  state,
  notes,
  adminUrl,
}: NewOrderAlertProps) {
  const shortId = orderId.slice(-8).toUpperCase();
  const waLink = `https://wa.me/${customerPhone.replace(/\D/g, "")}?text=Hello ${encodeURIComponent(customerName)}! Your AIE Clothing order %23${shortId} is being processed.`;

  return (
    <Html>
      <Head />
      <Preview>🛍️ New order #{shortId} — {formatNGN(total)} from {customerName}</Preview>
      <Body style={body}>

        {/* Header */}
        <Section style={header}>
          <Text style={brandName}>AIE CLOTHING AFRICA</Text>
          <Text style={alertBadge}>NEW ORDER RECEIVED</Text>
        </Section>

        <Container style={container}>

          {/* Hero */}
          <Section style={heroSection}>
            <Heading style={heroHeading}>You have a new order! 🎉</Heading>
            <Text style={orderIdPill}>#{shortId}</Text>
            <Text style={totalText}>{formatNGN(total)}</Text>
          </Section>

          <Hr style={divider} />

          {/* Customer */}
          <Section style={infoSection}>
            <Heading style={sectionHeading}>Customer Details</Heading>
            <InfoRow label="Name" value={customerName} />
            <InfoRow label="Email" value={customerEmail} />
            <InfoRow label="Phone" value={customerPhone} />
            <InfoRow label="Address" value={`${address}, ${city}, ${state}`} />
            {notes && <InfoRow label="Notes" value={notes} />}
          </Section>

          <Hr style={divider} />

          {/* Items */}
          <Section style={infoSection}>
            <Heading style={sectionHeading}>Items Ordered</Heading>
            {items.map((item, i) => (
              <Row key={i} style={itemRow}>
                <Column>
                  <Text style={itemName}>{item.productName}</Text>
                  {(item.size || item.color) && (
                    <Text style={itemMeta}>
                      {[item.size, item.color].filter(Boolean).join(" · ")}
                    </Text>
                  )}
                  <Text style={itemMeta}>Qty: {item.quantity}</Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={itemPrice}>{formatNGN(item.price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Total */}
          <Row style={totalRow}>
            <Column><Text style={totalLabel}>Total</Text></Column>
            <Column style={{ textAlign: "right" }}>
              <Text style={totalAmount}>{formatNGN(total)}</Text>
            </Column>
          </Row>

          <Hr style={divider} />

          {/* Actions */}
          <Section style={actionsSection}>
            <Link href={adminUrl} style={primaryBtn}>
              View in Dashboard
            </Link>
            <Link href={waLink} style={secondaryBtn}>
              WhatsApp Customer
            </Link>
          </Section>

          <Hr style={divider} />

          <Section style={footerSection}>
            <Text style={footerText}>AIE Clothing Africa Admin Notification</Text>
            <Text style={footerText}>Do not reply to this email.</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Row style={{ padding: "4px 0" }}>
      <Column style={{ width: "100px" }}>
        <Text style={infoLabel}>{label}</Text>
      </Column>
      <Column>
        <Text style={infoValue}>{value}</Text>
      </Column>
    </Row>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#f5f5f5",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "20px 0",
};

const header: React.CSSProperties = {
  backgroundColor: "#111111",
  textAlign: "center",
  padding: "24px 20px",
};

const brandName: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "700",
  letterSpacing: "0.25em",
  margin: "0 0 8px 0",
};

const alertBadge: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#c4773b",
  color: "#ffffff",
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "0.2em",
  padding: "4px 12px",
  borderRadius: "2px",
  margin: 0,
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: "560px",
  margin: "0 auto",
  borderRadius: "4px",
  overflow: "hidden",
};

const heroSection: React.CSSProperties = {
  textAlign: "center",
  padding: "32px 40px 24px",
  backgroundColor: "#fdf8f4",
};

const heroHeading: React.CSSProperties = {
  color: "#111111",
  fontSize: "22px",
  fontWeight: "700",
  margin: "0 0 12px 0",
};

const orderIdPill: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#111111",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.15em",
  padding: "5px 14px",
  borderRadius: "2px",
  margin: "0 0 8px 0",
};

const totalText: React.CSSProperties = {
  color: "#c4773b",
  fontSize: "32px",
  fontWeight: "700",
  margin: 0,
};

const divider: React.CSSProperties = {
  borderColor: "#f0e6d6",
  margin: 0,
};

const infoSection: React.CSSProperties = {
  padding: "20px 40px",
};

const sectionHeading: React.CSSProperties = {
  color: "#111111",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  margin: "0 0 12px 0",
};

const infoLabel: React.CSSProperties = {
  color: "#888888",
  fontSize: "12px",
  fontWeight: "600",
  margin: 0,
};

const infoValue: React.CSSProperties = {
  color: "#111111",
  fontSize: "13px",
  margin: 0,
};

const itemRow: React.CSSProperties = {
  padding: "8px 0",
  borderBottom: "1px solid #f5f5f5",
};

const itemName: React.CSSProperties = {
  color: "#111111",
  fontSize: "13px",
  fontWeight: "600",
  margin: "0 0 2px 0",
};

const itemMeta: React.CSSProperties = {
  color: "#888888",
  fontSize: "11px",
  margin: 0,
};

const itemPrice: React.CSSProperties = {
  color: "#111111",
  fontSize: "13px",
  fontWeight: "600",
  margin: 0,
};

const totalRow: React.CSSProperties = {
  padding: "16px 40px",
};

const totalLabel: React.CSSProperties = {
  color: "#111111",
  fontSize: "15px",
  fontWeight: "700",
  margin: 0,
};

const totalAmount: React.CSSProperties = {
  color: "#c4773b",
  fontSize: "22px",
  fontWeight: "700",
  margin: 0,
};

const actionsSection: React.CSSProperties = {
  padding: "28px 40px",
  textAlign: "center",
  display: "flex",
  gap: "12px",
  justifyContent: "center",
};

const primaryBtn: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#111111",
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: "700",
  padding: "12px 28px",
  borderRadius: "2px",
  textDecoration: "none",
  marginRight: "10px",
};

const secondaryBtn: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#25D366",
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: "700",
  padding: "12px 28px",
  borderRadius: "2px",
  textDecoration: "none",
};

const footerSection: React.CSSProperties = {
  backgroundColor: "#f5f5f5",
  textAlign: "center",
  padding: "16px 40px",
};

const footerText: React.CSSProperties = {
  color: "#999999",
  fontSize: "11px",
  margin: "0 0 2px 0",
};
