import { useState, useEffect } from "react";
import styles from "../components/ProfileContent/ProfileContent.module.css";
import NavBottom from "../components/NavBottom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setLoading(false);
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await axios.get(`${apiUrl}/users/${userId}`);
        let foto_perfil = res.data.foto_perfil;
        if (foto_perfil && typeof foto_perfil === "string" && foto_perfil.startsWith("data:image")) {
          // base64 já com prefixo, usa direto
        } else {
          // Use o novo SVG de avatar como placeholder
          foto_perfil = "/images/avatar-placeholder.svg";
        }
        setUser({
          _id: res.data._id,
          nome: res.data.nome,
          email: res.data.email,
          senha: res.data.senha,
          foto_perfil
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) return <div className={styles.profileWrapper}>Carregando...</div>;
  if (!user) return <div className={styles.profileWrapper}>Não foi possível carregar o perfil.</div>;

  return (
    <>
      <div className={styles.profileWrapper}>
        <div className={styles.profileBox}>
          <button className={styles.backBtn} onClick={() => window.history.back()}>
            <span style={{ fontSize: 24, lineHeight: 1 }}>&larr;</span>
          </button>
          <button
            title="Sair"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("usuarioCamarize");
              window.location.href = "/login";
            }}
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              background: "none",
              border: "none",
              cursor: "pointer",
              zIndex: 2
            }}
          >
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
              <path d="M16 17v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 12h10m0 0-3-3m3 3-3 3" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h2 className={styles.title}>Perfil</h2>
          <div className={styles.avatarBox}>
            <img
              src={user.foto_perfil}
              alt="Foto do usuário"
              className={styles.avatar}
            />
            <button className={styles.editPhotoBtn} title="Editar foto">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M15.232 5.232a3 3 0 1 1 4.243 4.243L7.5 21H3v-4.5L15.232 5.232Z" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div className={styles.userName}>{user.nome}</div>
          <div className={styles.userRole}>Usuário</div>
          <form className={styles.formBox}>
            <label className={styles.label}>Nome Completo</label>
            <input className={styles.input} value={user.nome} disabled />
            <label className={styles.label}>E-mail</label>
            <input className={styles.input} value={user.email} disabled />
            <label className={styles.label}>Senha</label>
            <div className={styles.passwordBox}>
              <input
                className={styles.input}
                type={showPassword ? "text" : "password"}
                value={user.senha}
                disabled
              />
              <button
                type="button"
                className={styles.showPasswordBtn}
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
      <NavBottom />
    </>
  );
} 