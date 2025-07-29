import cativeiroService from "../services/cativeiroService.js";
import TiposCamarao from "../models/Camaroes.js";
import CondicoesIdeais from "../models/Condicoes_ideais.js";
import FazendasxCativeiros from "../models/FazendasxCativeiros.js";

const createCativeiro = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.foto_cativeiro = req.file.buffer;
    }
    // Cria a condição ideal usando os campos de monitoramento diário
    const condicao = await CondicoesIdeais.create({
      id_tipo_camarao: data.id_tipo_camarao,
      temp_ideal: data.temp_media_diaria,
      ph_ideal: data.ph_medio_diario,
      amonia_ideal: data.amonia_media_diaria
    });
    data.condicoes_ideais = condicao._id;
    // Deixa os campos de monitoramento diário do cativeiro como null
    data.temp_media_diaria = null;
    data.ph_medio_diario = null;
    data.amonia_media_diaria = null;
    const result = await cativeiroService.Create(data);
    if (!result) {
      return res.status(500).json({ error: "Falha ao salvar no banco." });
    }
    // Cria o relacionamento na tabela intermediária
    await FazendasxCativeiros.create({ fazenda: req.body.fazendaId, cativeiro: result._id });
    res.status(201).json({ message: "Cativeiro criado com sucesso!" });
  } catch (error) {
    console.log("Erro no controller:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const getAllCativeiros = async (req, res) => {
  try {
    const usuarioId = req.loggedUser?.id;
    const cativeiros = await cativeiroService.getAllByUsuarioViaRelacionamentos(usuarioId);
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

const getCativeiroById = async (req, res) => {
  try {
    const { id } = req.params;
    const cativeiro = await cativeiroService.getById(id);
    if (!cativeiro) {
      return res.status(404).json({ error: 'Cativeiro não encontrado.' });
    }
    res.status(200).json(cativeiro);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cativeiro.' });
  }
};

const updateCativeiro = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    
    if (req.file) {
      data.foto_cativeiro = req.file.buffer;
    }

    // Se houver mudança no tipo de camarão, atualizar as condições ideais
    if (data.id_tipo_camarao) {
      const condicao = await CondicoesIdeais.create({
        id_tipo_camarao: data.id_tipo_camarao,
        temp_ideal: data.temp_media_diaria,
        ph_ideal: data.ph_medio_diario,
        amonia_ideal: data.amonia_media_diaria
      });
      data.condicoes_ideais = condicao._id;
      // Remove os campos de monitoramento diário
      data.temp_media_diaria = null;
      data.ph_medio_diario = null;
      data.amonia_media_diaria = null;
    }

    const result = await cativeiroService.update(id, data);
    if (!result) {
      return res.status(404).json({ error: 'Cativeiro não encontrado.' });
    }
    res.status(200).json({ message: 'Cativeiro atualizado com sucesso!', cativeiro: result });
  } catch (error) {
    console.log("Erro no controller:", error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const deleteCativeiro = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await cativeiroService.delete(id);
    if (!result) {
      return res.status(404).json({ error: 'Cativeiro não encontrado.' });
    }
    res.status(200).json({ message: 'Cativeiro deletado com sucesso!' });
  } catch (error) {
    console.log("Erro no controller:", error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const getAllCondicoesIdeais = async (req, res) => {
  try {
    const condicoes = await CondicoesIdeais.find().populate('id_tipo_camarao');
    res.status(200).json(condicoes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar condições ideais." });
  }
};

export default { createCativeiro, getAllCativeiros, getAllTiposCamarao, getCativeiroById, updateCativeiro, deleteCativeiro, getAllCondicoesIdeais }; 