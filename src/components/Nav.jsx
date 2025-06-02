// File: src/components/Nav.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Nav.module.css";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navContainer}>
      {/* Logo / Home */}
      <div className={styles.logo}>
        <Link href="/" className={styles.logoLink}>
          🐎 Horse Tips
        </Link>
      </div>

      {/* Hamburger Button (visible on mobile) */}
      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>

      {/* Navigation Links */}
      <div
        className={`${styles.navLinks} ${
          menuOpen ? styles.navLinksOpen : ""
        }`}
      >
        <Link href="/" className={styles.navLink} onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link
          href="/racecards"
          className={styles.navLink}
          onClick={() => setMenuOpen(false)}
        >
          Racecards
        </Link>
        <Link
          href="/predictions"
          className={styles.navLink}
          onClick={() => setMenuOpen(false)}
        >
          Predictions
        </Link>
        <Link
          href="/results"
          className={styles.navLink}
          onClick={() => setMenuOpen(false)}
        >
          Results
        </Link>
        <Link
          href="/about"
          className={styles.navLink}
          onClick={() => setMenuOpen(false)}
        >
          About
        </Link>
        <Link
          href="/contact"
          className={styles.navLink}
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}
