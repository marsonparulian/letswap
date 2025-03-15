'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import Link from 'next/link';

const SiteNav = () => {
    // Current path name
    const pathName = usePathname();

    // Nav links
    const links = [
        { href: '/', label: 'Home' },
        { href: '/collections', label: 'Browse' },
        { href: '/about', label: 'About' },
    ]
    return (
        <div className="top-bar">
            <nav className="top-bar-left">
                <ul className="dropdown menu" data-dropdown-menu>
                    <li className="menu-text">LetSwap</li>
                    {/* <li>
                        <a href="#">One</a>
                        <ul className="menu vertical">
                            <li><a href="#">One</a></li>
                            <li><a href="#">Two</a></li>
                        </ul>
                    </li> */}
                    {links.map(l => {
                        // Set if the link is active
                        let isActive = false;
                        // Set active for home page
                        if (pathName.trim() === '/' && l.href === '/') {
                            isActive = true;
                        }
                        // Set active if the current path starts with the link href
                        else if (l.href !== '/' && pathName.startsWith(l.href)) {
                            isActive = true;
                        }

                        return (
                            <li key={l.href}>
                                <Link href={l.href}
                                    className={
                                        // Add 'active' class if the current path starts with the link href & is not the home page
                                        clsx({ 'active': isActive })
                                    }
                                >{l.label}</Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
            <div className="top-bar-right">
                <ul className="menu">
                    <li><button type="button" className="button">Sign in</button></li>
                </ul>
            </div>
        </div>
    );
};

export default SiteNav;