import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const fraunces = localFont({
  src: [
    { path: "../../public/fonts/fraunces-variable-normal.woff2", weight: "100 900", style: "normal" },
    { path: "../../public/fonts/fraunces-variable-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = localFont({
  src: [
    { path: "../../public/fonts/dm-sans-variable-normal.woff2", weight: "100 900", style: "normal" },
    { path: "../../public/fonts/dm-sans-variable-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: [
    { path: "../../public/fonts/jetbrains-mono-variable-normal.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alif Reezi - AI Engineer",
  description:
    "AI engineer and Biomedical Engineering graduate building machine learning systems for medical imaging and edge AI deployment. Based in Purwokerto, Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}