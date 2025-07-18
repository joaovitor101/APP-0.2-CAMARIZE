import styles from './SensorList.module.css';

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export default function SensorList({ sensores = [] }) {
  return (
    <div className={styles.container}>
      {sensores.map((sensor, idx) => {
        // Converter buffer para base64 se existir
        let fotoUrl = '/images/logo_camarize1.png';
        if (sensor.foto_sensor && sensor.foto_sensor.data) {
          const base64String = arrayBufferToBase64(sensor.foto_sensor.data);
          fotoUrl = `data:image/jpeg;base64,${base64String}`;
        }
        return (
          <div className={styles.sensorCard} key={sensor._id || idx}>
            <div className={styles.gradientBar} />
            <div className={styles.icon}>
              <img src={fotoUrl} alt={sensor.id_tipo_sensor} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
            </div>
            <div className={styles.info}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <span className={styles.nome}>{sensor.id_tipo_sensor || 'Sensor'}</span>
                <span style={{ color: '#888', fontSize: '0.98rem', fontWeight: 500 }}>|</span>
                <span className={styles.apelido}>{sensor.apelido || '-'}</span>
              </div>
              <div className={styles.numero}>{`#${String(idx + 1).padStart(3, '0')}`}</div>
            </div>
            <div className={styles.actions}>
              <button className={`${styles.actionBtn} ${styles.edit}`} title="Editar">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M15.232 5.232a3 3 0 1 1 4.243 4.243L7.5 21H3v-4.5l12.232-12.268Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className={`${styles.actionBtn} ${styles.delete}`} title="Deletar">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
} 