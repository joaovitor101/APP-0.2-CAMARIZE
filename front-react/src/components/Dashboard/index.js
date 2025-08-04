import styles from "./Dashboard.module.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import ErrorDisplay from "../ErrorDisplay";

export default function Dashboard() {
  const router = useRouter();
  const { id } = router.query;
  
  const [dadosAtuais, setDadosAtuais] = useState(null);
  const [dadosSemanais, setDadosSemanais] = useState([]);
  const [nomeCativeiro, setNomeCativeiro] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar dados do dashboard
  const buscarDadosDashboard = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await axios.get(`${apiUrl}/parametros/dashboard/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDadosAtuais(response.data.dadosAtuais);
      setDadosSemanais(response.data.dadosSemanais);
      setNomeCativeiro(response.data.cativeiro.nome);
      
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('token');
        // Não redireciona automaticamente, deixa o usuário escolher
      } else {
        setError('Erro ao carregar dados do dashboard.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Busca dados quando o componente monta ou quando o ID muda
  useEffect(() => {
    if (id) {
      buscarDadosDashboard();
    }
  }, [id]);

  // Função auxiliar para formatar valores
  const formatarValor = (valor, casasDecimais = 1, unidade = '') => {
    if (valor === "#" || valor === null || valor === undefined) {
      return "#";
    }
    if (typeof valor === 'number') {
      return `${valor.toFixed(casasDecimais)}${unidade}`;
    }
    return valor;
  };

  // Dados dos sensores baseados nos dados reais
  const sensores = dadosAtuais ? [
    { 
      label: "Temperatura", 
      value: formatarValor(dadosAtuais.temperatura, 1, "°C"), 
      icon: "🌡️", 
      desc: "Temperatura" 
    },
    { 
      label: "Nível de PH", 
      value: formatarValor(dadosAtuais.ph, 1), 
      icon: "🧪", 
      desc: "Nível de PH" 
    },
    { 
      label: "Amônia total", 
      value: formatarValor(dadosAtuais.amonia, 2, " mg/L"), 
      icon: "⚗️", 
      desc: "Amônia total (NH3 e NH4+)" 
    },
    { 
      label: "Amônia não ionizada", 
      value: formatarValor(
        typeof dadosAtuais.amonia === 'number' ? dadosAtuais.amonia * 0.2 : "#", 
        2, 
        " mg/L"
      ), 
      icon: "⚗️", 
      desc: "Amônia não ionizada (NH3)" 
    },
  ] : [];

  // Dados para o gráfico baseados nos dados semanais
  const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  
  // Função para processar dados do gráfico
  const processarDadosGrafico = (dados, valorPadrao) => {
    if (dadosSemanais.length > 0) {
      return dadosSemanais.map(d => {
        const valor = d[dados];
        return valor === "#" || valor === null || valor === undefined ? valorPadrao : valor;
      });
    }
    return [valorPadrao, valorPadrao, valorPadrao, valorPadrao, valorPadrao, valorPadrao, valorPadrao];
  };
  
  const temp = processarDadosGrafico('temperatura', 26);
  const ph = processarDadosGrafico('ph', 7.5);
  const amonia = processarDadosGrafico('amonia', 0.05);

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <img src="/images/logo_camarize1.png" alt="Logo" className={styles.logo} />
        <div style={{ 
          background: 'white', 
          borderRadius: '15px', 
          padding: '40px', 
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#007bff', 
            marginBottom: '15px' 
          }}>
            Carregando dados...
          </div>
          <div style={{ 
            fontSize: '16px', 
            color: '#666', 
            marginBottom: '20px' 
          }}>
            Buscando informações dos sensores
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={buscarDadosDashboard}
        onLogin={() => router.push('/login')}
        showLogin={true}
      />
    );
  }

  return (
    <div className={styles.container}>
      <img src="/images/logo_camarize1.png" alt="Logo" className={styles.logo} />
      <div className={styles.sensoresGrid}>
        {sensores.map((s, i) => (
          <div key={i} className={styles.sensorCard + (i === 0 ? ' ' + styles.selected : '')}>
            <div className={styles.sensorIcon}>{s.icon}</div>
            <div className={styles.sensorValue}>{s.value}</div>
            <div className={styles.sensorDesc}>{s.desc}</div>
          </div>
        ))}
      </div>
      <h3 className={styles.sectionTitle}>
        Últimos Dias - {nomeCativeiro || 'Carregando...'}
      </h3>
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
      <button className={styles.relatorioBtn} onClick={() => router.push(`/rel-individual/${id}`)}>
        Relatório Individual Detalhado
      </button>
      <nav className={styles.navBottom}>
        <button onClick={() => router.push('/home')}><img src="/images/home.svg" alt="Home" /></button>
        <button onClick={() => router.push('/settings')}><img src="/images/settings.svg" alt="Settings" /></button>
        <button onClick={() => router.push('/notifications')}><img src="/images/bell.svg" alt="Notificações" /></button>
        <button onClick={() => router.push('/profile')}><img src="/images/user.svg" alt="Perfil" /></button>
      </nav>
    </div>
  );
}
