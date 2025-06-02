// src/components/Nav.jsx
import Link from "next/link";

export default function Nav() {
  return (
    <nav
      style={{
        padding: "1rem 2rem",
        background: "#111",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Logo/Home */}
      <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        <Link href="/" style={{ color: "#fff", textDecoration: "none" }}>
          🐎 Horse Tips
        </Link>
      </div>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link href="/" style={{ color: "#fff", textDecoration: "none" }}>
          Home
        </Link>
        <Link
          href="/predictions"
          style={{ color: "#fff", textDecoration: "none" }}
        >
          Predictions
        </Link>
        <Link
          href="/racecards"
          style={{ color: "#fff", textDecoration: "none" }}
        >
          Racecards
        </Link>
        <Link
          href="/results"
          style={{ color: "#fff", textDecoration: "none" }}
        >
          Results
        </Link>
        <Link
          href="/about"
          style={{ color: "#fff", textDecoration: "none" }}
        >
          About
        </Link>
        <Link
          href="/contact"
          style={{ color: "#fff", textDecoration: "none" }}
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}
