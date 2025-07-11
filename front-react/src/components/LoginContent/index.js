import styles from "@/components/LoginContent/LoginContent.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";

const LoginContent = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await axios.post(`${apiUrl}/auth`, { email, password });
      localStorage.setItem("token", response.data.token);
      router.push("/home");
    } catch (err) {
      setError("Usuário ou senha inválidos!");
    }
  };

  return (
    <div className={styles.loginContent}>
      {/* LOGIN CARD */}
      <div className={styles.loginCard}>
        {/* LOGIN CARD HEADER */}
        <div className={styles.loginCardHeader}>
          <h3>Faça seu login:</h3>
        </div>
        {/* LOGIN CARD BODY */}
        <div className={styles.loginCardBody}>
          <form className="formPrimary" onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Digite seu e-mail"
              className={`${styles.input} inputPrimary`}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Digite sua senha"
              className={`${styles.input} inputPrimary`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" className={`${styles.input} btnPrimary`}>
              Entrar
            </button>
            {error && <div style={{ color: "#ff4d4f", marginTop: 8 }}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginContent;
