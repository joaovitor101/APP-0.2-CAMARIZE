import cativeiroService from "../services/cativeiroService.js";
import TiposCamarao from "../models/Camaroes.js";

const createCativeiro = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.foto_cativeiro = req.file.buffer;
    }
    const result = await cativeiroService.Create(data);
    if (!result) {
      return res.status(500).json({ error: "Falha ao salvar no banco." });
    }
    res.status(201).json({ message: "Cativeiro criado com sucesso!" });
  } catch (error) {
    console.log("Erro no controller:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const getAllCativeiros = async (req, res) => {
  try {
    const cativeiros = await cativeiroService.getAll();
    res.status(200).json(cativeiros);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar cativeiros." });
  }
};

const getAllTiposCamarao = async (req, res) => {
  try {
    const tipos = await TiposCamarao.find();
    res.status(200).json(tipos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tipos de camarão." });
  }
};

export default { createCativeiro, getAllCativeiros, getAllTiposCamarao }; 