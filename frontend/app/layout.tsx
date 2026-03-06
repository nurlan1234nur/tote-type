import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToteType",
  description: "Kazakh Tote Jazu typing practice platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
