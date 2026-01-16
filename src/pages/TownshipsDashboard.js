import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TownshipsDashboard = () => {
  const navigate = useNavigate();
  const [townships, setTownships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTownships();
  }, []);

  const fetchTownships = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("No userId found");
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/townships?userId=${userId}`
      );

      const data = await res.json();
      setTownships(data);
    } catch (err) {
      console.error("Failed to load townships", err);
    } finally {
      setLoading(false);
    }
  };

  const openTownship = (id) => {
    localStorage.setItem("activeTownshipId", id);
    navigate("/dashboard");
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h2>Your Townships</h2>

      {loading && <p>Loading townships...</p>}

      {!loading && townships.length === 0 && (
        <p>No townships created yet.</p>
      )}

      {townships.map((t) => (
        <div key={t._id} style={styles.card}>
          <h3>{t.townshipName}</h3>
          <p>{t.address || "No address provided"}</p>
          <p>FY: {t.fiscalYearLabel}</p>

          <button onClick={() => openTownship(t._id)}>
            Open Township
          </button>
        </div>
      ))}

      <hr />

      <button
        style={styles.newBtn}
        onClick={() => navigate("/setup-details")}
      >
        ➕ Create New Township
      </button>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "20px",
    marginBottom: "15px",
    borderRadius: "6px"
  },
  newBtn: {
    padding: "12px 20px",
    cursor: "pointer"
  }
};

export default TownshipsDashboard;
