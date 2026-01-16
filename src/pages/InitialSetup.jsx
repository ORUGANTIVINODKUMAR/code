import { useState } from "react";
import { useNavigate } from "react-router-dom";

const InitialSetup = () => {
  const navigate = useNavigate();

  const [fyType, setFyType] = useState("township");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [funds, setFunds] = useState({
    // Township
    generalTown: false,
    generalAssistance: false,
    cemetery: false,
    insurance: false,
    socialSecurity: false,
    retirement: false,

  // Road District
    roadBridge: false,
    permanentRoad: false,
    equipmentBuilding: false,
    motorFuelTax: false
  });


  const toggleFund = (key) => {
    setFunds({ ...funds, [key]: !funds[key] });
  };

  const saveSetup = () => {
    const setupData = {
      fiscalYearType: fyType,
      customDates:
        fyType === "custom"
          ? { start: customStart, end: customEnd }
          : null,
      selectedFunds: funds
    };

    localStorage.setItem("initialSetup", JSON.stringify(setupData));
    localStorage.setItem("setupCompleted", "true");

    navigate("/dashboard");
  };

  return (
    <div style={styles.container}>
      <h2>Initial Setup</h2>

      {/* Fiscal Year */}
      <section style={styles.section}>
        <h3>Fiscal Year</h3>

        <label>
          <input
            type="radio"
            checked={fyType === "township"}
            onChange={() => setFyType("township")}
          />
          Township FY (April 1 – March 31)
        </label>

        <label>
          <input
            type="radio"
            checked={fyType === "calendar"}
            onChange={() => setFyType("calendar")}
          />
          Calendar Year (Jan 1 – Dec 31)
        </label>

        <label>
          <input
            type="radio"
            checked={fyType === "custom"}
            onChange={() => setFyType("custom")}
          />
          Custom Fiscal Year
        </label>

        {fyType === "custom" && (
          <div style={styles.customDates}>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
          </div>
        )}
      </section>

      {/* Funds */}
      <section style={styles.section}>
        <h3>Township Funds</h3>
        {renderCheckbox("General Town", "generalTown")}
        {renderCheckbox("General Assistance", "generalAssistance")}
        {renderCheckbox("Cemetery", "cemetery")}
        {renderCheckbox("Insurance", "insurance")}
        {renderCheckbox("Social Security", "socialSecurity")}
        {renderCheckbox("Retirement / IMRF", "retirement")}
      </section>

      <section style={styles.section}>
        <h3>Road District Funds</h3>
        {renderCheckbox("Road & Bridge", "roadBridge")}
        {renderCheckbox("Permanent Road", "permanentRoad")}
        {renderCheckbox("Equipment & Building", "equipmentBuilding")}
        {renderCheckbox("Motor Fuel Tax", "motorFuelTax")}
      </section>

      <button style={styles.button} onClick={saveSetup}>
        Save & Continue
      </button>
    </div>
  );

  function renderCheckbox(label, key) {
    return (
      <label style={styles.checkbox}>
        <input
          type="checkbox"
          checked={funds[key]}
          onChange={() => toggleFund(key)}
        />
        {label}
      </label>
    );
  }
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    padding: "30px"
  },
  section: {
    marginBottom: "30px"
  },
  checkbox: {
    display: "block",
    marginBottom: "8px"
  },
  customDates: {
    marginTop: "10px",
    display: "flex",
    gap: "10px"
  },
  button: {
    padding: "12px 30px",
    cursor: "pointer"
  }
};

export default InitialSetup;

