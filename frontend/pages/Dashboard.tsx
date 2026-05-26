import LogStream from "../components/LogStream";
import TrafficChart from "../components/TrafficChart";

export default function Dashboard(props: any) {
  const {
    logs,
    chartLogs,
    stats,
    loading,
    page,
    pageSize,
    totalLogs,
    onPageChange,
    onPageSizeChange,
    search,
    setSearch,
    severity,
    setSeverity
  } = props;

  const totalCount = stats?.total_logs ?? totalLogs;
  const criticalCount = stats?.severity_counts?.critical ?? logs.filter((l: any) => {
    const risk = typeof l.risk_score === 'number' ? l.risk_score : typeof l.risk === 'number' ? l.risk : (l.Severity || '').toLowerCase() === 'critical' ? 90 : 0;
    return risk > 70;
  }).length;
  const avgRisk = logs.length > 0 ? (logs.reduce((a: number, b: any) => a + (typeof b.risk_score === 'number' ? b.risk_score : (typeof b.risk === 'number' ? b.risk : 0)), 0) / logs.length).toFixed(1) : 0;

  const kpiCards = [
    { label: "TOPLAM LOG", value: totalCount, color: "#38bdf8" },
    { label: "KRİTİK OLAYLAR", value: criticalCount, color: "#f43f5e" },
    { label: "ORTALAMA RİSK", value: `${avgRisk}%`, color: "#fbbf24" },
    { label: "SİSTEM DURUMU", value: "OPERATIONAL", color: "#10b981" }
  ];

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
        {kpiCards.map((stat, i) => (
          <div key={i} style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <p style={{ color: '#94a3b8', fontSize: '10px', margin: '0 0 5px 0', textTransform: 'uppercase' }}>{stat.label}</p>
            <h2 style={{ color: stat.color, margin: 0, fontSize: '20px' }}>{stat.value}</h2>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '15px' }}>
        <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
            <div style={{ flex: '1 1 240px', minWidth: 240 }}>
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); onPageChange(1); }}
                placeholder="Search user, action, source..."
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #1e293b', background: '#020617', color: '#f8fafc' }}
              />
            </div>
            <div>
              <select
                value={severity}
                onChange={(e) => { setSeverity(e.target.value); onPageChange(1); }}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #1e293b', background: '#020617', color: '#f8fafc' }}
              >
                <option value="ALL">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #1e293b', background: '#14213d', color: '#f8fafc', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >
                Prev
              </button>
              <span style={{ color: '#cbd5e1' }}>Page {page} / {totalPages}</span>
              <button
                type="button"
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #1e293b', background: '#14213d', color: '#f8fafc', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
            <div>
              <select
                value={pageSize}
                onChange={(e) => { onPageSizeChange(parseInt(e.target.value, 10)); onPageChange(1); }}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #1e293b', background: '#020617', color: '#f8fafc' }}
              >
                <option value={50}>50 rows</option>
                <option value={100}>100 rows</option>
              </select>
            </div>
          </div>

          <h3 style={{ color: '#38bdf8', fontSize: '12px', margin: '0 0 15px 0', textTransform: 'uppercase' }}>Real-time Event Stream</h3>
          <LogStream logs={logs} loading={loading} />
        </div>

        <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '12px', margin: '0 0 15px 0', textTransform: 'uppercase' }}>Risk Analysis</h3>
          <TrafficChart logs={chartLogs} />
        </div>
      </div>
    </div>
  );
}
