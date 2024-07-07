import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { buttonVariants } from '../../lib/button-utils';
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LogoIcon } from "./Icons";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#products",
    label: "Products",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "https://developers.lomi.africa/",
    label: "Resources",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex items-center">
          <div className="flex items-center flex-grow">
            <NavigationMenuItem className="font-bold flex items-center">
              <a
                rel="lomi.africa"
                href="/"
                className="ml-2 font-bold text-xl flex items-center"
              >
                <LogoIcon />
                lomi.africa
              </a>
            </NavigationMenuItem>
          </div>

          {/* mobile */}
          <span className="flex md:hidden ml-auto pr-4"> {/* Added pr-4 for padding */}
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    lomi.africa
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2 ml-auto pr-4"> {/* Added pr-4 for padding */}
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2 ml-auto pr-4"> {/* Added pr-4 for padding */}
            <button
              onClick={() => setIsFormOpen(true)}
              className={`border ${buttonVariants({ variant: "secondary" })}`}
            >
              Contact sales
            </button>

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Airtable form modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setIsFormOpen(false)} // Close modal on background click
        >
          <div
            className="bg-white rounded-lg p-3 w-full max-w-3xl mx-2" // Added mx-4 for smaller margins
            onClick={(e) => e.stopPropagation()} // Prevent modal close on content click
          >
            <iframe
              className="airtable-embed"
              src="https://airtable.com/embed/appFQadFIGVMYNnHq/pagphA6Lt1pPzWMhX/form"
              frameBorder="0"
              width="100%"
              height="800"
              style={{ background: 'transparent', border: '1px solid #ccc' }}
            ></iframe>
          </div>
        </div>
      )}
    </header>
  );
};
