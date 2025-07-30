import { useRouter } from "next/router";
import styles from "./HomeContent.module.css";
import NavBottom from "../NavBottom";
import AuthError from "../AuthError";
import Loading from "../Loading";
import { useEffect, useState } from "react";
import axios from "axios";
import Notification from "../Notification";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPeriodoModal, setShowPeriodoModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [cativeiroToDelete, setCativeiroToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const hideNotification = () => {
    setNotification({ show: false, message: '', type: 'success' });
  };

  useEffect(() => {
    async function fetchCativeiros() {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        
        if (!token) {
          setError('Você precisa estar logado para acessar esta página');
          setLoading(false);
          return;
        }
        
        const res = await axios.get(`${apiUrl}/cativeiros`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCativeiros(res.data);
      } catch (err) {
        console.error('Erro ao buscar cativeiros:', err);
        if (err.response?.status === 401) {
          setError('Sessão expirada. Faça login novamente para continuar.');
        } else {
          setError('Erro ao carregar os dados. Tente novamente.');
        }
        setCativeiros([]);
      } finally {
        setLoading(false);
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
    setCativeiroToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!cativeiroToDelete) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await axios.delete(`${apiUrl}/cativeiros/${cativeiroToDelete}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      // Recarregar a lista de cativeiros
      const res = await axios.get(`${apiUrl}/cativeiros`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setCativeiros(res.data);
      setShowDeleteModal(false);
      setCativeiroToDelete(null);
      showNotification('Cativeiro excluído com sucesso!', 'success');
    } catch (err) {
      console.error('Erro ao deletar cativeiro:', err);
      showNotification('Erro ao excluir cativeiro', 'error');
      setShowDeleteModal(false);
      setCativeiroToDelete(null);
    }
  };

  const handleDownloadClick = () => {
    setShowPeriodoModal(true);
  };
  const handlePeriodoSelect = (periodo) => {
    setShowPeriodoModal(false);
    router.push(`/rel-geral?periodo=${periodo}`);
  };

  // Se há erro, mostrar tela de erro
  if (error) {
    return <AuthError error={error} onRetry={() => window.location.reload()} />;
  }

  // Se está carregando, mostrar loading
  if (loading) {
    return <Loading message="Carregando..." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className={styles.iconBtn} 
            aria-label="Informações sobre a aplicação"
            onClick={() => setShowInfoModal(true)}
            style={{ padding: '4px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="2" fill="none"/>
              <path d="M12 16V12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="8" r="1" fill="#3B82F6"/>
            </svg>
          </button>
          <img src="/images/logo_camarize1.png" alt="Logo" style={{ height: 24 }} />
        </div>

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
                <div className={styles.cativeiroNome}>{cativeiro.nome || `Cativeiro ${idx + 1}`}</div>
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
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#fff',
            padding: '32px 24px',
            borderRadius: '16px',
            minWidth: '320px',
            maxWidth: '90vw',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            {/* Ícone de aviso */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* Título */}
            <div style={{
              fontWeight: '700',
              fontSize: '20px',
              color: '#1f2937',
              lineHeight: '1.2'
            }}>
              Confirmar Exclusão
            </div>
            
            {/* Mensagem */}
            <p style={{
              margin: '0',
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '1.5',
              maxWidth: '280px'
            }}>
              Tem certeza que deseja excluir este cativeiro? Esta ação não pode ser desfeita.
            </p>
            
            {/* Botões */}
            <div style={{
              display: 'flex',
              gap: '12px',
              width: '100%',
              marginTop: '8px'
            }}>
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setCativeiroToDelete(null);
                }}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  color: '#374151',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  ':hover': {
                    background: '#f9fafb',
                    borderColor: '#9ca3af'
                  }
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#f9fafb';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#fff';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#dc2626',
                  color: '#fff',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#b91c1c';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#dc2626';
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
      {notification.show && (
        <Notification
          isVisible={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      {/* Modal de Informações */}
      {showInfoModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#fff',
            padding: '32px 24px',
            borderRadius: '20px',
            minWidth: '320px',
            maxWidth: '90vw',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            border: '1px solid #e5e7eb'
          }}>
            {/* Header da Modal */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="2" fill="none"/>
                    <path d="M12 16V12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="8" r="1" fill="#3B82F6"/>
                  </svg>
                </div>
                <h2 style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1f2937'
                }}>
                  Sobre o Camarize
                </h2>
              </div>
              <button 
                onClick={() => setShowInfoModal(false)}
                style={{
                  padding: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#f3f4f6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Conteúdo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* O que é o Camarize */}
              <div>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  🦐 O que é o Camarize?
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '15px',
                  lineHeight: '1.6',
                  color: '#4b5563'
                }}>
                  O Camarize é um sistema inteligente de monitoramento para cativeiros de camarão. 
                  Ele ajuda você a acompanhar em tempo real as condições ideais para o cultivo, 
                  garantindo a saúde e produtividade dos seus camarões.
                </p>
              </div>

              {/* Por que monitorar */}
              <div>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  📊 Por que monitorar estes parâmetros?
                </h3>
                <p style={{
                  margin: '0 0 16px 0',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  color: '#4b5563'
                }}>
                  O monitoramento constante destes três parâmetros é essencial para o sucesso 
                  do cultivo de camarões. Qualquer variação pode afetar diretamente a saúde 
                  e o crescimento dos animais.
                </p>
              </div>

              {/* Parâmetros */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Temperatura */}
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: '#fef3c7',
                  border: '1px solid #fde68a'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>🌡️</span>
                    <h4 style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#92400e'
                    }}>
                      Temperatura da Água
                    </h4>
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#92400e'
                  }}>
                    <strong>Por que é importante:</strong> A temperatura afeta diretamente o metabolismo, 
                    crescimento e reprodução dos camarões. Temperaturas inadequadas podem causar 
                    estresse, doenças e até mortalidade.
                  </p>
                </div>

                {/* pH */}
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: '#dbeafe',
                  border: '1px solid #93c5fd'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>🧪</span>
                    <h4 style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1e40af'
                    }}>
                      pH da Água
                    </h4>
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#1e40af'
                  }}>
                    <strong>Por que é importante:</strong> O pH influencia a disponibilidade de 
                    nutrientes, a toxicidade de substâncias e o bem-estar dos camarões. 
                    Valores inadequados podem causar problemas respiratórios e de crescimento.
                  </p>
                </div>

                {/* Amônia */}
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: '#fce7f3',
                  border: '1px solid #f9a8d4'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>⚗️</span>
                    <h4 style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#be185d'
                    }}>
                      Nível de Amônia
                    </h4>
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#be185d'
                  }}>
                    <strong>Por que é importante:</strong> A amônia é tóxica para os camarões 
                    mesmo em baixas concentrações. Níveis elevados podem causar danos nas 
                    brânquias, estresse e mortalidade.
                  </p>
                </div>
              </div>

              {/* Benefícios */}
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                background: '#f0fdf4',
                border: '1px solid #86efac'
              }}>
                <h4 style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#166534'
                }}>
                  ✅ Benefícios do Monitoramento
                </h4>
                <ul style={{
                  margin: 0,
                  paddingLeft: '20px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#166534'
                }}>
                  <li>Prevenção de doenças e mortalidade</li>
                  <li>Otimização do crescimento dos camarões</li>
                  <li>Redução de perdas na produção</li>
                  <li>Melhoria na qualidade da água</li>
                  <li>Aumento da produtividade do cativeiro</li>
                </ul>
              </div>
            </div>

            {/* Botão de fechar */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button 
                onClick={() => setShowInfoModal(false)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#3B82F6',
                  color: '#fff',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#2563eb';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#3B82F6';
                }}
              >
                Entendi!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}