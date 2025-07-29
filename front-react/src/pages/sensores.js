import { useEffect, useState } from 'react';
import SensorList from '../components/SensorList';
import styles from '../components/SensorList/SensorList.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import Notification from '../components/Notification';
import AuthError from '../components/AuthError';
import Loading from '../components/Loading';
import NavBottom from '../components/NavBottom';

export default function SensoresPage() {
  const [sensores, setSensores] = useState([]);
  const [sensoresFiltrados, setSensoresFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sensorToDelete, setSensorToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [filtroAtivo, setFiltroAtivo] = useState('');
  const [showFiltroModal, setShowFiltroModal] = useState(false);
  const router = useRouter();

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const hideNotification = () => {
    setNotification({ show: false, message: '', type: 'success' });
  };

  // Aplicar filtro quando sensores ou filtroAtivo mudarem
  useEffect(() => {
    if (filtroAtivo === '') {
      setSensoresFiltrados(sensores);
    } else {
      const filtrados = sensores.filter(sensor => 
        sensor.id_tipo_sensor?.toLowerCase().includes(filtroAtivo.toLowerCase()) ||
        sensor.apelido?.toLowerCase().includes(filtroAtivo.toLowerCase())
      );
      setSensoresFiltrados(filtrados);
    }
  }, [sensores, filtroAtivo]);

  useEffect(() => {
    async function fetchSensores() {
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
        
        const res = await axios.get(`${apiUrl}/sensores`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSensores(res.data);
        setSensoresFiltrados(res.data); // Inicializar filtrados com todos os sensores
      } catch (err) {
        console.error('Erro ao buscar sensores:', err);
        if (err.response?.status === 401) {
          setError('Sessão expirada. Faça login novamente para continuar.');
        } else {
          setError('Erro ao carregar os sensores. Tente novamente.');
        }
        setSensores([]);
        setSensoresFiltrados([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSensores();
  }, []);

  const handleEditSensor = (sensorId) => {
    router.push(`/edit-sensor?id=${sensorId}`);
  };

  const handleDeleteSensor = (sensorId) => {
    setSensorToDelete(sensorId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!sensorToDelete) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await axios.delete(`${apiUrl}/sensores/${sensorToDelete}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      // Recarregar a lista de sensores
      const res = await axios.get(`${apiUrl}/sensores`);
      setSensores(res.data);
      setSensoresFiltrados(res.data); // Atualizar filtrados após exclusão
      
      setShowDeleteModal(false);
      setSensorToDelete(null);
      showNotification('Sensor excluído com sucesso!', 'success');
    } catch (err) {
      console.error('Erro ao deletar sensor:', err);
      showNotification('Erro ao excluir sensor', 'error');
      setShowDeleteModal(false);
      setSensorToDelete(null);
    }
  };

  // Se há erro, mostrar tela de erro
  if (error) {
    return <AuthError error={error} onRetry={() => window.location.reload()} />;
  }

  // Se está carregando, mostrar loading
  if (loading) {
    return <Loading message="Carregando sensores..." />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: 600, 
        padding: '16px', 
        margin: '0 auto', 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <button 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: 24, 
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }} 
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                router.push('/home');
              }
            }}
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
          <h2 style={{ flex: 1, textAlign: 'center', margin: 0, fontWeight: 600 }}>Sistema</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <span style={{ fontWeight: 600, fontSize: '1.08rem' }}>Sensores</span>
          <div style={{ flex: 1 }} />
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Ordenar">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M3 18h6M3 6h18M3 12h12" stroke="#222" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <button 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              position: 'relative'
            }} 
            title={filtroAtivo ? `Filtro ativo: ${filtroAtivo}` : "Filtrar"} 
            onClick={() => setShowFiltroModal(true)}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707l-6.414 6.414A1 1 0 0 0 13 13.414V19a1 1 0 0 1-1.447.894l-4-2A1 1 0 0 1 7 17v-3.586a1 1 0 0 0-.293-.707L3.293 6.707A1 1 0 0 1 3 6V4Z" stroke={filtroAtivo ? "#3b82f6" : "#222"} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {filtroAtivo && (
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '8px',
                height: '8px',
                background: '#3b82f6',
                borderRadius: '50%',
                border: '2px solid #fff'
              }} />
            )}
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Cadastrar Sensor" onClick={() => router.push('/create-sensores')}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" stroke="#222" strokeWidth="2"/><path d="M12 8v8M8 12h8" stroke="#222" strokeWidth="2"/></svg>
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
          <SensorList 
            sensores={sensoresFiltrados} 
            onEdit={handleEditSensor}
            onDelete={handleDeleteSensor}
          />
        </div>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '32px 0 16px 0' }}>
        <img src="/images/logo_camarize1.png" alt="Camarize Logo" style={{ width: 180, height: 40 }} />
      </div>
      
      {/* Modal de confirmação de exclusão */}
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
              Tem certeza que deseja excluir este sensor? Esta ação não pode ser desfeita.
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
                  setSensorToDelete(null);
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
                  transition: 'all 0.2s ease'
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

      {/* Componente de Notificação */}
      {notification.show && (
        <Notification
          isVisible={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      {/* Modal de Filtro */}
      {showFiltroModal && (
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
            {/* Título */}
            <div style={{
              fontWeight: '700',
              fontSize: '20px',
              color: '#1f2937',
              lineHeight: '1.2'
            }}>
              Filtrar Sensores
            </div>
            
            {/* Campo de busca */}
            <div style={{ width: '100%' }}>
              <input
                type="text"
                placeholder="Digite o nome do sensor..."
                value={filtroAtivo}
                onChange={(e) => setFiltroAtivo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Filtros rápidos */}
            <div style={{ width: '100%' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                Filtros rápidos:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setFiltroAtivo('Temperatura')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid #d1d5db',
                    background: filtroAtivo === 'Temperatura' ? '#3b82f6' : '#fff',
                    color: filtroAtivo === 'Temperatura' ? '#fff' : '#374151',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  Temperatura
                </button>
                <button
                  onClick={() => setFiltroAtivo('pH')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid #d1d5db',
                    background: filtroAtivo === 'pH' ? '#3b82f6' : '#fff',
                    color: filtroAtivo === 'pH' ? '#fff' : '#374151',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  pH
                </button>
                <button
                  onClick={() => setFiltroAtivo('Amônia')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid #d1d5db',
                    background: filtroAtivo === 'Amônia' ? '#3b82f6' : '#fff',
                    color: filtroAtivo === 'Amônia' ? '#fff' : '#374151',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  Amônia
                </button>
              </div>
            </div>

            {/* Contador de resultados */}
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {filtroAtivo ? `${sensoresFiltrados.length} de ${sensores.length} sensores encontrados` : `${sensores.length} sensores no total`}
            </div>
            
            {/* Botões */}
            <div style={{
              display: 'flex',
              gap: '12px',
              width: '100%',
              marginTop: '8px'
            }}>
              <button 
                onClick={() => {
                  setFiltroAtivo('');
                  setShowFiltroModal(false);
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
                  transition: 'all 0.2s ease'
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
                Limpar
              </button>
              <button 
                onClick={() => setShowFiltroModal(false)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#3b82f6',
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
                  e.target.style.background = '#3b82f6';
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NavBottom */}
      <NavBottom />
    </div>
  );
} 