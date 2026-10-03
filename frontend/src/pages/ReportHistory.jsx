import { useEffect, useState } from "react";

function ReportHistory() {
  const [reports, setReports] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async (id = "") => {
  setLoading(true);

  try {
    let url;

    if (id) {
      url = `http://127.0.0.1:8000/reports/${encodeURIComponent(id)}`;
    } else {
      url = "http://127.0.0.1:8000/reports";
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch reports");
    }

    const data = await response.json();

    if (id) {
      if (data.message === "Report not found") {
        setReports([]);
      } else {
        setReports([data]);
      }
    } else {
      setReports(data.reports);
    }

  } catch (error) {
    console.error(error);
    alert("Could not load report history.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReports(searchId.trim());
  };

  const clearSearch = () => {
    setSearchId("");
    fetchReports();
  };

  const deleteReport = async (reportId) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${reportId}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/reports/${encodeURIComponent(reportId)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete report");
      }

      setSelectedReport(null);
      fetchReports(searchId.trim());
    } catch (error) {
      console.error(error);
      alert("Could not delete the report.");
    }
  };

  const deleteAllReports = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete ALL saved reports?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/reports", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete reports");
      }

      setReports([]);
      setSelectedReport(null);
    } catch (error) {
      console.error(error);
      alert("Could not delete reports.");
    }
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <div>
          <h1>Report History</h1>
          <p>View and manage previously processed laboratory reports.</p>
        </div>

        <button className="danger-btn" onClick={deleteAllReports}>
          Delete All
        </button>
      </div>

      {/* Search */}
      <section className="card search-card">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search by Report ID e.g. LR-003"
          />

          <button type="submit" className="primary-btn">
            Search
          </button>

          {searchId && (
            <button
              type="button"
              className="secondary-btn"
              onClick={clearSearch}
            >
              Clear
            </button>
          )}
        </form>
      </section>

      {/* Reports */}
      <section className="card">
        <div className="section-header">
          <h2>Saved Reports</h2>
          <span>{reports.length} report(s)</span>
        </div>

        {loading ? (
          <p className="empty-message">Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className="empty-message">
            No reports found.
          </p>
        ) : (
          <div className="history-list">
            {reports.map((report) => (
              <div className="history-row" key={report.report_id}>
                <div className="history-main">
                  <div className="history-title">
                    <strong>{report.report_id}</strong>

                    <span
                      className={`status ${report.triage_result.toLowerCase()}`}
                    >
                      {report.triage_result}
                    </span>
                  </div>

                  <p>
                    ML: {report.ml_prediction} | Confidence:{" "}
                    {report.ml_confidence}%
                  </p>

                  <small>
                    Created:{" "}
                    {new Date(report.created_at).toLocaleString()}
                  </small>
                </div>

                <div className="history-actions">
                  <button
                    className="view-btn"
                    onClick={() => setSelectedReport(report)}
                  >
                    View
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteReport(report.report_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Report Details */}
      {selectedReport && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>{selectedReport.report_id}</h2>

                <span
                  className={`status ${selectedReport.triage_result.toLowerCase()}`}
                >
                  {selectedReport.triage_result}
                </span>
              </div>

              <button
                className="close-btn"
                onClick={() => setSelectedReport(null)}
              >
                ×
              </button>
            </div>

            <h3>Laboratory Values</h3>

            <div className="lab-grid">
              <div>
                <span>Hemoglobin</span>
                <strong>{selectedReport.lab_values.hemoglobin}</strong>
              </div>

              <div>
                <span>WBC</span>
                <strong>{selectedReport.lab_values.wbc}</strong>
              </div>

              <div>
                <span>Creatinine</span>
                <strong>{selectedReport.lab_values.creatinine}</strong>
              </div>

              <div>
                <span>Sodium</span>
                <strong>{selectedReport.lab_values.sodium}</strong>
              </div>

              <div>
                <span>Potassium</span>
                <strong>{selectedReport.lab_values.potassium}</strong>
              </div>

              <div>
                <span>Platelet</span>
                <strong>{selectedReport.lab_values.platelet}</strong>
              </div>
            </div>

            <h3>Triage Analysis</h3>

            <div className="analysis-box">
              <p>
                <strong>ML Prediction:</strong>{" "}
                {selectedReport.ml_prediction}
              </p>

              <p>
                <strong>ML Confidence:</strong>{" "}
                {selectedReport.ml_confidence}%
              </p>

              <p>
                <strong>Rule Prediction:</strong>{" "}
                {selectedReport.rule_prediction}
              </p>
            </div>

            <h3>Risk Factors</h3>

            <ul className="risk-list">
              {selectedReport.risk_factors.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>

            <button
              className="danger-btn modal-delete"
              onClick={() => deleteReport(selectedReport.report_id)}
            >
              Delete This Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportHistory;