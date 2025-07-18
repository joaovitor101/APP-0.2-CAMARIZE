import styles from "./Dashboard.module.css";
import { useRouter } from "next/router";

const sensoresMock = [
  { label: "Temperatura", value: "26°C", icon: "🌡️", desc: "Temperatura" },
  { label: "Nível de PH", value: "7.5", icon: "🧪", desc: "Nível de PH" },
  { label: "Amônia total", value: "0,05 mg/L", icon: "⚗️", desc: "Amônia total (NH3 e NH4+)" },
  { label: "Amônia não ionizada", value: "0,01 mg/L", icon: "⚗️", desc: "Amônia não ionizada (NH3)" },
];

const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const temp = [26, 26, 27, 26, 25, 26, 26];
const ph = [7.5, 7.4, 7.6, 7.5, 7.5, 7.4, 7.5];
const amonia = [0.05, 0.05, 0.06, 0.05, 0.05, 0.05, 0.05];

export default function Dashboard() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div className={styles.container}>
      <img src="/images/logo_camarize1.png" alt="Logo" className={styles.logo} />
      <div className={styles.sensoresGrid}>
        {sensoresMock.map((s, i) => (
          <div key={i} className={styles.sensorCard + (i === 0 ? ' ' + styles.selected : '')}>
            <div className={styles.sensorIcon}>{s.icon}</div>
            <div className={styles.sensorValue}>{s.value}</div>
            <div className={styles.sensorDesc}>{s.desc}</div>
          </div>
        ))}
      </div>
      <h3 className={styles.sectionTitle}>Últimos Dias - Cativeiro 1</h3>
      <div className={styles.graficoBox}>
        <span className={styles.graficoTitle}>Dados Semanais</span>
        <svg width="100%" height="120" viewBox="0 0 300 120">
          {/* Temperatura */}
          <polyline fill="none" stroke="#ff7b9c" strokeWidth="3"
            points={temp.map((v, i) => `${i * 50 + 20},${110 - v * 3}`).join(" ")} />
          {/* PH */}
          <polyline fill="none" stroke="#7bcfff" strokeWidth="3"
            points={ph.map((v, i) => `${i * 50 + 20},${110 - v * 10}`).join(" ")} />
          {/* Amônia */}
          <polyline fill="none" stroke="#7be6c3" strokeWidth="3"
            points={amonia.map((v, i) => `${i * 50 + 20},${110 - v * 300}`).join(" ")} />
          {/* Pontos e labels */}
          {dias.map((d, i) => (
            <text key={d} x={i * 50 + 20} y={115} fontSize="12" textAnchor="middle">{d}</text>
          ))}
        </svg>
        <div className={styles.legenda}>
          <span style={{ color: "#ff7b9c" }}>■ Temperatura</span>
          <span style={{ color: "#7bcfff" }}>■ pH</span>
          <span style={{ color: "#7be6c3" }}>■ Amônia</span>
        </div>
      </div>
      <button className={styles.relatorioBtn} onClick={() => router.push(`/rel-individual/${id}`)}>Relatório Individual Detalhado</button>
      {/* Removido botão de adicionar (plus) desktop */}
      {/* <button className={styles.addDesktopBtn} onClick={() => router.push('/create-cativeiros')}>
        <img src="/images/plus.svg" alt="Adicionar" />
      </button> */}
      <nav className={styles.navBottom}>
        <button onClick={() => router.push('/home')}><img src="/images/home.svg" alt="Home" /></button>
        <button onClick={() => router.push('/settings')}><img src="/images/settings.svg" alt="Settings" /></button>
        {/* Removido botão flutuante de adicionar (plus) */}
        {/* <button ...>
          <img src="/images/plus.svg" alt="Adicionar" ... />
        </button> */}
        <button onClick={() => router.push('/notifications')}><img src="/images/bell.svg" alt="Notificações" /></button>
        <button onClick={() => router.push('/profile')}><img src="/images/user.svg" alt="Perfil" /></button>
      </nav>
    </div>
  );
}
