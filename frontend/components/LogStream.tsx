import { ShieldCheck, AlertTriangle, Info } from "lucide-react";

export default function LogStream({ logs, loading }: { logs: any[]; loading: boolean }) {
  const getIcon = (risk: number) => {
    if (risk > 80) return <AlertTriangle size={14} color="#f43f5e" />;
    if (risk > 50) return <Info size={14} color="#fbbf24" />;
    return <ShieldCheck size={14} color="#10b981" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {loading ? (
        <div style={{ color: '#94a3b8', padding: '10px' }}>Loading logs...</div>
      ) : logs.length === 0 ? (
        <div style={{ color: '#94a3b8', padding: '10px' }}>No logs available for this page.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ color: '#64748b', borderBottom: '1px solid #1e293b' }}>
              <th style={{ padding: '8px' }}>TIME</th>
              <th style={{ padding: '8px' }}>USER</th>
              <th style={{ padding: '8px' }}>ACTION</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>RISK</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: any) => {
              const riskValue = typeof log.risk_score === 'number' ? log.risk_score : (log.Severity === 'Critical' ? 100 : log.Severity === 'High' ? 75 : log.Severity === 'Medium' ? 50 : 20);
              return (
                <tr key={log.id || `${log.user}-${log.time}` } style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '8px', color: '#94a3b8' }}>{log.time || log.timestamp}</td>
                  <td style={{ padding: '8px', color: '#f1f5f9' }}>{log.user || log.Source || 'unknown'}</td>
                  <td style={{ padding: '8px', color: '#e2e8f0' }}>{log.action || log.Anomaly_Type || 'N/A'}</td>
                  <td style={{ padding: '8px', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                    {getIcon(riskValue)}
                    <span style={{ color: riskValue > 80 ? '#f43f5e' : '#38bdf8' }}>{riskValue}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
