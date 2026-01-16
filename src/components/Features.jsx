const Features = () => {
  return (
    <section style={styles.section}>
      <h2>Built for Township & Road District Budgeting</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Fund-Based Budgets</h3>
          <p>Create and manage budgets by individual township and road district funds.</p>
        </div>

        <div style={styles.card}>
          <h3>Flexible Fiscal Years</h3>
          <p>Support Township FY (Apr–Mar), Calendar FY, or custom fiscal years.</p>
        </div>

        <div style={styles.card}>
          <h3>Approval Workflow</h3>
          <p>Draft → Submit → Approve with locked, auditor-friendly budgets.</p>
        </div>

        <div style={styles.card}>
          <h3>Chart of Accounts</h3>
          <p>Fund-specific accounts with standard budget categories.</p>
        </div>

        <div style={styles.card}>
          <h3>Reports & Exports</h3>
          <p>Generate PDF, Excel, and CSV budget reports anytime.</p>
        </div>

        <div style={styles.card}>
          <h3>Board Read-Only Access</h3>
          <p>Allow board members to review budgets without editing.</p>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: "70px 40px",
    textAlign: "center"
  },
  grid: {
    marginTop: "40px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "25px"
  },
  card: {
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "#fff",
    textAlign: "left"
  }
};

export default Features;
