import fazendaService from "../services/fazendaService.js";

// Função para cadastrar fazenda (padrão Express)
const createFazenda = async (req, res) => {
  try {
    console.log("Body recebido:", req.body);
    const result = await fazendaService.Create(
      req.body.nome,
      req.body.rua,
      req.body.bairro,
      req.body.cidade,
      req.body.numero
    );
    if (!result) {
      return res.status(500).json({ error: "Falha ao salvar no banco." });
    }
    res.status(201).json({ message: "Fazenda criada com sucesso!" });
  } catch (error) {
    console.log("Erro no controller:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const getAllFazendas = async (req, res) => {
  try {
    const farms = await fazendaService.getAll();
    res.status(200).json(farms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar fazendas." });
  }
};

const getFazendaById = async (req, res) => {
  try {
    const fazenda = await fazendaService.getById(req.params.id);
    if (!fazenda) return res.status(404).json({ error: "Fazenda não encontrada" });
    res.json(fazenda);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar foto da fazenda
const updateFotoFazenda = async (req, res) => {
  try {
    const { id } = req.params;
    const { foto_sitio } = req.body;
    const fazenda = await fazendaService.updateFoto(id, foto_sitio);
    if (!fazenda) return res.status(404).json({ error: "Fazenda não encontrada" });
    res.json({ message: "Foto da fazenda atualizada com sucesso!", fazenda });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET foto da fazenda
const getFotoFazenda = async (req, res) => {
  try {
    const { id } = req.params;
    const fazenda = await fazendaService.getById(id);
    if (!fazenda || !fazenda.foto_sitio) {
      return res.status(404).send("Sem foto");
    }
    res.json({ foto: fazenda.foto_sitio });
  } catch (err) {
    res.status(500).send("Erro ao buscar foto");
  }
};

export default { createFazenda, getAllFazendas, getFazendaById, updateFotoFazenda, getFotoFazenda }; 