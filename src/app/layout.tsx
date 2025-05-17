import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
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
        <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
      </body>
    </html>
  );
}
