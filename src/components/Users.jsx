const Users = () => {
  return (
    <section style={styles.section}>
      <h2>Who Should Use This?</h2>

      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>Township Administrators</h3>
          <p>Create and manage township budgets with full control.</p>
        </div>

        <div style={styles.card}>
          <h3>Road District Officials</h3>
          <p>Prepare road and bridge budgets using fund-specific accounts.</p>
        </div>

        <div style={styles.card}>
          <h3>Board Members</h3>
          <p>View and review submitted budgets with read-only access.</p>
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
  cards: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap"
  },
  card: {
    width: "260px",
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "#fff"
  }
};

export default Users;
