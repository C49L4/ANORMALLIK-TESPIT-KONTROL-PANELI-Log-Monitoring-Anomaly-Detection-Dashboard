import IncidentTimeline from "../components/IncidentTimeline";

export default function Incidents({ incidents }) {
  // Örnek: Eğer incident yoksa göstermek için bir sayaç
  const activeCount = incidents ? incidents.length : 0;

  return (
    <div style={{ padding: "20px" }}>
      {/* 1. ÜST BAŞLIK VE ÖZET */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ color: "#fff", fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>
          SECURITY_INCIDENTS
        </h2>
        <div style={{ background: "#0f172a", padding: "8px 16px", borderRadius: "6px", border: "1px solid #1e293b" }}>
          <span style={{ color: "#94a3b8", fontSize: "12px" }}>AKTİF OLAYLAR: </span>
          <span style={{ color: "#f43f5e", fontWeight: "bold" }}>{activeCount}</span>
        </div>
      </div>

      {/* 2. ANA PANEL */}
      <div className="panel" style={{ background: "#0f172a", padding: "20px", borderRadius: "8px", border: "1px solid #1e293b" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h3 style={{ color: "#38bdf8", fontSize: "12px", textTransform: "uppercase", margin: 0 }}>
            Recent Incident Timeline
          </h3>
          <button style={{ 
            background: "transparent", border: "1px solid #38bdf8", color: "#38bdf8", 
            padding: "4px 12px", borderRadius: "4px", fontSize: "10px", cursor: "pointer" 
          }}>
            EXPORT REPORT
          </button>
        </div>
        
        <IncidentTimeline incidents={incidents} />
      </div>
    </div>
  );
}