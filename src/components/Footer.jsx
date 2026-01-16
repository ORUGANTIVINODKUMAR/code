const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>© Township Budgeting System – MVP</p>
      <p>Secure | Auditor-Friendly | Government Focused</p>
    </footer>
  );
};

const styles = {
  footer: {
    marginTop: "60px",
    padding: "30px",
    textAlign: "center",
    borderTop: "1px solid #ddd",
    backgroundColor: "#fafafa",
    fontSize: "14px"
  }
};

export default Footer;

