import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const BASE = "https://www.aieclothing.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "AIE Clothing Africa — Premium African Fashion",
    template: "%s | AIE Clothing Africa",
  },
  description:
    "Shop premium African fashion — Ankara styles, Bubu designs, Asooke, Men Kaftan and more. Made in Nigeria, shipped nationwide. Order online or via WhatsApp.",
  keywords: [
    "African fashion Nigeria", "Ankara dress Lagos", "Bubu design Nigeria",
    "Asooke fashion", "Nigerian clothing online", "AIE Clothing Africa",
    "Aso-ebi styles", "African wear shop", "Men kaftan Nigeria",
  ],
  verification: {
    google: "KSiS9K-pO2He_F8dCdVhyBV9JvvhilKyKfO27baCUgg",
  },
  authors: [{ name: "AIE Clothing Africa" }],
  creator: "AIE Clothing Africa",
  publisher: "AIE Clothing Africa",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
    shortcut: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: BASE,
    siteName: "AIE Clothing Africa",
    title: "AIE Clothing Africa — Premium African Fashion",
    description: "Shop premium African fashion — Ankara, Bubu, Asooke and more. Made in Nigeria, shipped nationwide.",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "AIE Clothing Africa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIE Clothing Africa — Premium African Fashion",
    description: "Shop premium African fashion — Ankara, Bubu, Asooke and more. Made in Nigeria.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#faf9f7",
              color: "#111111",
              border: "1px solid #e8e2da",
              borderRadius: "0",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
