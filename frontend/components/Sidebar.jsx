import logo from '../assets/logo.png';

export default function Sidebar({ active, setActive }) {
  const menu = [
    { id: "dashboard", label: "GÖSTERGE PANELİ" },
    { id: "incidents", label: "OLAYLAR" },
    { id: "analytics", label: "ANALİZ" }
  ];

  return (
    <div style={{ 
      width: 250, 
      height: "100vh", // Tüm ekranı kaplaması için
      background: "#0f172a", 
      paddingTop: "10px", // Üstten boşluğu azalttık
      display: "flex", 
      flexDirection: "column",
      borderRight: "1px solid #1e293b" 
    }}>
      
      {/* LOGO ALANI - Köşeye ve üst tarafa daha yakın */}
      <div style={{ marginBottom: "20px", padding: "0 10px" }}>
        <img 
          src={logo} 
          alt="Siber Göz" 
          style={{ 
            width: "100%", 
            display: "block", 
            borderBottom: "1px solid #1e293b", // Altına ince bir çizgi ekledik
            paddingBottom: "20px" 
          }} 
        />
      </div>

      {/* MENÜ ALANI */}
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", padding: "0 15px" }}>
        {menu.map(item => (
          <div
            key={item.id}
            onClick={() => setActive(item.id)}
            style={{
              padding: "12px 15px",
              cursor: "pointer",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: active === item.id ? "#38bdf8" : "#94a3b8",
              background: active === item.id ? "rgba(56, 189, 248, 0.1)" : "transparent",
              transition: "all 0.2s ease"
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}