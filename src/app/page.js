// File: src/app/page.jsx

import Link from "next/link";

export default function HomePage() {
  return (
    <main style={styles.container}>
      {/* Mockup Site Title */}
      <header style={styles.header}>
        <h1 style={styles.siteTitle}>🏇 Racing Hub</h1>
        <p style={styles.tagline}>
          Your one-stop destination for racecards, predictions, and results
        </p>
      </header>

      {/* Racecards Section */}
      <section style={styles.section}>
        <h2 style={styles.heading}>🗓️ Racecards</h2>
        <p style={styles.text}>
          Browse today’s and upcoming meetings. Click each time to view full racecards.
        </p>
        <div style={styles.buttonContainer}>
          <Link href="/racecards" style={styles.linkButton}>
            View Racecards
          </Link>
        </div>
      </section>

      {/* Predictions Section */}
      <section style={styles.section}>
        <h2 style={styles.heading}>🔮 Predictions</h2>
        <p style={styles.text}>
          See data-driven picks and the next 6 upcoming races with model scores.
        </p>
        <div style={styles.buttonContainer}>
          <Link href="/predictions" style={styles.linkButton}>
            View Predictions
          </Link>
        </div>
      </section>

      {/* Results Section */}
      <section style={styles.section}>
        <h2 style={styles.heading}>📊 Results</h2>
        <p style={styles.text}>
          Check recent race outcomes, finishing positions, and runner details.
        </p>
        <div style={styles.buttonContainer}>
          <Link href="/results" style={styles.linkButton}>
            View Results
          </Link>
        </div>
      </section>
    </main>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem 1rem",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  siteTitle: {
    margin: 0,
    fontSize: "2rem",
    color: "#333",
  },
  tagline: {
    margin: "0.5rem 0 0",
    color: "#666",
    fontSize: "1rem",
  },
  section: {
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "1.5rem",
    backgroundColor: "#fafafa",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  heading: {
    margin: "0 0 0.5rem",
    fontSize: "1.25rem",
    color: "#333",
    textAlign: "center",
  },
  text: {
    margin: "0 0 1rem",
    color: "#555",
    lineHeight: 1.4,
    textAlign: "center",
  },
  buttonContainer: {
    textAlign: "center",
  },
  linkButton: {
    display: "inline-block",
    backgroundColor: "#1890ff",
    color: "#fff",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: "500",
    transition: "background-color 0.15s ease",
  },
};
