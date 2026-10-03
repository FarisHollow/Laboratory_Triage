import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import ReportHistory from "./pages/ReportHistory";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <h2>AI Lab Triage</h2>
          <span>Clinical Decision Support</span>
        </div>

        <div className="nav-links">
          <button
            className={activePage === "dashboard" ? "active" : ""}
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={activePage === "history" ? "active" : ""}
            onClick={() => setActivePage("history")}
          >
            Report History
          </button>
        </div>
      </nav>

      <main className="main-content">
        {activePage === "dashboard" ? (
          <Dashboard />
        ) : (
          <ReportHistory />
        )}
      </main>
    </div>
  );
}

export default App;