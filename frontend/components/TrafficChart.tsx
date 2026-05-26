import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const normalizeRisk = (log: any): number => {
  if (typeof log.risk_score === 'number') return log.risk_score;
  if (typeof log.risk === 'number') return log.risk;
  if (typeof log.Severity === 'string') {
    const severity = log.Severity.toLowerCase();
    if (severity === 'critical') return 95;
    if (severity === 'high') return 75;
    if (severity === 'medium') return 50;
    if (severity === 'low') return 25;
  }
  return 0;
};

export default function TrafficChart({ logs }: { logs: any[] }) {
  const data = logs.slice(0, 100).reverse().map((log: any, i: number) => ({
    index: i,
    risk: normalizeRisk(log),
    time: log.time || log.timestamp || `#${i}`,
    action: log.action || log.Anomaly_Type
  }));

  const avgRisk = data.length > 0 ? Math.round(data.reduce((sum: number, d: any) => sum + d.risk, 0) / data.length) : 0;
  const maxRisk = data.length > 0 ? Math.max(...data.map((d: any) => d.risk)) : 0;
  const lastRisk = data[data.length - 1]?.risk || 0;

  const getTrafficState = () => {
    if (avgRisk > 80) return "CRITICAL";
    if (avgRisk > 60) return "HIGH";
    if (avgRisk > 40) return "MEDIUM";
    return "STABLE";
  };

  const getColor = (risk: number) => {
    if (risk > 80) return "#ef4444";
    if (risk > 50) return "#fbbf24";
    return "#38bdf8";
  };

  return (
    <div style={{ padding: "5px" }}>
      <h2 style={{ color: "#38bdf8", fontSize: "16px", margin: "0 0 5px 0" }}>Traffic Risk Analysis</h2>
      <div style={{ fontSize: 11, opacity: 0.7, marginBottom: "10px" }}>
        Avg Risk: <b>{avgRisk}</b> | Max: <b>{maxRisk}</b>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <span style={{
          fontSize: 10,
          padding: "3px 8px",
          borderRadius: 4,
          fontWeight: 'bold',
          background: getTrafficState() === "CRITICAL" ? "#7f1d1d" : 
                      getTrafficState() === "HIGH" ? "#b91c1c" : 
                      getTrafficState() === "MEDIUM" ? "#f59e0b" : "#22c55e",
          color: "white"
        }}>
          {getTrafficState()} TRAFFIC
        </span>
      </div>

      {avgRisk > 70 && (
        <div style={{ color: "#f87171", fontSize: 11, marginBottom: "10px", display: "flex", alignItems: "center", gap: "5px" }}>
          ⚠ High risk activity detected
        </div>
      )}

      {data.length === 0 ? (
        <div style={{ color: '#cbd5e1', fontSize: 12, padding: '20px', background: '#08131f', borderRadius: 8, textAlign: 'center' }}>
          No chart data available yet.
        </div>
      ) : (
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 10 }} interval="preserveStartEnd" minTickGap={20} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 100]} />
              <Tooltip
                formatter={(value) => [value, 'Risk']}
                labelFormatter={(label) => `Point ${label}`}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="risk" stroke={getColor(lastRisk)} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
