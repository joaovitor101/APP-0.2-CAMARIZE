import { useRef, useState, useEffect } from "react";
import axios from "axios";
import profileStyles from "../components/ProfileContent/ProfileContent.module.css";
import NavBottom from "../components/NavBottom";

// Novo CSS para a foto circular perfeita e layout sem box
const customStyles = {
  avatar: {
    width: 110,
    height: 110,
    borderRadius: '50%',
    objectFit: 'cover',
    aspectRatio: '1/1',
    border: '3px solid #e6d6f7',
    background: '#f5f5f5',
    display: 'block',
    margin: '0 auto',
  },
  editPhotoBtn: {
    position: 'absolute',
    bottom: 8,
    right: 'calc(50% - 55px)', // centraliza em relação à imagem
    background: '#fff',
    border: '1.5px solid #e6d6f7',
    borderRadius: '50%',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #0001',
  },
  avatarBox: {
    position: 'relative',
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: '1.18rem',
    fontWeight: 600,
    marginBottom: 2,
    textAlign: 'center',
    marginTop: 10,
  },
  userRole: {
    fontSize: '1rem',
    color: '#888',
    marginBottom: 18,
    textAlign: 'center',
  },
  formBox: {
    width: '100%',
    maxWidth: 400,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginTop: 0,
    background: 'none',
    boxShadow: 'none',
    borderRadius: 0,
    alignItems: 'center',
  },
  label: {
    fontSize: '0.98rem',
    fontWeight: 500,
    color: '#444',
    marginBottom: 2,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    border: 'none',
    background: '#f5f5f5',
    borderRadius: 8,
    padding: '13px 16px',
    fontSize: '1.08rem',
    color: '#222',
    boxSizing: 'border-box',
    marginBottom: 0,
    outline: 'none',
  },
};

// SVG pré-definido como string (avatar simples para fazenda)
const SVG_AVATAR_FAZENDA =
  "data:image/svg+xml;utf8,<svg width='110' height='110' viewBox='0 0 110 110' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='55' cy='55' r='55' fill='%23a3c7f7'/><rect x='30' y='60' width='50' height='25' rx='6' fill='%23fff'/><rect x='45' y='50' width='20' height='20' rx='4' fill='%23e6d6f7'/><rect x='52' y='65' width='6' height='20' rx='2' fill='%23a3c7f7'/></svg>";

export default function Settings() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [fazenda, setFazenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [salvandoFoto, setSalvandoFoto] = useState(false);
  const [mensagemFoto, setMensagemFoto] = useState("");
  const [fotoFazenda, setFotoFazenda] = useState(SVG_AVATAR_FAZENDA);
  const fileInputRef = useRef();

  // Buscar o usuário logado do localStorage
  const usuario = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("usuarioCamarize")) : null;
  const USER_ID = usuario?._id;

  useEffect(() => {
    async function fetchFazendaDoUsuario() {
      if (!USER_ID) {
        setFazenda(null);
        setLoading(false);
        return;
      }
      try {
        // Buscar a relação usuario-fazenda
        const relRes = await axios.get(`${apiUrl}/usuariosxfazendas?usuario=${USER_ID}`);
        const rel = relRes.data && relRes.data.length > 0 ? relRes.data[0] : null;
        if (rel && rel.fazenda) {
          // Buscar os dados completos da fazenda
          const fazendaRes = await axios.get(`${apiUrl}/fazendas/${rel.fazenda}`);
          setFazenda(fazendaRes.data);
        } else {
          setFazenda(null);
        }
      } catch (err) {
        setFazenda(null);
      }
      setLoading(false);
    }
    fetchFazendaDoUsuario();
  }, [USER_ID, apiUrl]);

  // Buscar foto da fazenda ao carregar ou ao salvar
  useEffect(() => {
    if (!fazenda || previewFoto) return;
    const fetchFoto = async () => {
      try {
        const res = await axios.get(`${apiUrl}/fazendas/${fazenda._id}/foto`);
        setFotoFazenda(res.data.foto || SVG_AVATAR_FAZENDA);
      } catch {
        setFotoFazenda(SVG_AVATAR_FAZENDA);
      }
    };
    fetchFoto();
  }, [fazenda, previewFoto, apiUrl]);

  // Handler para editar foto
  const handleEditPhoto = () => {
    fileInputRef.current.click();
  };

  // Handler para upload de nova foto
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewFoto(reader.result); // Mostra preview imediatamente
      setMensagemFoto("");
      setFotoFazenda(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handler para salvar foto no backend
  const handleSalvarFoto = async () => {
    if (!previewFoto || !fazenda._id) return;
    setSalvandoFoto(true);
    setMensagemFoto("");
    try {
      await axios.patch(`${apiUrl}/fazendas/${fazenda._id}/foto`, { foto_sitio: previewFoto });
      setMensagemFoto("Foto atualizada com sucesso!");
      setPreviewFoto(null);
      setFazenda({ ...fazenda, foto_sitio: true });
      setFotoFazenda(previewFoto);
    } catch (err) {
      setMensagemFoto("Erro ao salvar foto.");
    }
    setSalvandoFoto(false);
  };

  if (loading) return <div>Carregando...</div>;
  if (!usuario) return <div>Faça login para ver as informações do seu sítio.</div>;
  if (!fazenda) return <div>Nenhuma fazenda encontrada.</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 80 }}>
      <button className={profileStyles.backBtn} onClick={() => window.history.back()}>
        <span style={{ fontSize: 24, lineHeight: 1 }}>&larr;</span>
      </button>
      <div style={{ position: 'relative', marginBottom: 10, marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={fotoFazenda}
          alt="Foto da fazenda"
          style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', aspectRatio: '1/1', border: '3px solid #e6d6f7', background: '#f5f5f5', display: 'block', margin: '0 auto' }}
        />
        <button type="button" title="Editar foto" onClick={handleEditPhoto} style={{ position: 'absolute', bottom: 8, right: 'calc(50% - 55px)', background: '#fff', border: '1.5px solid #e6d6f7', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M15.232 5.232a3 3 0 1 1 4.243 4.243L7.5 21H3v-4.5L15.232 5.232Z" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {previewFoto && (
          <button
            type="button"
            onClick={handleSalvarFoto}
            disabled={salvandoFoto}
            style={{ marginTop: 12, padding: '8px 18px', borderRadius: 8, background: '#a3c7f7', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
          >
            {salvandoFoto ? 'Salvando...' : 'Salvar foto'}
          </button>
        )}
        {mensagemFoto && (
          <div style={{ marginTop: 8, color: mensagemFoto.includes('sucesso') ? 'green' : 'red', fontWeight: 500 }}>{mensagemFoto}</div>
        )}
      </div>
      <div style={customStyles.userName}>{fazenda.nome || ""}</div>
      <div style={customStyles.userRole}>Sítio/Fazenda</div>
      <form style={customStyles.formBox}>
        <label style={customStyles.label}>Cidade</label>
        <input style={customStyles.input} value={fazenda.cidade || ""} disabled />
        <label style={customStyles.label}>Bairro</label>
        <input style={customStyles.input} value={fazenda.bairro || ""} disabled />
        <label style={customStyles.label}>Rua</label>
        <input style={customStyles.input} value={fazenda.rua || ""} disabled />
        <label style={customStyles.label}>Número</label>
        <input style={customStyles.input} value={fazenda.numero || ""} disabled />
      </form>
      <NavBottom />
    </div>
  );
} 