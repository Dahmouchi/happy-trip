/* eslint-disable @typescript-eslint/no-unused-vars */
import { Destination } from "@prisma/client";
import Footer from "./_components/Footer";
import { Navbar } from "./_components/Header";
import prisma from "@/lib/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const destinationNational: Destination[] | null = await prisma.destination.findMany({
      where: {
        type:"NATIONAL",
      },
    });
    const destinationInternational: Destination[] | null = await prisma.destination.findMany({
      where: {
        type:"INTERNATIONAL",
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
