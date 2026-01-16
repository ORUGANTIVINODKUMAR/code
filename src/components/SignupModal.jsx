import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const continueSignup = () => {
    if (!email) {
      alert("Please enter email");
      return;
    }

    // Save temporarily
    localStorage.setItem(
      "signupUser",
      JSON.stringify({ email })
    );

    onClose();
    navigate("/onboarding/name");
  };

  return (
    <div>
      <h2 style={styles.title}>Sign up</h2>

      <input
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button style={styles.primaryBtn} onClick={continueSignup}>
        Continue with email
      </button>
    </div>
  );
};

const styles = {
  title: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "18px"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "16px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb"
  },
  primaryBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#111827",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer"
  }
};

export default SignupModal;
