import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notwithmytype - Font Processing Tool",
  description: "Relaunch your typographies with a non-negotiable change",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <link rel="preconnect" href="https://cdn.fonts.net" />
        <link
          href="https://cdn.fonts.net/kit/fb79aee9-18e7-4a24-8400-94dbe832dac6/fb79aee9-18e7-4a24-8400-94dbe832dac6.css"
          rel="stylesheet"
        /> */}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
