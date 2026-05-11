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

export const metadata: Metadata = {
  title: {
    default: "AIE Clothing Africa",
    template: "%s | AIE Clothing Africa",
  },
  description:
    "Premium African fashion wear. Authentic Ankara styles, contemporary designs — Made in Nigeria, styled for the world.",
  keywords: ["African fashion", "Ankara", "Nigerian clothing", "AIE Clothing"],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "AIE Clothing Africa",
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
