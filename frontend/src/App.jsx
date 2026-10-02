import { useState } from "react";
import "./App.css";

function App() {
  const [reports, setReports] = useState([]);

  const [formData, setFormData] = useState({
    report_id: "",
    hemoglobin: "",
    wbc: "",
    creatinine: "",
    sodium: "",
    potassium: "",
    platelet: "",
  });

  const [error, setError] = useState("");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const addReport = () => {
    if (!formData.report_id.trim()) {
      setError("Please enter a Lab Report ID.");
      return;
    }

    const duplicate = reports.some(
      (report) =>
        report.report_id.toLowerCase() ===
        formData.report_id.trim().toLowerCase()
    );

    if (duplicate) {
      setError("This Report ID already exists.");
      return;
    }

    const requiredFields = [
      "hemoglobin",
      "wbc",
      "creatinine",
      "sodium",
      "potassium",
      "platelet",
    ];

    const missingField = requiredFields.some(
      (field) => formData[field] === ""
    );

    if (missingField) {
      setError("Please complete all laboratory values.");
      return;
    }

    const newReport = {
      ...formData,
      report_id: formData.report_id.trim(),
    };

    setReports([...reports, newReport]);

    setFormData({
      report_id: "",
      hemoglobin: "",
      wbc: "",
      creatinine: "",
      sodium: "",
      potassium: "",
      platelet: "",
    });

    setError("");
  };

  const handleTriageAll = async () => {
    if (reports.length === 0) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/triage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reports: reports,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process the lab reports.");
      }

      const data = await response.json();

      const resultMap = {};

      data.results.forEach((result) => {
        resultMap[result.report_id] = result;
      });

      setResults(resultMap);
    } catch (err) {
      setError(
        "Unable to connect to the triage server. Please make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const hasResults = Object.keys(results).length > 0;

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div>
          <h1>AI Lab Triage Assistant</h1>
          <p>AI-Assisted Lab Report Triage for Dialysis Patients</p>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          System Ready
        </div>
      </header>

      {/* MAIN DASHBOARD */}
      <main className="dashboard">
        {/* INPUT PANEL */}
        <section className="input-panel">
          <div className="panel-title">
            <div>
              <h2>Enter Lab Report</h2>
              <p>Enter the laboratory values below.</p>
            </div>
          </div>

          <div className="form">
            {/* REPORT ID */}
            <div className="form-group full-width">
              <label>
                Lab Report ID
                <span className="required">*</span>
              </label>

              <input
                type="text"
                name="report_id"
                value={formData.report_id}
                onChange={handleChange}
                placeholder="e.g. LR-001"
              />

              <small>
                Unique identifier for this laboratory report
              </small>
            </div>

            {/* HEMOGLOBIN */}
            <div className="form-group">
              <label>
                Hemoglobin
                <span className="unit">g/dL</span>
              </label>

              <input
                type="number"
                step="0.1"
                name="hemoglobin"
                value={formData.hemoglobin}
                onChange={handleChange}
                placeholder="10.5"
              />
            </div>

            {/* WBC */}
            <div className="form-group">
              <label>
                WBC
                <span className="unit">×10³/µL</span>
              </label>

              <input
                type="number"
                step="0.1"
                name="wbc"
                value={formData.wbc}
                onChange={handleChange}
                placeholder="8.5"
              />
            </div>

            {/* CREATININE */}
            <div className="form-group">
              <label>
                Creatinine
                <span className="unit">mg/dL</span>
              </label>

              <input
                type="number"
                step="0.1"
                name="creatinine"
                value={formData.creatinine}
                onChange={handleChange}
                placeholder="7.2"
              />
            </div>

            {/* SODIUM */}
            <div className="form-group">
              <label>
                Sodium
                <span className="unit">mEq/L</span>
              </label>

              <input
                type="number"
                step="0.1"
                name="sodium"
                value={formData.sodium}
                onChange={handleChange}
                placeholder="137"
              />
            </div>

            {/* POTASSIUM */}
            <div className="form-group">
              <label>
                Potassium
                <span className="unit">mEq/L</span>
              </label>

              <input
                type="number"
                step="0.1"
                name="potassium"
                value={formData.potassium}
                onChange={handleChange}
                placeholder="5.2"
              />
            </div>

            {/* PLATELET */}
            <div className="form-group">
              <label>
                Platelet
                <span className="unit">×10³/µL</span>
              </label>

              <input
                type="number"
                step="1"
                name="platelet"
                value={formData.platelet}
                onChange={handleChange}
                placeholder="180"
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button className="add-button" onClick={addReport}>
            + Add Lab Report
          </button>
        </section>

        {/* RIGHT PANEL */}
        <section className="reports-panel">
          {!hasResults ? (
            <>
              {/* PENDING REPORTS */}
              <div className="reports-header">
                <div>
                  <h2>Lab Reports</h2>
                  <p>Reports waiting for triage analysis</p>
                </div>

                <div className="report-count">{reports.length}</div>
              </div>

              {reports.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">+</div>

                  <h3>No reports added</h3>

                  <p>
                    Add a laboratory report using the form to begin.
                  </p>
                </div>
              ) : (
                <div className="reports-list">
                  {reports.map((report) => (
                    <div
                      className="report-card"
                      key={report.report_id}
                    >
                      <div className="report-card-header">
                        <div>
                          <span className="report-label">
                            LAB REPORT
                          </span>

                          <h3>{report.report_id}</h3>
                        </div>

                        <span className="pending">Pending</span>
                      </div>

                      <div className="report-values">
                        <div>
                          <span>Hemoglobin</span>
                          <strong>{report.hemoglobin}</strong>
                        </div>

                        <div>
                          <span>WBC</span>
                          <strong>{report.wbc}</strong>
                        </div>

                        <div>
                          <span>Creatinine</span>
                          <strong>{report.creatinine}</strong>
                        </div>

                        <div>
                          <span>Sodium</span>
                          <strong>{report.sodium}</strong>
                        </div>

                        <div>
                          <span>Potassium</span>
                          <strong>{report.potassium}</strong>
                        </div>

                        <div>
                          <span>Platelet</span>
                          <strong>{report.platelet}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {reports.length > 0 && (
                <button
                  className="triage-button"
                  onClick={handleTriageAll}
                  disabled={loading}
                >
                  {loading
                    ? "Analyzing Reports..."
                    : "Triage All Reports"}
                </button>
              )}
            </>
          ) : (
              <>
                {/* RESULTS */}
                <div className="results-header">
                  <div>
                    <h2>Triage Results</h2>
                    <p>AI-assisted analysis of submitted laboratory reports</p>
                  </div>

                  <div className="report-count">
                    {Object.keys(results).length}
                  </div>
                </div>

                <div className="results-list">
                  {reports.map((report) => {
                    const result = results[report.report_id];

                    if (!result) return null;

                    const triageClass =
                      result.triage_result.toLowerCase();

                    return (
                      <div
                        className={`result-box ${triageClass}`}
                        key={result.report_id}
                      >
                        {/* RESULT HEADER */}
                        <div className="result-box-header">
                          <div>
                            <span className="report-label">
                              LAB REPORT
                            </span>

                            <h3>{result.report_id}</h3>
                          </div>

                          <div className={`triage-status ${triageClass}`}>
                            <span className="status-indicator"></span>
                            {result.triage_result}
                          </div>
                        </div>

                        {/* RESULT DETAILS */}
                        <div className="result-details">

                          <div className="result-detail-box">
                            <span>ML Prediction</span>
                            <strong>{result.ml_prediction}</strong>
                          </div>

                          <div className="result-detail-box">
                            <span>Confidence</span>
                            <strong>{result.ml_confidence}%</strong>
                          </div>

                          <div className="result-detail-box">
                            <span>Rule Prediction</span>
                            <strong>{result.rule_prediction}</strong>
                          </div>

                          <div className="result-risk-box">
                            <span>Risk Factors</span>

                            <div className="risk-list">
                              {result.risk_factors.map(
                                (reason, index) => (
                                  <span key={index}>
                                    {reason}
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  className="new-analysis-button"
                  onClick={() => setResults({})}
                >
                  ← Back to Lab Reports
                </button>
              </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;