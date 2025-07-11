import styles from "@/components/HomeContent/HomeContent.module.css";
import Loading from "../Loading";
import axios from "axios";
import { useEffect, useState } from "react";

const HomeContent = () => {
  //Criando um estado para games

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState([true]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await axios.get(`${apiUrl}/games`);
        // Garante que games sempre será um array
        if (Array.isArray(response.data)) {
          setGames(response.data);
        } else if (response.data && Array.isArray(response.data.games)) {
          setGames(response.data.games);
        } else {
          setGames([]);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  console.log("games:", games);

  return (
    <>
      <div className={styles.homeContent}>
        {/* CARD LISTA DE JOGOS */}
        <div className={styles.listGamesCard}>
          {/* TITLE */}
          <div className={styles.title}>
            <h2>Lista de jogos</h2>
          </div>
          <Loading loading={loading}/>
          <div className={styles.games} id={styles.games}>
            {/* Lista de jogos irá aqui */}
            {Array.isArray(games) && games.map((game) => (
              <ul key={game._id} className={styles.listGames}>
                <div className={styles.gameImg}>
                  <img src="images/game_cd_cover.png" alt="jogo em estoque" />
                </div>
                <div className={styles.gameInfo}>
                  <h3>{game.title}</h3>
                  <li>Ano: {game.year}</li>
                  <li>Preço: {game.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</li>
                </div>
              </ul>
            ))}
            {/* <h3>Titulo do jogo...</h3> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeContent;