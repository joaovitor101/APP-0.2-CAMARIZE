import { useRouter } from "next/router";
import styles from "./HomeContent.module.css";
import NavBottom from "../NavBottom";
import { useEffect, useState } from "react";
import axios from "axios";

// const cativeirosMock = [
//   {
//     id: 1,
//     nome: "Cativeiro 1",
//     cultivo: "Cultivo de: Caridea",
//     imagem: "/images/cativeiro1.jpg"
//   },
//   {
//     id: 2,
//     nome: "Cativeiro 2",
//     cultivo: "Cultivo de: Caridea",
//     imagem: "/images/cativeiro2.jpg"
//   },
//   {
//     id: 3,
//     nome: "Cativeiro 3",
//     cultivo: "Cultivo de: Caridea",
//     imagem: "/images/cativeiro3.jpg"
//   },
//   {
//     id: 4,
//     nome: "Cativeiro 4",
//     cultivo: "Cultivo de: Caridea",
//     imagem: "/images/cativeiro4.jpg"
//   },
//   {
//     id: 5,
//     nome: "Cativeiro 5",
//     cultivo: "Cultivo de: Caridea",
//     imagem: "/images/cativeiro5.jpg"
//   },
//   {
//     id: 6,
//     nome: "Cativeiro 6",
//     cultivo: "Ilha Cultivo de: Caridea - SP",
//     imagem: "/images/cativeiro6.jpg"
//   },
// ];

export default function HomeContent() {
  const router = useRouter();
  const [cativeiros, setCativeiros] = useState([]);

  useEffect(() => {
    async function fetchCativeiros() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await axios.get(`${apiUrl}/cativeiros`);
        setCativeiros(res.data);
      } catch (err) {
        setCativeiros([]);
      }
    }
    fetchCativeiros();
  }, []);

  const handleCativeiroClick = (id) => {
    router.push(`/dashboard?id=${id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/images/camarizeLogo4.png" alt="Logo" style={{ height: 24 }} />

        <div className={styles.iconGroup}>
          <button className={styles.iconBtn} aria-label="Sensor" onClick={() => router.push('/sensores')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="7" y="7" width="10" height="10" rx="2" fill="#000"/>
              <rect x="9" y="9" width="6" height="6" rx="1" fill="#fff"/>
              <rect x="2" y="11" width="3" height="2" rx="1" fill="#000"/>
              <rect x="19" y="11" width="3" height="2" rx="1" fill="#000"/>
              <rect x="11" y="2" width="2" height="3" rx="1" fill="#000"/>
              <rect x="11" y="19" width="2" height="3" rx="1" fill="#000"/>
              <rect x="4.22" y="4.22" width="2" height="3" rx="1" transform="rotate(-45 4.22 4.22)" fill="#000"/>
              <rect x="17.78" y="16.78" width="2" height="3" rx="1" transform="rotate(-45 17.78 16.78)" fill="#000"/>
              <rect x="4.22" y="16.78" width="2" height="3" rx="1" transform="rotate(45 4.22 16.78)" fill="#000"/>
              <rect x="17.78" y="4.22" width="2" height="3" rx="1" transform="rotate(45 17.78 4.22)" fill="#000"/>
            </svg>
          </button>
          <button
            className={styles.iconBtn}
            aria-label="Cadastrar Cativeiro"
            onClick={() => router.push('/create-cativeiros')}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" stroke="#222" strokeWidth="2"/><path d="M12 8v8M8 12h8" stroke="#222" strokeWidth="2"/></svg>
          </button>
          <button className={styles.iconBtn} aria-label="Download">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 4v12m0 0l-4-4m4 4l4-4" stroke="#222" strokeWidth="2"/><rect x="4" y="18" width="16" height="2" rx="1" fill="#222"/></svg>
          </button>
        </div>
      </div>
      <div className={styles.cativeiroList}>
        {cativeiros.map((cativeiro, idx) => {
          // Converter buffer para base64 se existir
          let fotoUrl = "/images/cativeiro1.jpg";
          if (cativeiro.foto_cativeiro && cativeiro.foto_cativeiro.data) {
            const base64String = Buffer.from(cativeiro.foto_cativeiro.data).toString('base64');
            fotoUrl = `data:image/jpeg;base64,${base64String}`;
          }
          return (
            <div
              key={cativeiro._id}
              className={styles.cativeiroItem}
              style={{ cursor: "pointer" }}
              onClick={() => handleCativeiroClick(cativeiro._id)}
            >
              <img
                src={fotoUrl}
                alt={`Cativeiro ${idx + 1}`}
                className={styles.cativeiroImg}
              />
              <div className={styles.cativeiroInfo}>
                <div className={styles.cativeiroNome}>{`Cativeiro ${idx + 1}`}</div>
                <div className={styles.cativeiroCultivo}>{
                  (typeof cativeiro.id_tipo_camarao === 'object' && cativeiro.id_tipo_camarao?.nome)
                    ? cativeiro.id_tipo_camarao.nome
                    : (cativeiro.id_tipo_camarao || 'Tipo não informado')
                }</div>
              </div>
            </div>
          );
        })}
      </div>
      <NavBottom />
    </div>
  );
}