import React from "react";

const mockNotifications = [
  {
    icon: "/images/temp-icon.png",
    title: "Aumento na temperatura!",
    tank: "Tanque 1",
    time: "14:10"
  },
  {
    icon: "/images/amonia-icon.png",
    title: "Nível de amônia baixo!",
    tank: "Tanque 1",
    time: "05:20"
  },
  {
    icon: "/images/ph-icon.png",
    title: "O pH da água está baixo!",
    tank: "Tanque 1",
    time: "01:35"
  }
];

export default function NotificationsPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #B8D8F8 0%, #E2C6F7 100%)',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ maxWidth: 400, margin: '0 auto', padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <button
          style={{
            background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', marginBottom: 8
          }}
          onClick={() => window.history.back()}
        >
          &#8592;
        </button>
        <h1 style={{ textAlign: 'center', fontWeight: 600, fontSize: 32, margin: 0 }}>Notificações</h1>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0 24px 0' }}>
          <button style={{
            background: '#fff',
            border: 'none',
            borderRadius: 16,
            padding: '4px 28px',
            fontWeight: 600,
            fontSize: 18,
            color: '#888',
            boxShadow: '0 1px 4px #0001',
            cursor: 'default'
          }}>Hoje</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {mockNotifications.map((n, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 14,
              boxShadow: '0 1px 4px #0001', padding: 16, gap: 16
            }}>
              <img src={n.icon} alt="icon" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{n.title}</div>
                <div style={{ color: '#888', fontSize: 13 }}>{n.tank}</div>
              </div>
              <div style={{ color: '#888', fontWeight: 500, fontSize: 15 }}>{n.time}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '32px 0 16px 0' }}>
        <img src="/images/logo_camarize1.png" alt="Camarize Logo" style={{ width: 180, height: 40 }} />
      </div>
    </div>
  );
} 