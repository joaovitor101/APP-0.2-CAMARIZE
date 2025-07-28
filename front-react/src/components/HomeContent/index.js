import { useRouter } from "next/router";
import styles from "./HomeContent.module.css";
import NavBottom from "../NavBottom";
import { useEffect, useState } from "react";
import axios from "axios";

// const cativeirosMock = [
//   {
//     id: 1,
//     nome: "Cativeiro 1",
//     cultivo: "Cultivo de: Caridea",
//     imagem: "/images/cativeiro1.jpg"
//   },
//   {
//     id: 2,
//     nome: "Cativeiro 2",
//     cultivo: "Cultivo de: Caridea",
//     imagem: "/images/cativeiro2.jpg"
//   },
//   {
//     id: 3,
//     nome: "Cativeiro 3",
//     cultivo: "Cultivo de: Caridea",
//     imagem: "/images/cativeiro3.jpg"
//   },
//   {
//     id: 4,
//     nome: "Cativeiro 4",
//     cultivo: "Cultivo de: Caridea",
//     imagem: "/images/cativeiro4.jpg"
//   },
//   {
//     id: 5,
//     nome: "Cativeiro 5",
//     cultivo: "Cultivo de: Caridea",
//     imagem: "/images/cativeiro5.jpg"
//   },
//   {
//     id: 6,
//     nome: "Cativeiro 6",
//     cultivo: "Ilha Cultivo de: Caridea - SP",
//     imagem: "/images/cativeiro6.jpg"
//   },
// ];

export default function HomeContent() {
  const router = useRouter();
  const [cativeiros, setCativeiros] = useState([]);
  const [showPeriodoModal, setShowPeriodoModal] = useState(false);

  useEffect(() => {
    async function fetchCativeiros() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await axios.get(`${apiUrl}/cativeiros`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setCativeiros(res.data);
      } catch (err) {
        setCativeiros([]);
      }
    }
    fetchCativeiros();
  }, []);

  const handleCativeiroClick = (id) => {
    router.push(`/dashboard?id=${id}`);
  };

  const handleEditCativeiro = (e, id) => {
    e.stopPropagation();
    router.push(`/edit-cativeiro?id=${id}`);
  };

  const handleDeleteCativeiro = async (e, id) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir este cativeiro?')) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        await axios.delete(`${apiUrl}/cativeiros/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        // Recarregar a lista de cativeiros
        const res = await axios.get(`${apiUrl}/cativeiros`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setCativeiros(res.data);
      } catch (err) {
        console.error('Erro ao deletar cativeiro:', err);
        alert('Erro ao deletar cativeiro');
      }
    }
  };

  const handleDownloadClick = () => {
    setShowPeriodoModal(true);
  };
  const handlePeriodoSelect = (periodo) => {
    setShowPeriodoModal(false);
    router.push(`/rel-geral?periodo=${periodo}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/images/logo_camarize1.png" alt="Logo" style={{ height: 24 }} />

        <div className={styles.iconGroup}>
          <button className={styles.iconBtn} aria-label="Sensor" onClick={() => router.push('/sensores')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="7" y="7" width="10" height="10" rx="2" fill="#000"/>
              <rect x="9" y="9" width="6" height="6" rx="1" fill="#fff"/>
              <rect x="2" y="11" width="3" height="2" rx="1" fill="#000"/>
              <rect x="19" y="11" width="3" height="2" rx="1" fill="#000"/>
              <rect x="11" y="2" width="2" height="3" rx="1" fill="#000"/>
              <rect x="11" y="19" width="2" height="3" rx="1" fill="#000"/>
              <rect x="4.22" y="4.22" width="2" height="3" rx="1" transform="rotate(-45 4.22 4.22)" fill="#000"/>
              <rect x="17.78" y="16.78" width="2" height="3" rx="1" transform="rotate(-45 17.78 16.78)" fill="#000"/>
              <rect x="4.22" y="16.78" width="2" height="3" rx="1" transform="rotate(45 4.22 16.78)" fill="#000"/>
              <rect x="17.78" y="4.22" width="2" height="3" rx="1" transform="rotate(45 17.78 4.22)" fill="#000"/>
            </svg>
          </button>
          <button
            className={styles.iconBtn}
            aria-label="Cadastrar Cativeiro"
            onClick={() => router.push('/create-cativeiros')}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" stroke="#222" strokeWidth="2"/><path d="M12 8v8M8 12h8" stroke="#222" strokeWidth="2"/></svg>
          </button>
          <button className={styles.iconBtn} aria-label="Download" onClick={handleDownloadClick}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 4v12m0 0l-4-4m4 4l4-4" stroke="#222" strokeWidth="2"/><rect x="4" y="18" width="16" height="2" rx="1" fill="#222"/></svg>
          </button>
        </div>
      </div>
      <div className={styles.cativeiroList}>
        {cativeiros.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyMessage}>Sem cativeiros cadastrados</div>
          </div>
        ) : (
          cativeiros.map((cativeiro, idx) => {
            // Converter buffer para base64 se existir
            let fotoUrl = "/images/cativeiro1.jpg";
            if (cativeiro.foto_cativeiro && cativeiro.foto_cativeiro.data) {
              const base64String = Buffer.from(cativeiro.foto_cativeiro.data).toString('base64');
              fotoUrl = `data:image/jpeg;base64,${base64String}`;
            }
            return (
              <div
                key={cativeiro._id}
                className={styles.cativeiroItem}
                style={{ cursor: "pointer" }}
                onClick={() => handleCativeiroClick(cativeiro._id)}
              >
                <img
                  src={fotoUrl}
                  alt={`Cativeiro ${idx + 1}`}
                  className={styles.cativeiroImg}
                />
                              <div className={styles.cativeiroInfo}>
                <div className={styles.cativeiroNome}>{`Cativeiro ${idx + 1}`}</div>
                <div className={styles.cativeiroCultivo}>{
                  (typeof cativeiro.id_tipo_camarao === 'object' && cativeiro.id_tipo_camarao?.nome)
                    ? cativeiro.id_tipo_camarao.nome
                    : (cativeiro.id_tipo_camarao || 'Tipo não informado')
                }</div>
              </div>
              <div className={styles.cativeiroActions}>
                <button 
                  className={styles.actionBtn} 
                  onClick={(e) => handleEditCativeiro(e, cativeiro._id)}
                  title="Editar"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path d="M15.232 5.232a3 3 0 1 1 4.243 4.243L7.5 21H3v-4.5l12.232-12.268Z" stroke="#7ecbff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button 
                  className={styles.actionBtn} 
                  onClick={(e) => handleDeleteCativeiro(e, cativeiro._id)}
                  title="Excluir"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path d="M3 6h18M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              </div>
            );
          })
        )}
      </div>
      <NavBottom />
      {showPeriodoModal && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'#fff',padding:24,borderRadius:8,minWidth:260,boxShadow:'0 2px 8px rgba(0,0,0,0.15)',display:'flex',flexDirection:'column',gap:16,alignItems:'center'}}>
            <span style={{fontWeight:600,fontSize:18}}>Selecione o período do relatório</span>
            <button onClick={()=>handlePeriodoSelect('dia')} style={{padding:'8px 18px',borderRadius:6,border:'none',background:'#1976d2',color:'#fff',fontWeight:600,cursor:'pointer',width:'100%'}}>Dia</button>
            <button onClick={()=>handlePeriodoSelect('semana')} style={{padding:'8px 18px',borderRadius:6,border:'none',background:'#1976d2',color:'#fff',fontWeight:600,cursor:'pointer',width:'100%'}}>Semana</button>
            <button onClick={()=>handlePeriodoSelect('mes')} style={{padding:'8px 18px',borderRadius:6,border:'none',background:'#1976d2',color:'#fff',fontWeight:600,cursor:'pointer',width:'100%'}}>Mês</button>
            <button onClick={()=>setShowPeriodoModal(false)} style={{padding:'4px 12px',borderRadius:6,border:'none',background:'#eee',color:'#222',fontWeight:600,cursor:'pointer',width:'100%'}}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}