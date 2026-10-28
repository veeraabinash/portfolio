"use client";

import { scrollToSection } from "@/lib/smoothScroll";

const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

// Typographic code mark: <dev/> with a blinking cursor.
function DevLogo() {
  return (
    <span className="dev-logo" aria-hidden="true">
      <span className="dev-logo-bracket dev-logo-open">&lt;</span>
      <span className="dev-logo-word">dev</span>
      <span className="dev-logo-bracket dev-logo-close">
        <span className="dev-logo-slash">/</span>&gt;
      </span>
      <span className="dev-logo-cursor" />
    </span>
  );
}

export default function Navbar() {
  const go = (e, href) => {
    e.preventDefault();
    scrollToSection(href);
  };

  return (
    <header className="header">
      <a href="#top" className="navbar-title" onClick={(e) => go(e, "#top")} aria-label="Back to top">
        <DevLogo />
      </a>
      <ul className="header-links">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} onClick={(e) => go(e, l.href)} className="hover-link" data-text={l.label}>
              <span>{l.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}
