import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MainDashboard = () => {
  const navigate = useNavigate();

  const email = localStorage.getItem("userEmail") || "User";
  const userId = localStorage.getItem("userId");
  const avatar = email.charAt(0).toUpperCase();

  const [activeMenu, setActiveMenu] = useState("view");
  const [townships, setTownships] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD TOWNSHIPS ================= */
  useEffect(() => {
    fetchTownships();
  }, []);

  const fetchTownships = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/townships?userId=${userId}`
      );
      const data = await res.json();
      setTownships(data);
    } catch (err) {
      console.error("Failed to load townships");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE TOWNSHIP ================= */
  const deleteTownship = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this township? This cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5000/api/townships/${id}`, {
        method: "DELETE"
      });

      setTownships((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert("Failed to delete township");
    }
  };

  /* ================= OPEN TOWNSHIP ================= */
  const openTownship = (id) => {
    localStorage.setItem("activeTownshipId", id);
    navigate("/townships/dashboard");
  };

  return (
    <div style={styles.layout}>
      {/* ========== SIDEBAR ========== */}
      <aside style={styles.sidebar}>
        <div style={styles.avatar}>{avatar}</div>

        <button
          style={activeMenu === "create" ? styles.activeBtn : styles.btn}
          onClick={() => navigate("/setup-details")}
        >
          Create Township
        </button>

        <button
          style={activeMenu === "view" ? styles.activeBtn : styles.btn}
          onClick={() => setActiveMenu("view")}
        >
          View Townships
        </button>

        <button
          style={activeMenu === "settings" ? styles.activeBtn : styles.btn}
          onClick={() => setActiveMenu("settings")}
        >
          Settings
        </button>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main style={styles.content}>
        {activeMenu === "view" && (
          <>
            <h2>Townships</h2>

            {loading && <p>Loading townships...</p>}

            {!loading && townships.length === 0 && (
              <p>No townships created yet.</p>
            )}

            <div style={styles.grid}>
              {townships.map((t) => (
                <div key={t._id} style={styles.card}>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => openTownship(t._id)}
                  >
                    <h3>{t.townshipName}</h3>
                    <p>FY: {t.fiscalYearLabel}</p>
                  </div>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteTownship(t._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeMenu === "settings" && (
          <>
            <h2>Settings</h2>
            <p>Global application settings (future use)</p>
          </>
        )}
      </main>
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f6f8"
  },
  sidebar: {
    width: "220px",
    background: "#1e1e1e",
    color: "#fff",
    padding: "20px"
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#6c47ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    marginBottom: "30px"
  },
  btn: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    background: "#2c2c2c",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px"
  },
  activeBtn: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    background: "#6c47ff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px"
  },
  content: {
    flex: 1,
    padding: "30px"
  },
  grid: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 5px rgba(0,0,0,0.08)"
  },
  deleteBtn: {
    marginTop: "12px",
    padding: "6px 12px",
    border: "1px solid #d9534f",
    background: "#fff",
    color: "#d9534f",
    cursor: "pointer",
    borderRadius: "4px"
  }
};

export default MainDashboard;
