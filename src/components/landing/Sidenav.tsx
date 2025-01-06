import React from 'react';
import "@/index.css";

interface NavItem {
    id: string;
    label: string;
}

interface SideNavProps {
    items: NavItem[];
}

const SideNav: React.FC<SideNavProps> = ({ items }) => {
    return (
        <nav className="fixed right-6 top-56 z-50 w-48">
            <ul className="flex flex-col gap-1.5">
                {items.map(item => (
                    <li key={item.id} className="transition-all duration-300 group">
                        <a
                            href={`#${item.id}`}
                            className="
                                block
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                bg-white/80
                                dark:bg-gray-800/80
                                backdrop-blur-sm
                                border
                                border-gray-100
                                dark:border-gray-700
                                rounded-none
                                shadow-sm
                                hover:scale-105
                                hover:bg-white
                                dark:hover:bg-gray-800
                                hover:border-gray-200
                                dark:hover:border-gray-600
                                hover:shadow-md
                                transition-all
                                duration-200
                                transform
                                origin-right
                                truncate
                                text-gray-600
                                dark:text-gray-300
                                hover:text-gray-900
                                dark:hover:text-white
                            "
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SideNav;