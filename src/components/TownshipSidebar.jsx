import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TownshipSidebar = () => {
  const navigate = useNavigate();

  const [townships, setTownships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTownships();
  }, []);

  const fetchTownships = async () => {
    try {
      const userId = localStorage.getItem("userId");

      // 🔐 SAFETY CHECK
      if (!userId || userId === "undefined") {
        console.warn("User not logged in");
        setLoading(false);
        return;
      }

      // ✅ CORRECT BACKEND ROUTE
      const res = await fetch(
        `http://localhost:5000/api/townships/user/${userId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch townships");
      }

      const data = await res.json();
      setTownships(data);
    } catch (err) {
      console.error("Failed to load townships", err);
    } finally {
      setLoading(false);
    }
  };

  const activeId = localStorage.getItem("activeTownshipId");

  const selectTownship = (id) => {
    localStorage.setItem("activeTownshipId", id);
    navigate("/townships/dashboard");
  };

  return (
    <div style={styles.sidebar}>
      <h3 style={styles.title}>Townships</h3>

      {loading && (
        <p style={styles.infoText}>Loading...</p>
      )}

      {!loading && townships.length === 0 && (
        <p style={styles.infoText}>
          No townships created yet
        </p>
      )}

      {townships.map((t) => (
        <div
          key={t._id}
          onClick={() => selectTownship(t._id)}
          style={{
            ...styles.item,
            backgroundColor:
              activeId === t._id ? "#e6e6e6" : "transparent"
          }}
        >
          {t.townshipName}
        </div>
      ))}

      <hr />

      <button
        style={styles.newBtn}
        onClick={() => navigate("/setup-details")}
      >
        + Create Township
      </button>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "260px",
    borderRight: "1px solid #ddd",
    padding: "20px",
    backgroundColor: "#fafafa"
  },
  title: {
    marginBottom: "15px"
  },
  item: {
    padding: "10px",
    cursor: "pointer",
    borderRadius: "4px",
    marginBottom: "5px"
  },
  newBtn: {
    marginTop: "10px",
    padding: "10px",
    width: "100%",
    cursor: "pointer"
  },
  infoText: {
    fontSize: "13px",
    color: "#666"
  }
};

export default TownshipSidebar;
