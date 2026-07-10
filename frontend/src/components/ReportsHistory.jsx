import {
  FaFilePdf,
  FaDownload,
  FaTrash,
  FaClock,
} from "react-icons/fa";

function ReportsHistory({ reports = [], deleteReport }) {
  return (
    <section className="reports-history">

      <div className="reports-history-header">
        <h2>
          <FaClock />
          Generated Reports
        </h2>

        <p>
          Previously generated business reports.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="reports-empty">
          No reports generated yet.
        </div>
      ) : (
        reports.map((report) => (
          <div
            className="report-history-card"
            key={report.id}
          >
            <div>

              <h3>
                <FaFilePdf />
                {report.title}
              </h3>

              <p>{report.date}</p>

            </div>

            <div className="report-history-actions">

              <button>
                <FaDownload />
              </button>

              <button
                onClick={() => deleteReport(report.id)}
              >
                <FaTrash />
              </button>

            </div>

          </div>
        ))
      )}

    </section>
  );
}

export default ReportsHistory;