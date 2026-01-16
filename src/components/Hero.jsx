import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section style={styles.hero}>
      <h1>Simple & Secure Budgeting for Townships</h1>

      <p>
        Prepare, review, and approve township and road district budgets
        using a fund-based system designed for government workflows.
      </p>

      <button style={styles.button} onClick={() => navigate("/login")}>
        Login to System
      </button>
    </section>
  );
};

const styles = {
  hero: {
    textAlign: "center",
    padding: "80px 20px",
    backgroundColor: "#f5f7fa"
  },
  button: {
    marginTop: "25px",
    padding: "14px 30px",
    fontSize: "16px",
    cursor: "pointer"
  }
};

export default Hero;
