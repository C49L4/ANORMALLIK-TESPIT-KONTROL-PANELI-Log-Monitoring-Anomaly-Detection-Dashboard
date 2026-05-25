import { useState } from "react";
import { Search, AlertTriangle, ShieldCheck, Info } from "lucide-react"; // İkonlarımızı import ettik

export default function LogStream({ logs, setLogs, running }) {
  const [filter, setFilter] = useState("ALL"); 
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === "ALL" || (filter === "CRITICAL" && log.risk > 80);
    const matchesSearch = log.user.toLowerCase().includes(search.toLowerCase()) || 
                          log.action.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Risk durumuna göre ikon seçen yardımcı fonksiyon
  const getIcon = (risk) => {
    if (risk > 80) return <AlertTriangle size={14} color="#f43f5e" />;
    if (risk > 50) return <Info size={14} color="#fbbf24" />;
    return <ShieldCheck size={14} color="#10b981" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      
      {/* KONTROL PANELİ */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#050a14', border: '1px solid #1e293b', padding: '0 10px', flex: 1, borderRadius: '4px' }}>
          <Search size={14} color="#94a3b8" />
          <input 
            placeholder="SEARCH_USER_OR_ACTION..." 
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', padding: '8px', color: 'white', outline: 'none', width: '100%', fontSize: '12px' }}
          />
        </div>
        {["ALL", "CRITICAL"].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            style={{ 
              background: filter === f ? '#38bdf8' : 'transparent',
              border: `1px solid ${filter === f ? '#38bdf8' : '#1e293b'}`,
              color: filter === f ? '#000' : '#cbd5e1',
              padding: '6px 16px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              borderRadius: '4px'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* TABLO */}
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
          {filteredLogs.slice(0, 12).map((log) => (
            <tr key={log.id} style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '8px', color: '#94a3b8' }}>{log.time}</td>
              <td style={{ padding: '8px', color: '#f1f5f9' }}>{log.user}</td>
              <td style={{ padding: '8px', color: '#e2e8f0' }}>{log.action}</td>
              <td style={{ padding: '8px', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                {getIcon(log.risk)}
                <span style={{ color: log.risk > 80 ? '#f43f5e' : '#38bdf8' }}>{log.risk}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}