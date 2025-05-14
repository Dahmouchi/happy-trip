import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons:{
    icon:"/logo.png"
  },
  title: "HappyTrip",
  description: "Welcome to happytrip website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
      >
        {children}
      </body>
    </html>
  );
}
