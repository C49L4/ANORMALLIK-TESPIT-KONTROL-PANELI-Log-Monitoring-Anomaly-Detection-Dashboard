import AnomalyFeed from "../components/AnomalyFeed";

export default function Analytics({ logs }) {
  return (
    <div style={{ padding: "10px" }}>
      <h2 style={{ marginBottom: "20px" }}>Security Analytics</h2>
      
      <div className="card">
        <AnomalyFeed logs={logs} />
      </div>
    </div>
  );
}