import type { Metadata } from "next";
import { Google_Sans_Flex } from "next/font/google";
import "./globals.css";

const googleSans = Google_Sans_Flex({
  variable: "--font-google-sans",
  subsets: ["latin"],
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
      <body className={`${googleSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}