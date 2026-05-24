export default function IncidentTimeline({ incidents }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      
      {/* BOŞ DURUM */}
      {incidents.length === 0 && (
        <div style={{ 
          padding: "40px", 
          textAlign: "center", 
          color: "#475569", 
          border: "1px dashed #1e293b", 
          borderRadius: "8px" 
        }}>
          SİSTEM GÜVENLİ: KAYITLI BİR OLAY YOK
        </div>
      )}

      {/* OLAY LİSTESİ */}
      {incidents.map(i => (
        <div
          key={i.id}
          style={{
            padding: "15px",
            background: "#0f172a",
            borderLeft: `4px solid ${i.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b'}`,
            borderTop: "1px solid #1e293b",
            borderRight: "1px solid #1e293b",
            borderBottom: "1px solid #1e293b",
            borderRadius: "0 6px 6px 0",
            display: "grid",
            gridTemplateColumns: "1fr 100px 100px",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <div>
            <div style={{ fontWeight: "bold", color: "#f1f5f9" }}>{i.user}</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>{i.action}</div>
          </div>
          
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "10px", color: "#94a3b8" }}>RİSK</span>
            <div style={{ color: i.risk > 80 ? "#ef4444" : "#38bdf8", fontWeight: "bold" }}>{i.risk}</div>
          </div>

          <div style={{ textAlign: "right" }}>
            <span style={{ 
              fontSize: "9px", 
              padding: "2px 6px", 
              background: "#1e293b", 
              borderRadius: "4px",
              color: i.status === "OPEN" ? "#38bdf8" : "#10b981"
            }}>
              {i.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}