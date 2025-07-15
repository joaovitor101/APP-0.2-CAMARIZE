import fazendaService from "../services/fazendaService.js";

// Função para cadastrar fazenda (padrão Express)


const createFarm = async (req, res) => {
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

const getAllFarms = async (req, res) => {
  try {
    const farms = await fazendaService.getAll();
    res.status(200).json(farms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar fazendas." });
  }
};


export default { createFarm, getAllFarms }; 