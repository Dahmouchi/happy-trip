import { Category, Destination, Nature } from "@prisma/client";
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
    const category: Category[] | null = await prisma.category.findMany({});
    const nature: Nature[] | null = await prisma.nature.findMany({});
    const destinationInternational: Destination[] | null = await prisma.destination.findMany({
      where: {
        type:"INTERNATIONAL",
      },
    });
  return (
    <div className="">
      <Navbar nationalDestinations={destinationNational} internationalDestinations={destinationInternational} voyage={category} nature={nature}/>
      {children}
      <Footer />
    </div>
  );
}
