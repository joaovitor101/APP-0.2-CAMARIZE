# APP-0.2-CAMARIZE

## ⚙️ Como Rodar o Projeto (Docker)

1. **Clone o repositório e acesse a pasta do projeto:**
   ```sh
   git clone <url-do-repo>
   cd APP-0.2-CAMARIZE
   ```

2. **Suba todos os serviços:**
   ```sh
   docker-compose up -d --build
   ```

3. **Acesse no navegador:**
   - Front-end: [http://localhost:3001](http://localhost:3001)
   - API: [http://localhost:4000/games](http://localhost:4000/games)
   - MongoDB: `mongodb://localhost:27017/camarize` (pode usar o MongoDB Compass)

---

## 🛠️ Variáveis de Ambiente

- **API:**  
  - `MONGO_URL=mongodb://mongo-api:27017/camarize` (definida no docker-compose.yml)

- **Front-end:**  
  - `NEXT_PUBLIC_API_URL=http://localhost:4000` (definida no docker-compose.yml)

---

## 🖥️ Funcionalidades

- Cadastro de jogos (título, ano, preço, gênero, plataforma, classificação)
- Listagem de jogos com visual moderno e sofisticado
- Edição inline de jogos
- Exclusão de jogos com confirmação
- Pesquisa em tempo real pelo nome do jogo
- Visualização de campos aninhados (`descriptions`)
- Integração total via API RESTful
- Banco de dados persistente com MongoDB

---

## 📑 Exemplos de Endpoints da API

### Listar todos os jogos

**Resposta:**
```json
[
  {
    "_id": "abc123...",
    "title": "Jogo Exemplo",
    "year": 2024,
    "price": 99.9,
    "descriptions": [
      {
        "genre": "Ação",
        "platform": "PC",
        "rating": "Livre",
        "_id": "def456..."
      }
    ],
    "__v": 0
  }
]
```

### Cadastrar um novo jogo

**Resposta:**
```json
POST /games
Content-Type: application/json
{
"title": "Novo Jogo",
"year": 2025,
"price": 120,
"descriptions": {
"genre": "Aventura",
"platform": "PS5",
"rating": "12+"
}
}
```

### Editar um jogo

**Resposta:**

```json
PUT /games/:id
Content-Type: application/json
{
"title": "Jogo Editado",
"year": 2026,
"price": 150,
"descriptions": [{
"genre": "RPG",
"platform": "Xbox",
"rating": "16+"
}]
}
```

### Excluir um jogo

**Resposta:**

```json
DELETE /games/:id
```

---

## 🔍 Pesquisa no Front-end

- Campo de busca acima da lista de jogos.
- Filtra em tempo real pelo nome do jogo (case-insensitive).

---

## 🗃️ Como Migrar Dados do MongoDB

### Exportar (no computador de origem)
```sh
docker exec mongo-api mongodump --db camarize --out /data/db/dump
docker cp mongo-api:/data/db/dump ./dump
```

### Importar (no computador de destino)
```sh
docker cp ./dump mongo-api:/data/db/dump
docker exec -it mongo-api mongorestore --db camarize /data/db/dump/camarize
```

---

## 🔒 Boas Práticas de Segurança

- **Nunca suba arquivos de dump ou backups de banco de dados em repositórios públicos.**
- Use `.gitignore` para proteger arquivos sensíveis:
  ```
  dump/
  *.bson
  *.json
  ```
- Para deploy em produção, utilize variáveis de ambiente seguras e configure o acesso ao banco de dados apenas para IPs autorizados.

---

## 🏠 Rodando em outro computador

1. Instale o Docker Desktop.
2. Copie o projeto para o novo computador.
3. Rode `docker-compose up -d --build`.
4. Acesse normalmente pelo navegador.

Se quiser migrar os dados, use o procedimento de dump/restore acima.

---

## 📞 Contato

Dúvidas, sugestões ou problemas?  
Entre em contato com o mantenedor do projeto.

---





