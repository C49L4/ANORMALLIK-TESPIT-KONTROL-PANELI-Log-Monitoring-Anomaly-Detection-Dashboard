import LogStream from "../components/LogStream";
import TrafficChart from "../components/TrafficChart";

export default function Dashboard({ logs, setLogs, running }) {
  // İstatistik hesaplamaları
  const criticalCount = logs.filter(l => l.risk > 70).length;
  const avgRisk = logs.length > 0 ? (logs.reduce((a, b) => a + (b.risk || 0), 0) / logs.length).toFixed(1) : 0;

  const kpiCards = [
    { label: "TOPLAM LOG", value: logs.length, color: "#38bdf8" },
    { label: "KRİTİK OLAYLAR", value: criticalCount, color: "#f43f5e" },
    { label: "ORTALAMA RİSK", value: `${avgRisk}%`, color: "#fbbf24" },
    { label: "SİSTEM DURUMU", value: "OPERATIONAL", color: "#10b981" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. ÜST KISIM: İSTATİSTİK KARTLARI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
        {kpiCards.map((stat, i) => (
          <div key={i} style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <p style={{ color: '#94a3b8', fontSize: '10px', margin: '0 0 5px 0', textTransform: 'uppercase' }}>{stat.label}</p>
            <h2 style={{ color: stat.color, margin: 0, fontSize: '20px' }}>{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* 2. ALT KISIM: ANA İÇERİK (Grid yapısı) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '15px' }}>
        
        {/* Sol Taraf: Log Akışı */}
        <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '12px', margin: '0 0 15px 0', textTransform: 'uppercase' }}>Real-time Event Stream</h3>
          <LogStream logs={logs} setLogs={setLogs} running={running} />
        </div>

        {/* Sağ Taraf: Risk Analizi */}
        <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '12px', margin: '0 0 15px 0', textTransform: 'uppercase' }}>Risk Analysis</h3>
          <TrafficChart logs={logs} />
        </div>
      </div>
    </div>
  );
}