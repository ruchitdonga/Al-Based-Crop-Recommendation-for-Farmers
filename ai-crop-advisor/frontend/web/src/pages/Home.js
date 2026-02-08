function Home() {
  return (
    <div style={{
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      padding: "40px",
      borderRadius: "10px",
      maxWidth: "900px",
      margin: "60px auto"
    }}>
      <h1>AI-Based Crop Recommendation System</h1>
      <p>
        This application helps farmers identify the most suitable crop to grow
        based on soil nutrients, weather conditions, and environmental factors.
      </p>
      <p>
        Using machine learning models, the system analyzes Nitrogen,
        Phosphorus, Potassium, temperature, humidity, pH, and rainfall
        to recommend the best crop.
      </p>
    </div>
  );
}

export default Home;
