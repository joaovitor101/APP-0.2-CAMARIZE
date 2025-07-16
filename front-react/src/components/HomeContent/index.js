import { useRouter } from "next/router";
import styles from "./HomeContent.module.css";
import NavBottom from "../NavBottom";

const cativeirosMock = [
  {
    id: 1,
    nome: "Cativeiro 1",
    cultivo: "Cultivo de: Caridea",
    imagem: "/images/cativeiro1.jpg"
  },
  {
    id: 2,
    nome: "Cativeiro 2",
    cultivo: "Cultivo de: Caridea",
    imagem: "/images/cativeiro2.jpg"
  },
  {
    id: 3,
    nome: "Cativeiro 3",
    cultivo: "Cultivo de: Caridea",
    imagem: "/images/cativeiro3.jpg"
  },
  {
    id: 4,
    nome: "Cativeiro 4",
    cultivo: "Cultivo de: Caridea",
    imagem: "/images/cativeiro4.jpg"
  },
  {
    id: 5,
    nome: "Cativeiro 5",
    cultivo: "Cultivo de: Caridea",
    imagem: "/images/cativeiro5.jpg"
  },
  {
    id: 6,
    nome: "Cativeiro 6",
    cultivo: "Ilha Cultivo de: Caridea - SP",
    imagem: "/images/cativeiro6.jpg"
  },
];

export default function HomeContent() {
  const router = useRouter();

  const handleCativeiroClick = (id) => {
    router.push(`/dashboard?id=${id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/images/camarizeLogo4.png" alt="Logo" style={{ height: 24 }} />

        <div className={styles.iconGroup}>
          <button className={styles.iconBtn} aria-label="Info">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#222" strokeWidth="2"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#222">i</text></svg>
          </button>
          <button className={styles.iconBtn} aria-label="Adicionar">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" stroke="#222" strokeWidth="2"/><path d="M12 8v8M8 12h8" stroke="#222" strokeWidth="2"/></svg>
          </button>
          <button className={styles.iconBtn} aria-label="Download">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 4v12m0 0l-4-4m4 4l4-4" stroke="#222" strokeWidth="2"/><rect x="4" y="18" width="16" height="2" rx="1" fill="#222"/></svg>
          </button>
        </div>
      </div>
      <div className={styles.cativeiroList}>
        {cativeirosMock.map(cativeiro => (
          <div
            key={cativeiro.id}
            className={styles.cativeiroItem}
            style={{ cursor: "pointer" }}
            onClick={() => handleCativeiroClick(cativeiro.id)}
          >
            <img src={cativeiro.imagem} alt={cativeiro.nome} className={styles.cativeiroImg} />
            <div className={styles.cativeiroInfo}>
              <div className={styles.cativeiroNome}>{cativeiro.nome}</div>
              <div className={styles.cativeiroCultivo}>{cativeiro.cultivo}</div>
            </div>
          </div>
        ))}
      </div>
      <NavBottom />
    </div>
  );
}