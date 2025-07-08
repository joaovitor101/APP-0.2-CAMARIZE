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
        const response = await axios.get("http://localhost:4000/games");
        // console.log(response);
        setGames(response.data.games);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally{
        setLoading(false);
      }
    };
    //invocando a função
    fetchGames();
  }, []);

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
            {games.map((game) => (
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
