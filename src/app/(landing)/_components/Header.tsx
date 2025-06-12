/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import { redirect } from "next/navigation";
import { Category, Destination, Nature } from "@prisma/client";
// const components: { title: string; href: string; description: string }[] = [
//   {
//     title: "Alert Dialog",
//     href: "/docs/primitives/alert-dialog",
//     description:
//       "A modal dialog that interrupts the user with important content.",
//   },
// ];

export function Navbar({
  nationalDestinations,
  internationalDestinations,
  voyage,
  nature,
}: {
  nationalDestinations: Destination[];
  internationalDestinations: Destination[];
  voyage?:Category[];
  nature?:Nature[];
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [selectedDestinationType, setSelectedDestinationType] = React.useState<
    "national" | "international"
  >("national");

  // Example destination data, replace with your actual data



  return (
    <header className="relative flex items-center justify-between px-6 py-4 shadow-md bg-white">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <img src="/horizontal.png" alt="Happy Trip" className="h-10" />
      </Link>

      {/* Desktop Navigation */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/"
              className={navigationMenuTriggerStyle()}
            >
              Accueil
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Destinations</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="flex flex-col w-[300px] p-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => redirect("/destination/national")}
                    className={cn(
                      "flex-1",
                      selectedDestinationType === "national" &&
                        "bg-[#8EBD22] text-white"
                    )}
                    onMouseEnter={() => setSelectedDestinationType("national")}
                  >
                    National
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => redirect("/destination/international")}
                    className={cn(
                      "flex-1",
                      selectedDestinationType === "international" &&
                        "bg-[#8EBD22] text-white"
                    )}
                    onMouseEnter={() =>
                      setSelectedDestinationType("international")
                    }
                  >
                    International
                  </Button>
                </div>
                <ul className="flex flex-col gap-2">
                  {(selectedDestinationType === "national"
                    ? nationalDestinations
                    : internationalDestinations
                  ).map((destination) => (
                    <li key={destination.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/destination/${selectedDestinationType}?destinations=${destination.id}`}
                          className={cn(
                            "block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">
                            {destination.name}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Voyages</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[500px] md:w-[600px] lg:w-[800px]">
              <div className="flex justify-center">
                <div className="grid grid-cols-4 gap-4 p-4 w-[500px] md:w-[500px] lg:w-[800px]">
                  {voyage?.map((voyage) => (
                    <NavigationMenuLink asChild key={voyage.id}>
                      <Link
                        href={`/category?categorys=${voyage.id}`}
                        className="flex flex-col items-center rounded-md p-3 hover:bg-accent transition-colors"
                      >
                        <img
                          src={voyage.imageUrl}
                          alt={voyage.name}
                          className="w-56 h-40 object-cover rounded mb-2"
                        />
                        <span className="text-sm font-medium text-center">
                          {voyage.name}
                        </span>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {voyage.description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Activités</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[500px] md:w-[600px] lg:w-[800px]">
              <div className="flex justify-center">
                <div className="grid grid-cols-4 gap-4 p-4 w-[500px] md:w-[500px] lg:w-[800px]">
                  {nature?.map((voyage) => (
                    <NavigationMenuLink asChild key={voyage.name}>
                      <Link
                        href={`/nature?natures=${voyage.id}`}
                        className="flex flex-col items-center rounded-md p-3 hover:bg-accent transition-colors"
                      >
                        <img
                          src={voyage.imageUrl}
                          alt={voyage.id}
                          className="w-56 h-40 object-cover rounded mb-2"
                        />
                        <span className="text-sm font-medium text-center">
                          {voyage.name}
                        </span>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {voyage.description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/"
              className={navigationMenuTriggerStyle()}
            >
              Blogs
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/"
              className={navigationMenuTriggerStyle()}
            >
              Contact
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-4">
        {/* CTA Button */}
        <Link href="/login-client">
          <Button className="bg-white text-black hover:bg-white hover:text-black hover:cursor-pointer shadow-none">
            Login
          </Button>
        </Link>
        <Button className="bg-[#8EBD22] text-white shadow-md rounded-full px-5">
          Appelez-nous
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg p-4 z-50 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-lg font-medium py-2 border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accueil
            </Link>

            <Accordion type="single" collapsible className="w-full">
              {/* Destinations */}
              <AccordionItem value="destinations">
                <AccordionTrigger className="text-lg font-medium py-2">
                  Destinations
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 flex flex-col space-y-2 py-2">
                    <div className="flex gap-2 mb-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "flex-1",
                          selectedDestinationType === "national" &&
                            "bg-[#8EBD22] text-white"
                        )}
                        onClick={() => setSelectedDestinationType("national")}
                      >
                        National
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "flex-1",
                          selectedDestinationType === "international" &&
                            "bg-[#8EBD22] text-white"
                        )}
                        onClick={() =>
                          setSelectedDestinationType("international")
                        }
                      >
                        International
                      </Button>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {(selectedDestinationType === "national"
                        ? nationalDestinations
                        : internationalDestinations
                      ).map((destination) => (
                        <li key={destination.id}>
                          <Link
                            href={`/destinations/${selectedDestinationType}/${destination.id}`}
                            className="text-base py-1 flex items-center gap-3"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {/* You can add an image for each destination if available */}
                            {/* <img src={destination.image} alt={destination.name} className="w-16 h-12 object-cover rounded" /> */}
                            <div>
                              <div>{destination.name}</div>
                              <p className="line-clamp-2 text-xs text-muted-foreground">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Natus vel vitae vero!
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Voyages */}
              <AccordionItem value="voyages">
                <AccordionTrigger className="text-lg font-medium py-2">
                  Voyages
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 flex flex-col space-y-2 py-2">
                    {[
                      {
                        type: "Voyages en Groupe",
                        href: "/voyages/groupe",
                        image: "/voyages/groupe.jpg",
                      },
                      {
                        type: "Comité d'entreprise",
                        href: "/voyages/Comité-dentreprise",
                        image: "/voyages/comite d'entreprise.jpg",
                      },
                      {
                        type: "Voyage sur mesure",
                        href: "/voyages/mesure",
                        image: "/voyages/mesure.jpg",
                      },
                      {
                        type: "Voyage Team Building",
                        href: "/voyages/team-building",
                        image: "/voyages/team-building.jpg",
                      },
                    ].map((voyage) => (
                      <Link
                        key={voyage.type}
                        href={voyage.href}
                        className="flex items-center gap-3 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <img
                          src={voyage.image}
                          alt={voyage.type}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="text-base">{voyage.type}</div>
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Natus vel vitae vero!
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Activités */}
              <AccordionItem value="activites">
                <AccordionTrigger className="text-lg font-medium py-2">
                  Activités
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 flex flex-col space-y-2 py-2">
                    {[
                      {
                        type: "Randonnée",
                        href: "/activités/randonnée",
                        image: "/voyages/randonnee.jpg",
                      },
                      {
                        type: "Montagne",
                        href: "/activités/montagne",
                        image: "/voyages/montagne.jpg",
                      },
                      {
                        type: "Baignade",
                        href: "/activités/baignade",
                        image: "/voyages/baignade.jpg",
                      },
                      {
                        type: "Bivouac",
                        href: "/activités/bivouac",
                        image: "/voyages/bivouac.jpg",
                      },
                    ].map((activity) => (
                      <Link
                        key={activity.type}
                        href={activity.href}
                        className="flex items-center gap-3 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <img
                          src={activity.image}
                          alt={activity.type}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="text-base">{activity.type}</div>
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Natus vel vitae vero!
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Link
              href="#"
              className="text-lg font-medium py-2 border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blogs
            </Link>

            <Link
              href="#"
              className="text-lg font-medium py-2 border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            <div className="pt-4 flex flex-col space-y-3">
              <Button className="bg-[#8EBD22] text-white w-full">
                Appelez-nous
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
