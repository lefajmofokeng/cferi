import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sodoSans = localFont({
  src: [
    { path: "./fonts/SoDoSans-Thin.woff2", weight: "100", style: "normal" },
    { path: "./fonts/SoDoSans-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/SoDoSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/SoDoSans-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/SoDoSans-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/SoDoSans-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-sodo-sans",
});

export const metadata: Metadata = {
  title: "Maluti Incubation Center",
  description: "Maluti TVET College Incubation Center — news, jobs, events, and applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sodoSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}