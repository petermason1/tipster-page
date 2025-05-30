export default function Footer() {
  return (
    <footer style={{
      padding: "1rem 2rem",
      background: "#111",
      color: "#fff",
      fontSize: "0.9rem",
      textAlign: "center",
      marginTop: "2rem"
    }}>
      <p>&copy; {new Date().getFullYear()} Horse Tips. All rights reserved.</p>
      <p style={{ marginTop: "0.3rem", fontSize: "0.8rem", color: "#bbb" }}>
        Built in Newcastle. Powered by data.
      </p>
    </footer>
  );
}
