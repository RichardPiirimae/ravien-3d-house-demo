import type { Metadata } from "next";
import { Cormorant_Garamond, Chakra_Petch } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

const chakra = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: "Ravien — 3D Experience",
  description: "Immersive 3D architectural walkthrough",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${chakra.variable} h-full`}
    >
      <body
        className="min-h-full"
        style={{ fontFamily: "var(--font-chakra), monospace" }}
      >
        {children}
      </body>
    </html>
  );
}
