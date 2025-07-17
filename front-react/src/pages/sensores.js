import { useEffect, useState } from 'react';
import SensorList from '../components/SensorList';
import styles from '../components/SensorList/SensorList.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function SensoresPage() {
  const [sensores, setSensores] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchSensores() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await axios.get(`${apiUrl}/sensores`);
        setSensores(res.data);
      } catch (err) {
        setSensores([]);
      }
    }
    fetchSensores();
  }, []);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 600, padding: '16px 32px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <button style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }} onClick={() => window.history.back()}>&larr;</button>
          <h2 style={{ flex: 1, textAlign: 'center', margin: 0, fontWeight: 600 }}>Sistema</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <span style={{ fontWeight: 600, fontSize: '1.08rem' }}>Sensores</span>
          <div style={{ flex: 1 }} />
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Ordenar">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M3 18h6M3 6h18M3 12h12" stroke="#222" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Filtrar">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707l-6.414 6.414A1 1 0 0 0 13 13.414V19a1 1 0 0 1-1.447.894l-4-2A1 1 0 0 1 7 17v-3.586a1 1 0 0 0-.293-.707L3.293 6.707A1 1 0 0 1 3 6V4Z" stroke="#222" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Cadastrar Sensor" onClick={() => router.push('/create-sensores')}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" stroke="#222" strokeWidth="2"/><path d="M12 8v8M8 12h8" stroke="#222" strokeWidth="2"/></svg>
          </button>
        </div>
        <SensorList sensores={sensores} />
      </div>
    </div>
  );
} 