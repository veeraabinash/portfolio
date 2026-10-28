import { Syne, Manrope, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Syne({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-body" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-mono" });

export const metadata = {
  title: "Veeraabinash M - Web Developer | React & Next.js",
  description:
    "Portfolio of Veeraabinash M, a Chennai-based web developer with 2 years of experience building React, Next.js and Redux applications with REST APIs, JWT auth and Razorpay/Stripe payments.",
  keywords: [
    "Veeraabinash M",
    "Web Developer",
    "React Developer",
    "Next.js",
    "Redux",
    "Chennai",
    "Portfolio",
  ],
  authors: [{ name: "Veeraabinash M" }],
  openGraph: {
    type: "website",
    title: "Veeraabinash M - Web Developer | React & Next.js",
    description:
      "Projects, skills and contact details of web developer Veeraabinash M.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${serif.variable} ${mono.variable} is-loading`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
