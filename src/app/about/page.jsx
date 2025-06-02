// File: src/app/about/page.jsx

import Link from "next/link";

export default function AboutPage() {
  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🏇 Racing Hub</h1>
        <p style={styles.subtitle}>
          Your trusted source for racecards, expert analysis, and results
        </p>
      </header>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Our Mission</h2>
        <p style={styles.text}>
          Racing Hub exists to bring clarity and confidence to every horse
          racing fan. We compile comprehensive racecards, up‐to‐the‐minute
          insights, and detailed results so you can make informed decisions—
          whether you’re placing a small each‐way bet or simply following the
          sport you love.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>What We Offer</h2>
        <ul style={styles.list}>
          <li>
            <strong>Racecards:</strong> Full details on today’s meetings—
            course information, runner lists, jockeys, trainers, and more.
          </li>
          <li>
            <strong>Predictions:</strong> Insight into the next few races,
            including form guides, historical trends, and recommended value
            picks.
          </li>
          <li>
            <strong>Results:</strong> Timely updates on finishing positions,
            times, comments on each runner’s performance, and downloadable
            summaries.
          </li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Why Choose Us</h2>
        <p style={styles.text}>
          Over the years, our team of lifelong racing enthusiasts and industry
          insiders has honed our approach:
        </p>
        <ul style={styles.list}>
          <li>
            <strong>Trusted Sources:</strong> We gather data from official
            racing authorities and on‐course reporters to ensure accuracy.
          </li>
          <li>
            <strong>In‐Depth Analysis:</strong> Every insight is backed by form
            study, track conditions, and current market dynamics.
          </li>
          <li>
            <strong>Community Focused:</strong> We welcome feedback from our
            readers—whether you’re a seasoned punter or just getting started,
            your insights help us improve.
          </li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Meet the Team</h2>
        <div style={styles.teamGrid}>
          <div style={styles.teamMember}>
            <strong>Waldo the Whip</strong>
            <p>
              Lead Editor – Waldo brings years of on-course reporting experience
              to ensure every racecard is accurate and up-to-date.
            </p>
          </div>
          <div style={styles.teamMember}>
            <strong>Mick “The Vessel” Pilling</strong>
            <p>
              Race Analyst – Former on-course commentator, Mick provides insider
              insights into form and track conditions.
            </p>
          </div>
          <div style={styles.teamMember}>
            <strong>Mase the Ace</strong>
            <p>
              Founder & Content Manager – Mase oversees all content, crafting
              clear explanations of racing terminology and strategies.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Get in Touch</h2>
        <p style={styles.text}>
          Have questions, feedback, or suggestions? We’d love to hear from
          you.{" "}
          <Link href="/contact" style={styles.link}>
            Contact Us
          </Link>
        </p>
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
    color: "#333",
    lineHeight: 1.6,
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    margin: 0,
    fontSize: "2rem",
  },
  subtitle: {
    margin: "0.5rem 0 0",
    color: "#555",
    fontSize: "1rem",
  },
  section: {
    marginBottom: "2rem",
  },
  sectionHeading: {
    fontSize: "1.25rem",
    marginBottom: "0.5rem",
    color: "#222",
  },
  text: {
    fontSize: "1rem",
    marginBottom: "1rem",
  },
  list: {
    paddingLeft: "1.25rem",
    margin: 0,
    listStyleType: "disc",
  },
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
  },
  teamMember: {
    backgroundColor: "#f9f9f9",
    padding: "1rem",
    borderRadius: "6px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  link: {
    color: "#1890ff",
    textDecoration: "none",
    marginLeft: "0.25rem",
  },
};
