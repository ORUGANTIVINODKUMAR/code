import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal";

const HomePage = () => {
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);

  return (
    <div style={styles.page}>
      {/* ================= NAVBAR ================= */}
      <header style={styles.nav}>
        <div style={styles.logo}>
          🏛 <span>Fundworkz</span>
        </div>

        <div>
          {/* SIGNUP → PAGE */}
          <button onClick={() => navigate("/signup")}>
            Sign up
          </button>

          {/* LOGIN → MODAL */}
          <button
            style={styles.navPrimary}
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Budgeting made simple for Townships
          </h1>

          <p style={styles.heroSubtitle}>
            A secure, fund-based budgeting system built specifically
            for township and road district workflows.
          </p>

          <div style={styles.heroActions}>
            <button
              style={styles.heroPrimary}
              onClick={() => setShowLogin(true)}
            >
              Login to System
            </button>

            <button
              style={styles.heroSecondary}
              onClick={() => navigate("/signup")}
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Everything you need to manage budgets
        </h2>

        <div style={styles.featuresGrid}>
          {features.map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <div style={styles.icon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section style={styles.steps}>
        <h2 style={styles.sectionTitle}>How it works</h2>

        <div style={styles.stepGrid}>
          {steps.map((s) => (
            <div key={s.no} style={styles.stepCard}>
              <div style={styles.stepNo}>{s.no}</div>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section style={styles.cta}>
        <h2>Ready to simplify township budgeting?</h2>
        <p>Get started in minutes. No training required.</p>

        <button
          style={styles.ctaBtn}
          onClick={() => navigate("/signup")}
        >
          Get Started
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer style={styles.footer}>
        © {new Date().getFullYear()} Fundworkz. All rights reserved.
      </footer>

      {/* ================= LOGIN MODAL ================= */}
      {showLogin && (
        <div
          style={styles.overlay}
          onClick={() => setShowLogin(false)}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={styles.closeBtn}
              onClick={() => setShowLogin(false)}
            >
              ✕
            </button>

            <LoginModal onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= DATA ================= */
const features = [
  { icon: "📊", title: "Fund-Based Budgets", text: "Create and manage budgets by township and road district funds." },
  { icon: "📅", title: "Flexible Fiscal Years", text: "Township FY, Calendar FY, or custom fiscal years." },
  { icon: "✅", title: "Approval Workflow", text: "Draft → Submit → Approve with auditable records." },
  { icon: "📘", title: "Chart of Accounts", text: "Standardized accounts by fund and category." },
  { icon: "📤", title: "Reports & Exports", text: "Export PDF, Excel, and CSV reports anytime." },
  { icon: "👁️", title: "Board Read-Only Access", text: "Board members can review budgets without editing." }
];

const steps = [
  { no: "1", text: "Login and choose fiscal year" },
  { no: "2", text: "Select township and funds" },
  { no: "3", text: "Enter budget amounts" },
  { no: "4", text: "Submit for approval" },
  { no: "5", text: "Export reports" }
];

/* ================= STYLES ================= */
const styles = {
  page: { fontFamily: "system-ui", color: "#0f172a" },
  nav: { display: "flex", justifyContent: "space-between", padding: "18px 48px", borderBottom: "1px solid #e5e7eb" },
  logo: { fontSize: "20px", fontWeight: "800", color: "#4338ca" },
  navPrimary: { padding: "8px 16px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px" },
  hero: { padding: "130px 20px", textAlign: "center", background: "#eef2ff" },
  heroContent: { maxWidth: "900px", margin: "auto" },
  heroTitle: { fontSize: "50px", fontWeight: "900" },
  heroSubtitle: { fontSize: "18px", marginBottom: "34px" },
  heroActions: { display: "flex", justifyContent: "center", gap: "14px" },
  heroPrimary: { padding: "14px 28px", background: "#111827", color: "#fff", borderRadius: "10px" },
  heroSecondary: { padding: "14px 28px", borderRadius: "10px", border: "1px solid #6366f1", color: "#4338ca" },
  section: { padding: "90px 40px" },
  sectionTitle: { textAlign: "center", fontSize: "32px", marginBottom: "55px" },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "26px" },
  featureCard: { padding: "26px", borderRadius: "16px", background: "#fff" },
  icon: { fontSize: "28px" },
  steps: { padding: "90px 40px", background: "#f8fafc" },
  stepGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "26px" },
  stepCard: { textAlign: "center" },
  stepNo: { width: "42px", height: "42px", borderRadius: "50%", background: "#4f46e5", color: "#fff", margin: "auto" },
  cta: { padding: "90px 20px", textAlign: "center", background: "#111827", color: "#fff" },
  ctaBtn: { padding: "14px 34px", background: "#4f46e5", color: "#fff", borderRadius: "10px" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "#fff", padding: "28px", borderRadius: "16px", width: "420px" },
  closeBtn: { position: "absolute", top: "14px", right: "14px", background: "none", border: "none" },
  footer: { padding: "22px", textAlign: "center", fontSize: "13px" }
};

export default HomePage;
