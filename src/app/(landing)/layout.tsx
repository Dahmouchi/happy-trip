import { Destination } from "@prisma/client";
import Footer from "./_components/Footer";
import { Navbar } from "./_components/Header";
import prisma from "@/lib/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tourNational: Destination[] | null = await prisma.destination.findMany({
      where: {
        type:"NATIONAL",
      },
    });
  return (
    <div className="">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
