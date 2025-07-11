import styles from "@/components/HomeContent/HomeContent.module.css";
import Loading from "../Loading";
import axios from "axios";
import { useEffect, useState } from "react";

const HomeContent = () => {
  //Criando um estado para games

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState([true]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', year: '', price: '', genre: '', platform: '', rating: '' });
  const [search, setSearch] = useState("");

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

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este jogo?")) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      await axios.delete(`${apiUrl}/games/${id}`);
      setGames((prev) => prev.filter((game) => game._id !== id));
    } catch (error) {
      alert("Erro ao excluir o jogo.");
      console.error(error);
    }
  };

  const startEdit = (game) => {
    setEditingId(game._id);
    setEditForm({
      title: game.title,
      year: game.year,
      price: game.price,
      genre: game.descriptions[0]?.genre || '',
      platform: game.descriptions[0]?.platform || '',
      rating: game.descriptions[0]?.rating || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: '', year: '', price: '', genre: '', platform: '', rating: '' });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const updatedGame = {
        title: editForm.title,
        year: editForm.year,
        price: editForm.price,
        descriptions: [{
          genre: editForm.genre,
          platform: editForm.platform,
          rating: editForm.rating,
        }],
      };
      await axios.put(`${apiUrl}/games/${id}`, updatedGame);
      setGames((prev) => prev.map((game) => game._id === id ? { ...game, ...updatedGame } : game));
      cancelEdit();
    } catch (error) {
      alert("Erro ao editar o jogo.");
      console.error(error);
    }
  };

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className={styles.homeContent}>
        <div className={styles.listGamesCard}>
          <div className={styles.title}>
            <h2>Lista de jogos</h2>
          </div>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Pesquisar por nome do jogo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Loading loading={loading}/>
          <div className={styles.games} id={styles.games}>
            {Array.isArray(filteredGames) && filteredGames.map((game) => (
              <ul key={game._id} className={styles.listGames}>
                <li className={styles.gameImg}>
                  <img src="images/game_cd_cover.png" alt="jogo em estoque" />
                </li>
                <li className={styles.gameInfo}>
                  {editingId === game._id ? (
                    <form className={styles.editForm} onSubmit={e => { e.preventDefault(); handleEditSave(game._id); }}>
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        placeholder="Título"
                        className={styles.editInput}
                        required
                      />
                      <input
                        type="number"
                        name="year"
                        value={editForm.year}
                        onChange={handleEditChange}
                        placeholder="Ano"
                        className={styles.editInput}
                        required
                      />
                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditChange}
                        placeholder="Preço"
                        className={styles.editInput}
                        required
                      />
                      <input
                        type="text"
                        name="genre"
                        value={editForm.genre}
                        onChange={handleEditChange}
                        placeholder="Gênero"
                        className={styles.editInput}
                        required
                      />
                      <input
                        type="text"
                        name="platform"
                        value={editForm.platform}
                        onChange={handleEditChange}
                        placeholder="Plataforma"
                        className={styles.editInput}
                        required
                      />
                      <input
                        type="text"
                        name="rating"
                        value={editForm.rating}
                        onChange={handleEditChange}
                        placeholder="Classificação"
                        className={styles.editInput}
                        required
                      />
                      <div className={styles.editActions}>
                        <button type="submit" className={styles.saveBtn}>Salvar</button>
                        <button type="button" className={styles.cancelBtn} onClick={cancelEdit}>Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3>{game.title}</h3>
                      <span>Ano: {game.year}</span>
                      <span>Preço: {game.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                      {Array.isArray(game.descriptions) && game.descriptions.length > 0 && (
                        <div className={styles.descriptions}>
                          <span>Gênero: {game.descriptions[0].genre}</span>
                          <span>Plataforma: {game.descriptions[0].platform}</span>
                          <span>Classificação: {game.descriptions[0].rating}</span>
                        </div>
                      )}
                      <button
                        className={styles.editBtn}
                        onClick={() => startEdit(game)}
                      >
                        Editar
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(game._id)}
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </li>
              </ul>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeContent;