import type { Metadata } from "next";
import "./globals.css";

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
        <link rel="preconnect" href="https://cdn.fonts.net" />
        <link
          rel="stylesheet"
          href="https://cdn.fonts.net/kit/fb79aee9-18e7-4a24-8400-94dbe832dac6/fb79aee9-18e7-4a24-8400-94dbe832dac6.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
