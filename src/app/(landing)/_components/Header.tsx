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
const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content.",
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <Link
                    href="/"
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  >
                    <img
                      src="/logo.png"
                      alt="Happy Trip"
                      className="h-full w-auto"
                    />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      shadcn/ui
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Beautifully designed components built with Radix UI and
                      Tailwind CSS.
                    </p>
                  </Link>
                </li>
                <ListItem href="#" title="Introduction">
                  Re-usable components built using Radix UI and Tailwind CSS.
                </ListItem>
                <ListItem href="/docs/installation" title="Installation">
                  How to install dependencies and structure your app.
                </ListItem>
                <ListItem href="/docs/primitives/typography" title="Typography">
                  Styles for headings, paragraphs, lists...etc
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Voyages</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Activités</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
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
        <Link href="/login">
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
              <AccordionItem value="destinations">
                <AccordionTrigger className="text-lg font-medium py-2">
                  Destinations
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 flex flex-col space-y-2 py-2">
                    <Link
                      href="#"
                      className="text-base py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Introduction
                    </Link>
                    <Link
                      href="/docs/installation"
                      className="text-base py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Installation
                    </Link>
                    <Link
                      href="/docs/primitives/typography"
                      className="text-base py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Typography
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="voyages">
                <AccordionTrigger className="text-lg font-medium py-2">
                  Voyages
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 flex flex-col space-y-2 py-2">
                    {components.map((component) => (
                      <Link
                        key={component.title}
                        href={component.href}
                        className="text-base py-1"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {component.title}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="activites">
                <AccordionTrigger className="text-lg font-medium py-2">
                  Activités
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 flex flex-col space-y-2 py-2">
                    {components.map((component) => (
                      <Link
                        key={component.title}
                        href={component.href}
                        className="text-base py-1"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {component.title}
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
