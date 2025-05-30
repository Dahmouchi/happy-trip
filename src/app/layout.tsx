import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import { Poppins } from "next/font/google";
import NextAuthProvider from "../../providers/NextAuthProvider";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--poppins-font",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
});
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
        className={`${poppins.className} relative`}
      >
        <NextAuthProvider>
          <div className="overflow-x-hidden">
          {children}
        </div>
        </NextAuthProvider>
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
