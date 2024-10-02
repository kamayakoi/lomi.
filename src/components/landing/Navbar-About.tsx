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

import { buttonVariants } from '@/lib/button-utils';
import { Menu } from "lucide-react";
import { LogoIcon } from "./Icons";
import { Dock } from "@/components/ui/dock";

import "./Navbar.css";

interface RouteProps {
    href: string;
    label: string;
}

const routeList: RouteProps[] = [
    {
        href: "/products",
        label: "Products",
    },
    {
        href: "/integrations",
        label: "Integration",
    },
    {
        href: "https://developers.lomi.africa/",
        label: "Resources",
    },
    {
        href: "/about",
        label: "About",
    },
];

export const NavbarAbout = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    return (
        <Dock>
            <header className="navbar-dock bg-[#1214187d] backdrop-filter backdrop-blur-lg">
                <NavigationMenu className="mx-auto">
                    <NavigationMenuList className="container flex items-center justify-between">
                        <div className="navbar-logo-container">
                            <NavigationMenuItem className="font-bold flex items-center">
                                <a
                                    rel="lomi.africa"
                                    href="/"
                                    className="font-bold text-xl flex items-center text-white"
                                    style={{ fontSize: '1.5rem' }}
                                >
                                    <LogoIcon />
                                    <span className="ml-2">lomi.africa</span>
                                </a>
                            </NavigationMenuItem>
                        </div>

                        {/* mobile */}
                        <span className="flex md:hidden">
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger className="px-2">
                                    <Menu
                                        className="flex md:hidden h-5 w-5 text-white"
                                        onClick={() => setIsOpen(true)}
                                    >
                                        <span className="sr-only">Toggle menu</span>
                                    </Menu>
                                </SheetTrigger>
                                <SheetContent
                                    side="right"
                                    className="bg-gray-900 text-white"
                                >
                                    <SheetHeader>
                                        <SheetTitle className="font-bold text-xl text-white" style={{ fontSize: '1.2rem' }}>
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
                                                className={buttonVariants({ variant: "ghost" }) + " text-white"}
                                                style={{ fontSize: '1.06rem' }}
                                            >
                                                {label}
                                            </a>
                                        ))}
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </span>

                        {/* desktop */}
                        <nav className="navbar-desktop-menu">
                            {routeList.map((route: RouteProps, i) => (
                                <a
                                    rel="noreferrer noopener"
                                    href={route.href}
                                    key={i}
                                    className={`navbar-menu-item text-[17px] ${buttonVariants({
                                        variant: "ghost",
                                    })} text-white`}
                                    style={{ fontSize: '1.06rem' }}
                                >
                                    {route.label}
                                </a>
                            ))}
                            <div className="navbar-contact-sales">
                                <button
                                    onClick={() => setIsFormOpen(true)}
                                    className={`border border-gray-300 bg-transparent hover:border-[#2563EB] transition-colors duration-200 ${buttonVariants({ variant: "secondary" })} text-white`}
                                    style={{ fontSize: '1.06rem', padding: '0.75rem 1rem' }}
                                >
                                    Contact sales
                                </button>
                            </div>
                        </nav>
                    </NavigationMenuList>
                </NavigationMenu>
            </header>

            {/* Airtable form modal */}
            {isFormOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                    onClick={() => setIsFormOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-3 w-full max-w-3xl mx-2"
                        onClick={(e) => e.stopPropagation()}
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
        </Dock>
    );
};