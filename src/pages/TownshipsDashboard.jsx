import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TownshipsDashboard = () => {
  const navigate = useNavigate();

  const [townships, setTownships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTownshipId, setActiveTownshipId] = useState(
    localStorage.getItem("activeTownshipId")
  );

  useEffect(() => {
    fetchTownships();
  }, []);

  const fetchTownships = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("User not logged in");
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

  /* ================= OPEN TOWNSHIP ================= */
  const openTownship = (township) => {
    // ✅ SAVE ACTIVE TOWNSHIP
    localStorage.setItem("activeTownshipId", township._id);
    localStorage.setItem("activeTownshipName", township.townshipName);

    setActiveTownshipId(township._id);

    navigate("/townships/dashboard");
  };

  const createNewTownship = () => {
    navigate("/setup-details");
  };

  return (
    <div style={styles.container}>
      <h2>My Townships</h2>

      {loading && <p>Loading townships...</p>}

      {!loading && townships.length === 0 && (
        <p>No townships found.</p>
      )}

      {!loading &&
        townships.map((t) => (
          <div
            key={t._id}
            style={{
              ...styles.card,
              border:
                t._id === activeTownshipId
                  ? "2px solid #4f46e5"
                  : "1px solid #ddd"
            }}
            onClick={() => openTownship(t)}
          >
            <h3>{t.townshipName}</h3>
            <p>{t.fiscalYearLabel}</p>

            {t._id === activeTownshipId && (
              <p style={styles.activeLabel}>Active Township</p>
            )}
          </div>
        ))}

      <button style={styles.button} onClick={createNewTownship}>
        + Create New Township
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto"
  },
  card: {
    padding: "20px",
    borderRadius: "6px",
    marginBottom: "15px",
    cursor: "pointer",
    background: "#fff"
  },
  activeLabel: {
    marginTop: "8px",
    color: "#4f46e5",
    fontWeight: "600"
  },
  button: {
    marginTop: "20px",
    padding: "12px 20px",
    cursor: "pointer"
  }
};

export default TownshipsDashboard;




