import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function TrafficChart({ logs }) {
  const data = logs.slice(0, 30).reverse().map((log, i) => ({
    index: i,
    risk: log.risk,
    time: log.time,
    action: log.action
  }));

  const avgRisk = data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.risk, 0) / data.length) : 0;
  const maxRisk = data.length > 0 ? Math.max(...data.map(d => d.risk)) : 0;
  const lastRisk = data[data.length - 1]?.risk || 0;

  const getTrafficState = () => {
    if (avgRisk > 80) return "CRITICAL";
    if (avgRisk > 60) return "HIGH";
    if (avgRisk > 40) return "MEDIUM";
    return "STABLE";
  };

  const getColor = (risk) => {
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
          fontSize: 10, padding: "3px 8px", borderRadius: 4, fontWeight: "bold",
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

      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="index" hide />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', fontSize: '12px' }}
            />
            <Line type="monotone" dataKey="risk" stroke={getColor(lastRisk)} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}