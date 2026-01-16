import { Outlet, useNavigate } from "react-router-dom";

const TownshipLayout = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  const logout = () => {
    // ❗ DO NOT delete budgets & townships
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");

    navigate("/login");
  };

  return (
    <div>
      {/* TOP BAR */}
      <header style={styles.header}>
        <div style={styles.left}>
          🏛️ <strong>FundworkZ</strong>
        </div>

        <div style={styles.right}>
          <span>{email}</span>



          <button onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  header: {
    height: "60px",
    background: "#f5f5f5",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px"
  },
  left: {
    fontSize: "16px"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  content: {
    padding: "30px"
  }
};

export default TownshipLayout;
