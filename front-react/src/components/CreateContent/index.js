import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/components/CreateContent/CreateContent.module.css";
import axios from "axios";
import dynamic from 'next/dynamic';
import SelectTipoCamarao from "@/components/SelectTipoCamarao";
import Notification from "@/components/Notification";
import AuthError from "@/components/AuthError";
import Loading from "@/components/Loading";
const CreatableSelect = dynamic(() => import('react-select/creatable'), { ssr: false });

export default function CreateContent() {
  const router = useRouter();
  const [fazendas, setFazendas] = useState([]);
  const [tiposCamarao, setTiposCamarao] = useState([]);
  const [fazendaSelecionada, setFazendaSelecionada] = useState("");
  const [tipoCamarao, setTipoCamarao] = useState(null);
  const [dataInstalacao, setDataInstalacao] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [sensores, setSensores] = useState(["", "", ""]);
  const [sensoresDisponiveis, setSensoresDisponiveis] = useState([]);
  const [tempMedia, setTempMedia] = useState("");
  const [phMedio, setPhMedio] = useState("");
  const [amoniaMedia, setAmoniaMedia] = useState("");
  const [condicoesIdeais, setCondicoesIdeais] = useState([]);
  const [condicaoIdealSelecionada, setCondicaoIdealSelecionada] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const fileInputRef = useRef();

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const hideNotification = () => {
    setNotification({ show: false, message: '', type: 'success' });
  };

  useEffect(() => {
    async function fetchData() {
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
        
        const headers = { Authorization: `Bearer ${token}` };
        
        // Buscar todos os dados necessários
        const [fazendasRes, tiposRes, sensoresRes, condicoesRes] = await Promise.all([
          axios.get(`${apiUrl}/fazendas`, { headers }),
          axios.get(`${apiUrl}/tipos-camarao`, { headers }),
          axios.get(`${apiUrl}/sensores`, { headers }),
          axios.get(`${apiUrl}/condicoes-ideais`, { headers })
        ]);
        
        setFazendas(fazendasRes.data);
        setTiposCamarao(tiposRes.data);
        setSensoresDisponiveis(sensoresRes.data);
        setCondicoesIdeais(condicoesRes.data);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        if (err.response?.status === 401) {
          setError('Sessão expirada. Faça login novamente para continuar.');
        } else {
          setError('Erro ao carregar os dados. Tente novamente.');
        }
        setFazendas([]);
        setTiposCamarao([]);
        setSensoresDisponiveis([]);
        setCondicoesIdeais([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // LOG para depuração
  useEffect(() => {
    console.log('tiposCamarao:', tiposCamarao);
  }, [tiposCamarao]);

  // Se há erro, mostrar tela de erro
  if (error) {
    return <AuthError error={error} onRetry={() => window.location.reload()} />;
  }

  // Se está carregando, mostrar loading
  if (loading) {
    return <Loading message="Carregando formulário..." />;
  }

  const handleSensorChange = (idx, value) => {
    const novos = [...sensores];
    novos[idx] = value;
    setSensores(novos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const formData = new FormData();
    formData.append("fazendaId", fazendaSelecionada);
    formData.append("id_tipo_camarao", tipoCamarao?.value || "");
    formData.append("data_instalacao", dataInstalacao);
    if (arquivo) formData.append("foto_cativeiro", arquivo);
    formData.append("temp_media_diaria", tempMedia);
    formData.append("ph_medio_diario", phMedio);
    formData.append("amonia_media_diaria", amoniaMedia);
    formData.append("condicoes_ideais", condicaoIdealSelecionada);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await axios.post(`${apiUrl}/cativeiros`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      showNotification("Cativeiro cadastrado com sucesso!");
      // Aguardar 2 segundos antes de redirecionar para a notificação aparecer
      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (err) {
      showNotification("Erro ao cadastrar cativeiro.", 'error');
    }
  };

  return (
    <div className={styles.createWrapper}>
      <button 
        className={styles.backBtn} 
        onClick={() => router.back()}
        aria-label="Voltar"
        type="button"
      >
        <span style={{ fontSize: 24, lineHeight: 1 }}>&larr;</span>
      </button>
      <form className={styles.formBox} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Cadastre seu cativeiro</h2>
        <select
          className={`${styles.input} ${styles.inputSelect}`}
          value={fazendaSelecionada}
          onChange={e => setFazendaSelecionada(e.target.value)}
          required
          aria-label="Selecione o sítio"
        >
          <option value="">Selecione o sítio</option>
          {fazendas.map(f => (
            <option key={f._id} value={f._id}>
              {f.nome} - {f.codigo}
            </option>
          ))}
        </select>
        <div className={styles.inputIconBox}>
          <input
            className={styles.input}
            placeholder="Data da instalação"
            type="date"
            value={dataInstalacao}
            onChange={e => setDataInstalacao(e.target.value)}
            required
            aria-label="Data da instalação"
          />
        </div>
        {/* Troca o select de tipo de camarão por um autocomplete com criação */}
        <div style={{ width: '100%' }}>
          <SelectTipoCamarao
            value={tipoCamarao}
            onChange={option => setTipoCamarao(option)}
          />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <h4 style={{ margin: '0 0 8px 0', fontWeight: 600, fontSize: '1.08rem' }}>Condições Ideais</h4>
        </div>
        <div className={styles.mediaInputs}>
          <input
            className={styles.input}
            placeholder="Temperatura"
            type="text"
            value={tempMedia}
            onChange={e => setTempMedia(e.target.value)}
            aria-label="Temperatura média"
          />
          <input
            className={styles.input}
            placeholder="pH"
            type="text"
            value={phMedio}
            onChange={e => setPhMedio(e.target.value)}
            aria-label="pH médio"
          />
          <input
            className={styles.input}
            placeholder="Amônia"
            type="text"
            value={amoniaMedia}
            onChange={e => setAmoniaMedia(e.target.value)}
            aria-label="Amônia média"
          />
        </div>
        <div className={styles.uploadBox}>
          <button 
            type="button" 
            className={styles.uploadBtn} 
            onClick={() => fileInputRef.current.click()}
            aria-label="Selecionar foto do cativeiro"
          >
            &#128206; Selecionar foto
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={e => setArquivo(e.target.files[0])}
            accept="image/*"
            aria-label="Upload de foto"
          />
          <span className={styles.uploadFileName}>{arquivo ? arquivo.name : "Nenhum arquivo inserido"}</span>
        </div>
        <hr className={styles.hr} />
        <h3 className={styles.subtitle}>Relacione os sensores</h3>
        {sensores.map((sensor, idx) => (
          <select
            key={idx}
            className={`${styles.input} ${styles.inputSelect}`}
            value={sensor}
            onChange={e => handleSensorChange(idx, e.target.value)}
            aria-label={`Selecione o sensor ${idx + 1}`}
          >
            <option value="">Selecione</option>
            {sensoresDisponiveis.map(s => (
              <option key={s._id} value={s._id}>
                {s.apelido ? `${s.apelido} (${s.id_tipo_sensor})` : s.id_tipo_sensor || s._id}
              </option>
            ))}
          </select>
        ))}
        <button type="submit" className={styles.cadastrarBtn} aria-label="Cadastrar cativeiro">
          Cadastrar
        </button>
      </form>
      <div className={styles.logoBox}>
        <img src="/images/logo_camarize1.png" alt="Camarize Logo" />
      </div>
      <Notification
        isVisible={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />
    </div>
  );
}