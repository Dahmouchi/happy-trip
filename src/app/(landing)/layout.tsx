import Footer from "./_components/Footer";
import { Navbar } from "./_components/Header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
