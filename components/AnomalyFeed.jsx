import { useEffect, useState } from "react";

export default function AnomalyFeed({ logs }) {
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    const detected = logs.filter(log => log.risk > 70);

    // duplicate prevention (same id spam engeli)
    const unique = detected.filter(
      (item, index, self) =>
        index === self.findIndex(t => t.id === item.id)
    );

    setAnomalies(unique);
  }, [logs]);

  const getSeverity = (risk) => {
    if (risk > 90) return "CRITICAL";
    if (risk > 80) return "HIGH";
    return "MEDIUM";
  };

  const getColor = (risk) => {
    if (risk > 90) return "#ef4444";
    if (risk > 80) return "#f97316";
    return "#facc15";
  };

  return (
    <div>
      {/* HEADER */}
      <h2 style={{ color: "#f87171", marginBottom: 5 }}>
        ⚠ Anomaly Detection Engine
      </h2>

      {/* STATS */}
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>
        Total: <b>{anomalies.length}</b> | 
        Critical: {anomalies.filter(a => a.risk > 90).length}
      </div>

      {/* EMPTY STATE */}
      {anomalies.length === 0 && (
        <p style={{ opacity: 0.5 }}>
          System stable — no anomalies detected
        </p>
      )}

      {/* LIST */}
      {anomalies.map((a) => (
        <div
          key={a.id}
          style={{
            padding: 10,
            marginBottom: 8,
            background: "#1f1b1b",
            border: `1px solid ${getColor(a.risk)}`,
            borderLeft: `5px solid ${getColor(a.risk)}`,
            borderRadius: 6,
            position: "relative"
          }}
        >
          {/* SEVERITY TAG */}
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 10,
              fontSize: 10,
              padding: "2px 6px",
              borderRadius: 4,
              background: getColor(a.risk),
              color: "black",
              fontWeight: "bold"
            }}
          >
            {getSeverity(a.risk)}
          </div>

          <div style={{ fontSize: 12, opacity: 0.8 }}>
            {a.time}
          </div>

          <div style={{ fontWeight: "bold" }}>
            {a.user}
          </div>

          <div>
            Action: {a.action}
          </div>

          <div style={{ color: "#fca5a5" }}>
            Risk Score: <b>{a.risk}</b>
          </div>

          {/* INCIDENT ACTION (NEW) */}
          {a.risk > 90 && (
            <div style={{ marginTop: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 6px",
                  background: "#7f1d1d",
                  borderRadius: 4
                }}
              >
                INCIDENT CANDIDATE
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}