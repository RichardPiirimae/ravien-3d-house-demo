import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "3D House Demo — interactive 3D house by Ravien",
  description:
    "A five-apartment house you can explore live in the browser: cut it open, walk into any apartment. Built by Ravien from the architect's Revit drawings.",
};

export const viewport: Viewport = {
  themeColor: "#f5f5f3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
