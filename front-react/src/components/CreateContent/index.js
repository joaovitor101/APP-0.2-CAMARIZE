import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/components/CreateContent/CreateContent.module.css";
import axios from "axios";

const sensoresDisponiveis = [
  "Sensor de temperatura",
  "Sensor de PH",
  "Sensor de amônia"
];

export default function CreateContent() {
  const router = useRouter();
  const [sitios, setSitios] = useState([]);
  const [sitioSelecionado, setSitioSelecionado] = useState("");
  const [dataInstalacao, setDataInstalacao] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [sensores, setSensores] = useState(["", "", ""]);
  const fileInputRef = useRef();

  useEffect(() => {
    async function fetchSitios() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await axios.get(`${apiUrl}/sitios`);
        setSitios(res.data);
      } catch (err) {
        setSitios([]);
      }
    }
    fetchSitios();
  }, []);

  const handleSensorChange = (idx, value) => {
    const novos = [...sensores];
    novos[idx] = value;
    setSensores(novos);
  };

  return (
    <div className={styles.createWrapper}>
      <button className={styles.backBtn} onClick={() => router.back()}>
        <span style={{fontSize: 24, lineHeight: 1}}>&larr;</span>
      </button>
      <form className={styles.formBox}>
        <h2 className={styles.title}>Cadastre seu tanque</h2>
        <select
          className={styles.input}
          value={sitioSelecionado}
          onChange={e => setSitioSelecionado(e.target.value)}
        >
          <option value="">Selecione o sítio</option>
          {sitios.map(s => (
            <option key={s._id} value={s._id}>
              {s.nome} - {s.cidade} - {s.bairro}
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
            style={{paddingRight: 36}}
          />
          <span className={styles.inputIcon}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M7 2v2M17 2v2M3 7h18M5 11v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6M9 15h6" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
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
            className={styles.input}
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