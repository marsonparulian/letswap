import React from 'react';
import Link from 'next/link';
import { link } from 'fs';

const SiteNav = () => {
    const links = [
        // `include` is an array of pathName that considered to be under the link. Hence it will make the nav link as 'active'
        { href: '/', label: 'Home', include: [] },
        { href: '/collectibles', label: 'Browse', include:['/collectibles/generate'] },
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
                        return (
                            <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
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