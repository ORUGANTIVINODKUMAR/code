const HowItWorks = () => {
  return (
    <section style={styles.section}>
      <h2>How It Works</h2>

      <div style={styles.steps}>
        <div style={styles.step}>
          <span style={styles.number}>1</span>
          <p>Login and select your fiscal year</p>
        </div>

        <div style={styles.step}>
          <span style={styles.number}>2</span>
          <p>Select township and road district funds</p>
        </div>

        <div style={styles.step}>
          <span style={styles.number}>3</span>
          <p>Enter budget amounts by category</p>
        </div>

        <div style={styles.step}>
          <span style={styles.number}>4</span>
          <p>Review and submit for approval</p>
        </div>

        <div style={styles.step}>
          <span style={styles.number}>5</span>
          <p>Export reports (PDF / Excel)</p>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    backgroundColor: "#f9f9f9",
    padding: "70px 40px",
    textAlign: "center"
  },
  steps: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap"
  },
  step: {
    width: "200px",
    padding: "20px"
  },
  number: {
    display: "inline-block",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#e0e0e0",
    lineHeight: "40px",
    fontWeight: "bold",
    marginBottom: "10px"
  }
};

export default HowItWorks;
