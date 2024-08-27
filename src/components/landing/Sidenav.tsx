import React from 'react';
import "@/index.css"; // Import the CSS file

interface NavItem {
    id: string;
    label: string;
}

interface SideNavProps {
    items: NavItem[];
}

const SideNav: React.FC<SideNavProps> = ({ items }) => {
    return (
        <nav className="side-nav">
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        <a href={`#${item.id}`} className="hover:text-blue-400">{item.label}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SideNav;