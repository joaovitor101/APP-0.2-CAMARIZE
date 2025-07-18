import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import profileStyles from "../../components/ProfileContent/ProfileContent.module.css";

const mockResumo = `Durante o período de monitoramento do tanque de camarão, foram observadas variações significativas nos parâmetros ambientais essenciais para a saúde e o bem-estar dos crustáceos. A equipe de monitoramento conduziu análises rigorosas e implementou medidas corretivas para garantir um ambiente aquático estável e propício ao crescimento saudável dos camarões.\n\nTemperatura:\nA temperatura média registrada no tanque durante o período de monitoramento foi de 29,75°C. Observou-se uma leve variação diurna, com picos máximos de até 29,5°C durante as horas mais quentes do dia e mínimos de 26°C durante a noite. Essas variações foram mantidas dentro dos limites aceitáveis para as espécies de camarão cultivada, garantindo um ambiente termicamente estável.\n\nNíveis de Amônia:\nOs níveis de amônia foram monitorados de perto, com uma média de 0,25 ppm (partes por milhão) durante o período de observação. Foram observadas pequenas flutuações nos níveis de amônia, principalmente em resposta às atividades de alimentação dos camarões e à decomposição orgânica no tanque. No entanto, medidas de controle eficazes foram implementadas para manter a amônia dentro dos limites seguros, promovendo a saúde dos animais.\n\npH da Água:\nO pH da água foi mantido em um intervalo ideal entre 7,5 e 8,0 ao longo do período de monitoramento. Esta faixa de pH é crucial para garantir um ambiente estável e favorável ao crescimento saudável dos camarões. O uso de tampões naturais e o controle dos valores ótimos foram fundamentais para evitar oscilações abruptas e manter as condições tamponeantes, garantindo a estabilidade do pH do sistema.\n\nConclusão:\nO monitoramento contínuo e a gestão proativa dos parâmetros ambientais são ações fundamentais para manter a saúde e a produtividade do cativeiro de camarão. A equipe de operação é munida continuamente de orientações baseadas em dados e segue as melhores condutas de manejo do ambiente para garantir a eficiência sustentável e o sucesso da operação de criação de camarão.\n\nEste relatório destina-se exclusivamente à equipe de gestão e operação do tanque de camarão e não deve ser reproduzido ou distribuído sem autorização prévia.`;

export default function RelatorioIndividual() {
  const router = useRouter();
  const { id } = router.query;
  const [cativeiro, setCativeiro] = useState(null);
  const relatorioRef = useRef();
  const [periodo, setPeriodo] = useState(null);

  useEffect(() => {
    async function fetchCativeiro() {
      if (!id) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await axios.get(`${apiUrl}/cativeiros/${id}`);
        setCativeiro(res.data);
        console.log('Cativeiro carregado:', res.data);
      } catch (err) {
        setCativeiro(null);
        console.error('Erro ao buscar cativeiro:', err);
      }
    }
    fetchCativeiro();
  }, [id]);

  let fotoUrl = "/images/cativeiro1.jpg";
  if (cativeiro?.foto_cativeiro && Array.isArray(cativeiro.foto_cativeiro.data)) {
    const byteArray = new Uint8Array(cativeiro.foto_cativeiro.data);
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < byteArray.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, byteArray.subarray(i, i + chunkSize));
    }
    const base64String = btoa(binary);
    fotoUrl = `data:image/jpeg;base64,${base64String}`;
  } else if (cativeiro?.foto_cativeiro && cativeiro.foto_cativeiro.data) {
    // Se não for array, logar para debug
    console.warn('foto_cativeiro.data não é array:', cativeiro.foto_cativeiro.data);
  }

  if (!periodo) {
    return (
      <div style={{ maxWidth: 400, margin: '80px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display:'flex',flexDirection:'column',gap:16,alignItems:'center', position: 'relative' }}>
        <button className={profileStyles.backBtn} onClick={() => window.history.back()} style={{ position: 'absolute', top: 16, left: 16 }}>
          <span style={{ fontSize: 24, lineHeight: 1 }}>&larr;</span>
        </button>
        <span style={{fontWeight:600,fontSize:18}}>Selecione o período do relatório</span>
        <button onClick={()=>setPeriodo('dia')} style={{padding:'8px 18px',borderRadius:6,border:'none',background:'#1976d2',color:'#fff',fontWeight:600,cursor:'pointer',width:'100%'}}>Dia</button>
        <button onClick={()=>setPeriodo('semana')} style={{padding:'8px 18px',borderRadius:6,border:'none',background:'#1976d2',color:'#fff',fontWeight:600,cursor:'pointer',width:'100%'}}>Semana</button>
        <button onClick={()=>setPeriodo('mes')} style={{padding:'8px 18px',borderRadius:6,border:'none',background:'#1976d2',color:'#fff',fontWeight:600,cursor:'pointer',width:'100%'}}>Mês</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = async () => {
    if (typeof window !== 'undefined') {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin:       [0.5, 0.5, 1, 0.5],
        filename:     `relatorio-cativeiro-${id}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
      };
      html2pdf().set(opt).from(relatorioRef.current).save();
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'relative' }}>
      <button className={profileStyles.backBtn} onClick={() => window.history.back()} style={{ position: 'absolute', top: 16, left: 16 }}>
        <span style={{ fontSize: 24, lineHeight: 1 }}>&larr;</span>
      </button>
      <div ref={relatorioRef}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
          <img src="/images/logo_camarize1.png" alt="Camarize Logo" style={{ height: 48, marginBottom: 8 }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, textAlign: 'center' }}>RELATÓRIO INDIVIDUAL DETALHADO</h2>
        </div>
        <h3 style={{ textAlign: 'center', margin: '24px 0 8px 0' }}>{cativeiro?.nome || `Tanque ${id}`}</h3>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
          <img src={fotoUrl} alt="Tanque" style={{ width: 320, height: 200, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
        </div>
        <p style={{ textAlign: 'center', marginBottom: 24 }}>
          Período de Monitoramento: 1 de junho de 2024 a 7 de junho de 2024
        </p>
        <div style={{ whiteSpace: 'pre-line', fontSize: 15, marginBottom: 32, pageBreakInside: 'avoid' }}>
          {mockResumo}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button onClick={handlePrint} style={{ padding: '8px 18px', borderRadius: 6, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
          Imprimir
        </button>
        <button onClick={handleSavePDF} style={{ padding: '8px 18px', borderRadius: 6, border: 'none', background: '#43a047', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
          Salvar como PDF
        </button>
      </div>
    </div>
  );
} 