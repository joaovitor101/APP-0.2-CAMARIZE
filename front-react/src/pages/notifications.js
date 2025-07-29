import React from "react";
import NavBottom from "../components/NavBottom";

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
      background: '#fff',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '80px' // Espaço para o NavBottom
    }}>
      <div style={{ 
        maxWidth: 600, 
        margin: '0 auto', 
        padding: '24px 16px', 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <button 
            style={{ 
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', 
              border: 'none', 
              fontSize: 24, 
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              zIndex: 1
            }} 
            onClick={() => window.history.back()}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(0,0,0,0.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
            title="Voltar"
          >
            &larr;
          </button>
          <h2 style={{ textAlign: 'center', margin: 0, fontWeight: 600, fontSize: '1.35rem', padding: '8px 0' }}>Notificações</h2>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0 24px 0' }}>
          <button style={{
            background: '#f5f5f5',
            border: 'none',
            borderRadius: 16,
            padding: '8px 24px',
            fontWeight: 600,
            fontSize: 16,
            color: '#333',
            cursor: 'default'
          }}>Hoje</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mockNotifications.map((n, i) => (
            <div key={i} style={{
              display: 'flex', 
              alignItems: 'center', 
              background: '#fff', 
              borderRadius: 12,
              border: '1px solid #eee',
              padding: 16, 
              gap: 16,
              transition: 'box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.boxShadow = 'none';
            }}
            >
              <div style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 8, 
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                {n.icon.includes('temp') ? '🌡️' : n.icon.includes('amonia') ? '⚗️' : '🧪'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: '#333' }}>{n.title}</div>
                <div style={{ color: '#888', fontSize: 14, marginTop: 2 }}>{n.tank}</div>
              </div>
              <div style={{ color: '#888', fontWeight: 500, fontSize: 14 }}>{n.time}</div>
            </div>
          ))}
        </div>
        
        {mockNotifications.length === 0 && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '48px 24px',
            color: '#888',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
            <div style={{ fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>Nenhuma notificação</div>
            <div style={{ fontSize: '14px' }}>Você está em dia com suas notificações</div>
          </div>
        )}
      </div>
      
      <NavBottom />
    </div>
  );
} 