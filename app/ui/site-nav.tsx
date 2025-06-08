"use client";

import React from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "./logout-button";

interface NavLink {
  href: string;
  label: string;
}

const SiteNav: React.FC = () => {
  // Current path name
  const pathName = usePathname();
  // Get user session
  const { data: session, status } = useSession();

  // Nav links
  const links: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/collections", label: "Browse" },
    { href: "/about", label: "About" },
  ];
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
          {links.map((l) => {
            // Set if the link is active
            let isActive = false;
            // Set active for home page
            if (pathName.trim() === "/" && l.href === "/") {
              isActive = true;
            }
            // Set active if the current path starts with the link href
            else if (l.href !== "/" && pathName.startsWith(l.href)) {
              isActive = true;
            }

            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={
                    // Add 'active' class if the current path starts with the link href & is not the home page
                    clsx({ active: isActive })
                  }
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="top-bar-right">
        <ul className="menu">
          {status === "loading" ? (
            <li>
              <button type="button" className="button" disabled>
                Loading...
              </button>
            </li>
          ) : status === "authenticated" ? (
            <>
              <li>
                <span className="user-greeting">
                  Hello, {session.user.name}
                </span>
              </li>
              <li>
                <LogoutButton />
              </li>
            </>
          ) : (
            <li>
              <Link href="/auth/signin" className="button">
                Sign in
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SiteNav;
