import { useState } from "react";

function Dashboard() {
  const [reports, setReports] = useState([]);

  const [form, setForm] = useState({
    report_id: "",
    hemoglobin: "",
    wbc: "",
    creatinine: "",
    sodium: "",
    potassium: "",
    platelet: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const addReport = () => {
    const values = Object.values(form);

    if (values.some((value) => value === "")) {
      alert("Please fill in the Report ID and all laboratory values.");
      return;
    }

    const duplicate = reports.some(
      (report) =>
        report.report_id.trim().toLowerCase() ===
        form.report_id.trim().toLowerCase()
    );

    if (duplicate) {
      alert(
        `Report ID "${form.report_id}" already exists in the pending reports.`
      );
      return;
    }

    const newReport = {
      ...form,
      report_id: form.report_id.trim(),
    };

    setReports((previous) => [...previous, newReport]);

    setForm({
      report_id: "",
      hemoglobin: "",
      wbc: "",
      creatinine: "",
      sodium: "",
      potassium: "",
      platelet: "",
    });
  };

  const removeReport = (index) => {
    setReports((previous) =>
      previous.filter((_, reportIndex) => reportIndex !== index)
    );
  };

  const triageReports = async () => {
    if (reports.length === 0) {
      alert("Please add at least one laboratory report.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/triage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reports: reports.map((report) => ({
            report_id: report.report_id,
            hemoglobin: Number(report.hemoglobin),
            wbc: Number(report.wbc),
            creatinine: Number(report.creatinine),
            sodium: Number(report.sodium),
            potassium: Number(report.potassium),
            platelet: Number(report.platelet),
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.detail || "Unable to process the laboratory reports."
        );
        return;
      }

      setResults(data.results || []);
      setReports([]);
    } catch (error) {
      console.error(error);

      alert(
        "Could not connect to the AI Lab Triage server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
          <div className="dashboard-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

              {/* Invisible spacer to perfectly balance the right-side badge */}
              <div style={{ visibility: 'hidden', pointerEvents: 'none' }} className="system-ready">
                  <span></span>
                  System Ready
              </div>

              {/* Centered Title Content */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                  <div className="dashboard-eyebrow">
                      CLINICAL DECISION SUPPORT
                  </div>
                  <h1>AI Lab Report Triage</h1>
                  <p>
                      AI-assisted analysis of dialysis patient laboratory reports.
                  </p>
              </div>

              {/* Right-aligned Badge */}
              <div className="system-ready">
                  <span></span>
                  System Ready
              </div>

          </div>



      {/* MAIN TWO-COLUMN AREA */}
      <div className="triage-layout">


        {/* LEFT: REPORT ENTRY */}
        <section className="entry-card">

          <div className="card-heading">

            <div>
              <h2>New Laboratory Report</h2>

              <p>
                Enter laboratory values to prepare a report.
              </p>
            </div>

            <span className="required">
              * Required
            </span>

          </div>


          <div className="entry-form">

            {/* Report ID */}
            <div className="input-group report-id">

              <label>
                Report ID <b>*</b>
              </label>

              <input
                type="text"
                name="report_id"
                value={form.report_id}
                onChange={handleChange}
                placeholder="LR-001"
              />

            </div>


            {/* Hemoglobin */}
            <div className="input-group">

              <label>
                Hemoglobin <b>*</b>
              </label>

              <div className="field-unit">

                <input
                  type="number"
                  step="any"
                  min="0"
                  name="hemoglobin"
                  value={form.hemoglobin}
                  onChange={handleChange}
                  placeholder="10.5"
                />

                <span>g/dL</span>

              </div>

            </div>


            {/* WBC */}
            <div className="input-group">

              <label>
                WBC <b>*</b>
              </label>

              <div className="field-unit">

                <input
                  type="number"
                  step="any"
                  min="0"
                  name="wbc"
                  value={form.wbc}
                  onChange={handleChange}
                  placeholder="7.8"
                />

                <span>×10³/µL</span>

              </div>

            </div>


            {/* Creatinine */}
            <div className="input-group">

              <label>
                Creatinine <b>*</b>
              </label>

              <div className="field-unit">

                <input
                  type="number"
                  step="any"
                  min="0"
                  name="creatinine"
                  value={form.creatinine}
                  onChange={handleChange}
                  placeholder="6.2"
                />

                <span>mg/dL</span>

              </div>

            </div>


            {/* Sodium */}
            <div className="input-group">

              <label>
                Sodium <b>*</b>
              </label>

              <div className="field-unit">

                <input
                  type="number"
                  step="any"
                  min="0"
                  name="sodium"
                  value={form.sodium}
                  onChange={handleChange}
                  placeholder="138"
                />

                <span>mmol/L</span>

              </div>

            </div>


            {/* Potassium */}
            <div className="input-group">

              <label>
                Potassium <b>*</b>
              </label>

              <div className="field-unit">

                <input
                  type="number"
                  step="any"
                  min="0"
                  name="potassium"
                  value={form.potassium}
                  onChange={handleChange}
                  placeholder="4.7"
                />

                <span>mmol/L</span>

              </div>

            </div>


            {/* Platelet */}
            <div className="input-group">

              <label>
                Platelet Count <b>*</b>
              </label>

              <div className="field-unit">

                <input
                  type="number"
                  step="any"
                  min="0"
                  name="platelet"
                  value={form.platelet}
                  onChange={handleChange}
                  placeholder="220"
                />

                <span>×10³/µL</span>

              </div>

            </div>

          </div>


          {/* ADD REPORT */}
          <div className="entry-footer">

            <span>
              All laboratory values are required.
            </span>

            <button
              className="add-report-button"
              onClick={addReport}
            >
              <strong>+</strong>
              Add Report
            </button>

          </div>

        </section>


        {/* RIGHT: REPORTS OR RESULTS */}
        <section className="right-panel">


          {/* ==============================
              PENDING REPORTS
          ============================== */}

          {results.length === 0 && (

            <>

              <div className="right-panel-header">

                <div>

                  <h2>Reports</h2>

                  <p>
                    Reports ready for AI analysis.
                  </p>

                </div>

                <div className="report-number">
                  {reports.length}
                </div>

              </div>


              {reports.length === 0 ? (

                <div className="queue-empty">

                  <div className="queue-empty-icon">
                    +
                  </div>

                  <strong>
                    No reports added
                  </strong>

                  <span>
                    Added reports will appear here.
                  </span>

                </div>

              ) : (

                <div className="report-queue">

                  {reports.map((report, index) => (

                    <div
                      className="report-queue-item"
                      key={`${report.report_id}-${index}`}
                    >

                      <div className="queue-item-header">

                        <div>

                          <span className="queue-label">
                            REPORT ID
                          </span>

                          <strong>
                            {report.report_id}
                          </strong>

                        </div>

                        <button
                          className="queue-remove"
                          onClick={() => removeReport(index)}
                        >
                          ×
                        </button>

                      </div>


                      <div className="queue-values">

                        <div>
                          <span>Hb</span>
                          <strong>{report.hemoglobin}</strong>
                        </div>

                        <div>
                          <span>WBC</span>
                          <strong>{report.wbc}</strong>
                        </div>

                        <div>
                          <span>Cr</span>
                          <strong>{report.creatinine}</strong>
                        </div>

                        <div>
                          <span>Na</span>
                          <strong>{report.sodium}</strong>
                        </div>

                        <div>
                          <span>K</span>
                          <strong>{report.potassium}</strong>
                        </div>

                        <div>
                          <span>PLT</span>
                          <strong>{report.platelet}</strong>
                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}


              {reports.length > 0 && (

                <div className="run-section">

                  <div className="ready-message">

                    <span className="ai-small">
                      AI
                    </span>

                    <div>

                      <strong>
                        Ready for analysis
                      </strong>

                      <small>
                        ML model + rule engine
                      </small>

                    </div>

                  </div>


                  <button
                    className="run-button"
                    onClick={triageReports}
                    disabled={loading}
                  >

                    {loading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Run AI Triage
                        <span>→</span>
                      </>
                    )}

                  </button>

                </div>

              )}

            </>

          )}


          {/* ==============================
              TRIAGE RESULTS
          ============================== */}

          {results.length > 0 && (

            <>

              <div className="right-panel-header">

                <div>

                  <div className="result-eyebrow">
                    ANALYSIS COMPLETE
                  </div>

                  <h2>
                    Triage Results
                  </h2>

                  <p>
                    AI-assisted analysis results.
                  </p>

                </div>

                <div className="result-number">
                  {results.length}
                </div>

              </div>


              <div className="result-list">

                {results.map((result, index) => {

                  const status =
                    result.triage_result?.toLowerCase() ||
                    "normal";

                  return (

                    <div
                      className={`small-result-card result-${status}`}
                      key={`${result.report_id}-${index}`}
                    >

                      {/* Result header */}
                      <div className="small-result-top">

                        <div>

                          <span>
                            REPORT ID
                          </span>

                          <strong>
                            {result.report_id}
                          </strong>

                        </div>

                        <div
                          className={`small-status ${status}`}
                        >

                          <i></i>

                          {result.triage_result}

                        </div>

                      </div>


                      {/* Prediction */}
                      <div className="prediction-row">

                        <div>
                          <span>ML Prediction</span>

                          <strong>
                            {result.ml_prediction}
                          </strong>
                        </div>

                        <div>
                          <span>Confidence</span>

                          <strong>
                            {result.ml_confidence}%
                          </strong>
                        </div>

                        <div>
                          <span>Rule</span>

                          <strong>
                            {result.rule_prediction}
                          </strong>
                        </div>

                      </div>


                      {/* Laboratory values */}
                      <div className="result-values">

                        <div className="result-section-title">
                          Laboratory Values
                        </div>

                        <div className="result-value-grid">

                          <div>
                            <span>Hb</span>
                            <strong>
                              {result.lab_values.hemoglobin}
                            </strong>
                          </div>

                          <div>
                            <span>WBC</span>
                            <strong>
                              {result.lab_values.wbc}
                            </strong>
                          </div>

                          <div>
                            <span>Cr</span>
                            <strong>
                              {result.lab_values.creatinine}
                            </strong>
                          </div>

                          <div>
                            <span>Na</span>
                            <strong>
                              {result.lab_values.sodium}
                            </strong>
                          </div>

                          <div>
                            <span>K</span>
                            <strong>
                              {result.lab_values.potassium}
                            </strong>
                          </div>

                          <div>
                            <span>PLT</span>
                            <strong>
                              {result.lab_values.platelet}
                            </strong>
                          </div>

                        </div>

                      </div>


                      {/* Risk factors */}
                      <div className="result-risks">

                        <div className="result-section-title">
                          Risk Factors
                        </div>

                        {result.risk_factors &&
                        result.risk_factors.length > 0 ? (

                          result.risk_factors.map(
                            (reason, reasonIndex) => (

                              <div
                                className="result-risk"
                                key={reasonIndex}
                              >
                                <span>!</span>
                                {reason}
                              </div>

                            )
                          )

                        ) : (

                          <div className="result-no-risk">

                            <span>✓</span>

                            No project-defined thresholds triggered.

                          </div>

                        )}

                      </div>

                    </div>

                  );

                })}

              </div>


              <div className="result-footer">

                <span>
                  Final clinical judgement remains with a qualified healthcare professional.
                </span>

                <button
                  className="new-analysis-button"
                  onClick={clearResults}
                >
                  New Analysis
                </button>

              </div>

            </>

          )}

        </section>

      </div>

    </div>
  );
}

export default Dashboard;