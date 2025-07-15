import { useRouter } from "next/router";
import styles from "./HomeContent.module.css";

const tanquesMock = [
  {
    id: 1,
    nome: "Tanque 1",
    cultivo: "Cultivo de: Caridea",
    imagem: "/images/tanque1.jpg"
  },
  {
    id: 2,
    nome: "Tanque 2",
    cultivo: "Cultivo de: Caridea",
    imagem: "/images/tanque2.jpg"
  },
  {
    id: 3,
    nome: "Tanque 3",
    cultivo: "Cultivo de: Caridea",
    imagem: "/images/tanque3.jpg"
  },
  {
    id: 4,
    nome: "Tanque 4",
    cultivo: "Cultivo de: Caridea",
    imagem: "/images/tanque4.jpg"
  },
  {
    id: 5,
    nome: "Tanque 5",
    cultivo: "Cultivo de: Caridea",
    imagem: "/images/tanque5.jpg"
  },
  {
    id: 6,
    nome: "Tanque 6",
    cultivo: "Ilha Cultivo de: Caridea - SP",
    imagem: "/images/tanque6.jpg"
  },
];

export default function HomeContent() {
  const router = useRouter();

  const handleTanqueClick = (id) => {
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
      <div className={styles.tanqueList}>
        {tanquesMock.map(tanque => (
          <div
            key={tanque.id}
            className={styles.tanqueItem}
            style={{ cursor: "pointer" }}
            onClick={() => handleTanqueClick(tanque.id)}
          >
            <img src={tanque.imagem} alt={tanque.nome} className={styles.tanqueImg} />
            <div className={styles.tanqueInfo}>
              <div className={styles.tanqueNome}>{tanque.nome}</div>
              <div className={styles.tanqueCultivo}>{tanque.cultivo}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}