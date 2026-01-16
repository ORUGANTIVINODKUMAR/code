const Header = ({ onLoginClick, onSignupClick }) => {
  return (
    <div style={styles.header}>
      <div style={styles.left}>
        🏛️ <strong>Township Budgeting System</strong>
      </div>

      <div style={styles.right}>
        <button style={styles.signup} onClick={onSignupClick}>
          Sign up
        </button>

        <button style={styles.login} onClick={onLoginClick}>
          Login
        </button>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 24px",
    borderBottom: "1px solid #ddd"
  },
  right: {
    display: "flex",
    gap: "10px"
  },
  signup: {
    padding: "6px 14px",
    border: "1px solid #000",
    background: "#fff",
    cursor: "pointer"
  },
  login: {
    padding: "6px 14px",
    background: "#6c47ff",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  }
};

export default Header;
