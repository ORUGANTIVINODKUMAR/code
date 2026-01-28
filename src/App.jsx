import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= PAGES ================= */
import HomePage from "./pages/HomePage";


/* ================= DASHBOARD ================= */
import MainDashboard from "./pages/MainDashboard";
import Dashboard from "./pages/Dashboard";

/* ================= TOWNSHIP FLOW ================= */
import TownshipDetails from "./pages/TownshipDetails";
import InitialSetup from "./pages/InitialSetup";
import CreateBudget from "./pages/CreateBudget";
import BudgetEntry from "./pages/BudgetEntry";
import ReviewBudget from "./pages/ReviewBudget";
import BoardApproval from "./pages/BoardApproval";
import Reports from "./pages/Reports";
import ViewBudgets from "./pages/ViewBudgets";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import BudgetHistory from "./pages/BudgetHistory";

/* ================= LAYOUT ================= */
import TownshipLayout from "./layouts/TownshipLayout";
import TownshipsDashboard from "./pages/TownshipsDashboard";

/* ================= AUTH GUARD ================= */
const RequireAuth = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

function App() {
  console.log("API URL:", process.env.REACT_APP_API_URL);
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<HomePage />} />




        {/* DASHBOARD */}
        <Route path="/dashboard" element={<RequireAuth><MainDashboard /></RequireAuth>} />

        {/* TOWNSHIP AREA */}
        <Route path="/townships" element={<RequireAuth><TownshipLayout /></RequireAuth>}>
          <Route index element={<TownshipsDashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create-budget" element={<CreateBudget />} /> 
          <Route path="budget-entry" element={<BudgetEntry />} />         
          <Route path="view-budgets" element={<ViewBudgets />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="budget-history" element={<BudgetHistory />} />
          
          <Route path="review-budget" element={<ReviewBudget />} />
          <Route path="board-approval" element={<BoardApproval />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* SETUP */}
        <Route path="/setup-details" element={<RequireAuth><TownshipDetails /></RequireAuth>} />
        <Route path="/initial-setup" element={<RequireAuth><InitialSetup /></RequireAuth>} />


        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
