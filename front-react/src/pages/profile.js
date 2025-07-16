import { useState } from "react";
import styles from "../components/ProfileContent/ProfileContent.module.css";
import NavBottom from "../components/NavBottom";

export default function Profile() {
  // Mock de dados do usuário (substitua por dados reais depois)
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    nome: "Ana Silva",
    email: "anasilva@gmail.com",
    senha: "12345678",
    foto_perfil: "/images/camarizeLogo4.png", // Substitua por foto real se houver
  });

  return (
    <>
      <div className={styles.profileWrapper}>
        <div className={styles.profileBox}>
          <button className={styles.backBtn} onClick={() => window.history.back()}>
            <span style={{ fontSize: 24, lineHeight: 1 }}>&larr;</span>
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