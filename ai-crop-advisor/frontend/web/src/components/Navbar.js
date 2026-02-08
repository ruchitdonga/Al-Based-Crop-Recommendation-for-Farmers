function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>🌾 Crop Advisor</h2>
    </nav>
  );
}

const styles = {
  nav: {
    background: "linear-gradient(90deg, #2e7d32, #4caf50)",
    padding: "15px 40px",
    color: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
  },
  logo: {
    margin: 0,
    fontWeight: "600"
  }
};

export default Navbar;
