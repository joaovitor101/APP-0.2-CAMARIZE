import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/components/CreateContent/CreateContent.module.css";
import axios from "axios";
import dynamic from 'next/dynamic';
import SelectTipoCamarao from "@/components/SelectTipoCamarao";
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
  const fileInputRef = useRef();

  useEffect(() => {
    async function fetchFazendas() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await axios.get(`${apiUrl}/fazendas`);
        setFazendas(res.data);
      } catch (err) {
        setFazendas([]);
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
    async function fetchSensores() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await axios.get(`${apiUrl}/sensores`);
        setSensoresDisponiveis(res.data);
      } catch (err) {
        setSensoresDisponiveis([]);
      }
    }
    async function fetchCondicoesIdeais() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await axios.get(`${apiUrl}/condicoes-ideais`);
        setCondicoesIdeais(res.data);
      } catch (err) {
        setCondicoesIdeais([]);
      }
    }
    fetchFazendas();
    fetchTiposCamarao();
    fetchSensores();
    fetchCondicoesIdeais();
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
    formData.append("fazenda", fazendaSelecionada);
    formData.append("id_tipo_camarao", tipoCamarao?.value || "");
    formData.append("data_instalacao", dataInstalacao);
    if (arquivo) formData.append("foto_cativeiro", arquivo);
    formData.append("temp_media_diaria", tempMedia);
    formData.append("ph_medio_diario", phMedio);
    formData.append("amonia_media_diaria", amoniaMedia);
    formData.append("condicoes_ideais", condicaoIdealSelecionada);
    try {
      await axios.post(`${apiUrl}/cativeiros`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Cativeiro cadastrado com sucesso!");
      router.push("/home");
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
          value={fazendaSelecionada}
          onChange={e => setFazendaSelecionada(e.target.value)}
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
          <h4 style={{ margin: '0 0 8px 0', fontWeight: 600, fontSize: '1.08rem' }}>Condições Ideais</h4>
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
              <option key={s._id} value={s._id}>
                {s.apelido ? `${s.apelido} (${s.id_tipo_sensor})` : s.id_tipo_sensor || s._id}
              </option>
            ))}
          </select>
        ))}
        <button type="submit" className={styles.cadastrarBtn}>
          Cadastrar
        </button>
      </form>
      <div className={styles.logoBox}>
        <img src="/images/logo_camarize1.png" alt="Camarize Logo" />
      </div>
    </div>
  );
}