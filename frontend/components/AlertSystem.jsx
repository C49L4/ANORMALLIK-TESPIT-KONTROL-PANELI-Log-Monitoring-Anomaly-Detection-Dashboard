import { useEffect, useState } from "react";

export default function AlertSystem({ logs, setIncidents }) {
  const [seen, setSeen] = useState([]);

  useEffect(() => {
    const latest = logs[0];
    if (!latest) return;

    if (latest.risk > 90 && !seen.includes(latest.id)) {
      setSeen(prev => [...prev, latest.id]);

      setIncidents(prev => [
        {
          ...latest,
          status: "OPEN",
          severity: "CRITICAL",
          createdAt: Date.now()
        },
        ...prev
      ]);
    }
  }, [logs]);

  return null;
}