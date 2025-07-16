import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../components/SettingsContent/SettingsContent.module.css";
import NavBottom from "../components/NavBottom";

export default function Settings() {
  const [sitio, setSitio] = useState(null);
  const [loading, setLoading] = useState(true);

  // Coloque aqui o ID do usuário para teste (pegue do banco)
  const USER_ID = "6877905ea7aef9e990c13578";

  useEffect(() => {
    async function fetchSitioDoUsuario() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        let user;
        try {
          // Tente buscar o usuário pelo ID (ajuste o endpoint conforme seu backend)
          const userRes = await axios.get(`${apiUrl}/users/${USER_ID}`);
          console.log("Usuário retornado:", userRes.data);
          user = userRes.data;
        } catch (err) {
          console.log("Erro ao buscar usuário:", err);
          user = null;
        }
        if (user && user.sitio) {
          try {
            const sitioRes = await axios.get(`${apiUrl}/sitios/${user.sitio}`);
            console.log("Sítio encontrado:", sitioRes.data);
            setSitio(sitioRes.data);
          } catch (err) {
            console.log("Erro ao buscar sítio:", err);
            setSitio(null);
          }
        } else {
          setSitio(null);
        }
      } catch (err) {
        setSitio(null);
      }
      setLoading(false);
    }
    fetchSitioDoUsuario();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (!sitio) return <div>Nenhum sítio encontrado.</div>;

  return (
    <>
      <div className={styles.settingsWrapper}>
        <button className={styles.backBtn} onClick={() => window.history.back()}>
          <span style={{ fontSize: 24, lineHeight: 1 }}>&larr;</span>
        </button>
        <h2 className={styles.title}>Meu Sítio</h2>
        <div className={styles.avatarBox}>
          <img
            src={sitio.foto_sitio ? `/api/sitios/${sitio._id}/foto` : "/images/cativeiro1.jpg"}
            alt="Foto do sítio"
            className={styles.avatar}
          />
          <button className={styles.editPhotoBtn} title="Editar foto">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M15.232 5.232a3 3 0 1 1 4.243 4.243L7.5 21H3v-4.5L15.232 5.232Z" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <form className={styles.formBox}>
          <label className={styles.label}>Nome Completo do Sítio</label>
          <input className={styles.input} value={sitio.nome || ""} disabled />
          <label className={styles.label}>Cidade</label>
          <input className={styles.input} value={sitio.cidade || ""} disabled />
          <label className={styles.label}>Bairro</label>
          <input className={styles.input} value={sitio.bairro || ""} disabled />
          <label className={styles.label}>Rua</label>
          <input className={styles.input} value={sitio.rua || ""} disabled />
          <label className={styles.label}>Número</label>
          <input className={styles.input} value={sitio.numero || ""} disabled />
        </form>
      </div>
      <NavBottom />
    </>
  );
} 