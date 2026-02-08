function CropForm() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Enter Soil & Climate Details</h2>

        <input style={styles.input} placeholder="Nitrogen (N)" />
        <input style={styles.input} placeholder="Phosphorus (P)" />
        <input style={styles.input} placeholder="Potassium (K)" />
        <input style={styles.input} placeholder="Temperature (°C)" />
        <input style={styles.input} placeholder="Humidity (%)" />
        <input style={styles.input} placeholder="pH Value" />
        <input style={styles.input} placeholder="Rainfall (mm)" />

        <button style={styles.button}>Get Recommendation</button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
    background: "transparent"
  },
  card: {
    width: "350px",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    background: "#fff"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default CropForm;
