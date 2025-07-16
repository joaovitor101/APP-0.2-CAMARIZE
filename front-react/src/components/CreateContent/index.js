import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/components/CreateContent/CreateContent.module.css";
import axios from "axios";
import dynamic from 'next/dynamic';
import SelectTipoCamarao from "@/components/SelectTipoCamarao";
const CreatableSelect = dynamic(() => import('react-select/creatable'), { ssr: false });

const sensoresDisponiveis = [
  "Sensor de temperatura",
  "Sensor de PH",
  "Sensor de amônia"
];

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: 52,
    borderRadius: 6,
    background: '#f5f5f5',
    border: state.isFocused ? '1.5px solid #a3c7f7' : 'none',
    boxShadow: 'none',
    fontSize: '1.08rem',
    color: '#222',
    paddingLeft: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: 52,
    padding: '0 16px',
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: 52,
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: 8,
    fontSize: '1.08rem',
    zIndex: 9999,
    position: 'fixed',
    background: '#fff',
    color: '#222',
    minWidth: '200px',
  }),
  menuPortal: base => ({ ...base, zIndex: 9999 }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: 220,
    overflowY: 'auto',
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isFocused ? '#eaeaea' : '#fff',
    color: '#222',
    cursor: 'pointer',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#888',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#222',
  }),
};


export default function CreateContent() {
  const router = useRouter();
  const [sitios, setSitios] = useState([]);
  const [tiposCamarao, setTiposCamarao] = useState([]);
  const [sitioSelecionado, setSitioSelecionado] = useState("");
  const [tipoCamarao, setTipoCamarao] = useState(null);
  const [dataInstalacao, setDataInstalacao] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [sensores, setSensores] = useState(["", "", ""]);
  const [tempMedia, setTempMedia] = useState("");
  const [phMedio, setPhMedio] = useState("");
  const [amoniaMedia, setAmoniaMedia] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    async function fetchSitios() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await axios.get(`${apiUrl}/fazendas`);
        setSitios(res.data);
      } catch (err) {
        setSitios([]);
      }
    }
    async function fetchTiposCamarao() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await axios.get(`${apiUrl}/tipos-camarao`);
        setTiposCamarao(res.data);
      } catch (err) {
        setTiposCamarao([]);
      }
    }
    fetchSitios();
    fetchTiposCamarao();
  }, []);

  // LOG para depuração
  useEffect(() => {
    console.log('tiposCamarao:', tiposCamarao);
  }, [tiposCamarao]);

  const handleSensorChange = (idx, value) => {
    const novos = [...sensores];
    novos[idx] = value;
    setSensores(novos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const formData = new FormData();
    formData.append("sitio", sitioSelecionado);
    formData.append("id_tipo_camarao", tipoCamarao?.value || "");
    formData.append("data_instalacao", dataInstalacao);
    if (arquivo) formData.append("foto_cativeiro", arquivo);
    formData.append("temp_media_diaria", tempMedia);
    formData.append("ph_medio_diario", phMedio);
    formData.append("amonia_media_diaria", amoniaMedia);
    try {
      await axios.post(`${apiUrl}/cativeiros`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Cativeiro cadastrado com sucesso!");
      router.push("/dashboard");
    } catch (err) {
      alert("Erro ao cadastrar cativeiro.");
    }
  };

  return (
    <div className={styles.createWrapper}>
      <button className={styles.backBtn} onClick={() => router.back()}>
        <span style={{ fontSize: 24, lineHeight: 1 }}>&larr;</span>
      </button>
      <form className={styles.formBox} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Cadastre seu cativeiro</h2>
        <select
          className={`${styles.input} ${styles.inputSelect}`}
          value={sitioSelecionado}
          onChange={e => setSitioSelecionado(e.target.value)}
        >
          <option value="">Selecione o sítio</option>
          {sitios.map(s => (
            <option key={s._id} value={s._id}>
              {s.nome} - {s.codigo}
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
          />
          {/* <span className={styles.inputIcon}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M7 2v2M17 2v2M3 7h18M5 11v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6M9 15h6" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span> */}
        </div>
        {/* Troca o select de tipo de camarão por um autocomplete com criação */}
        <div style={{ width: '100%' }}>
          <SelectTipoCamarao
            value={tipoCamarao?.value || ""}
            onChange={option => setTipoCamarao(option)}
          />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <h4 style={{ margin: '0 0 8px 0', fontWeight: 600, fontSize: '1.08rem' }}>Temperatura Ideal</h4>
        </div>
        <div className={styles.mediaInputs}>
          <input
            className={styles.input}
            placeholder="Temperatura"
            type="text"
            value={tempMedia}
            onChange={e => setTempMedia(e.target.value)}
          />
          <input
            className={styles.input}
            placeholder="pH"
            type="text"
            value={phMedio}
            onChange={e => setPhMedio(e.target.value)}
          />
          <input
            className={styles.input}
            placeholder="Amônia"
            type="text"
            value={amoniaMedia}
            onChange={e => setAmoniaMedia(e.target.value)}
          />
        </div>
        <div className={styles.uploadBox}>
          <button type="button" className={styles.uploadBtn} onClick={() => fileInputRef.current.click()}>
            &#128206; Selecionar foto
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={e => setArquivo(e.target.files[0])}
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
          >
            <option value="">Selecione</option>
            {sensoresDisponiveis.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        ))}
        <button type="submit" className={styles.cadastrarBtn}>
          Cadastrar
        </button>
      </form>
      <div className={styles.logoBox}>
        <img src="/images/camarizeLogo4.png" alt="Camarize Logo" />
      </div>
    </div>
  );
}