import cativeiroService from "../services/cativeiroService.js";
import TiposCamarao from "../models/Camaroes.js";
import CondicoesIdeais from "../models/Condicoes_ideais.js";
import FazendasxCativeiros from "../models/FazendasxCativeiros.js";
import SensoresxCativeiros from "../models/SensoresxCativeiros.js";

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
    
    // Cria o relacionamento na tabela intermediária fazenda-cativeiro
    await FazendasxCativeiros.create({ fazenda: req.body.fazendaId, cativeiro: result._id });
    
    // Cria os relacionamentos sensor-cativeiro para todos os sensores fornecidos
    console.log('🔍 Verificando sensores na criação:', {
      sensorIds: req.body.sensorIds,
      sensorId: req.body.sensorId,
      isArray: Array.isArray(req.body.sensorIds),
      bodyKeys: Object.keys(req.body)
    });
    
    // Processa os sensores fornecidos
    let sensoresParaProcessar = [];
    
    // Verifica se sensorIds é um array (JSON) ou string única (FormData)
    if (req.body.sensorIds) {
      if (Array.isArray(req.body.sensorIds)) {
        // Dados enviados como JSON
        sensoresParaProcessar = req.body.sensorIds;
        console.log('📦 Processando sensorIds como array JSON:', sensoresParaProcessar);
      } else if (typeof req.body.sensorIds === 'string') {
        // Dados enviados como FormData - pode ser string única ou múltiplas
        sensoresParaProcessar = [req.body.sensorIds];
        console.log('📦 Processando sensorIds como string FormData:', sensoresParaProcessar);
      }
    }
    
         if (sensoresParaProcessar.length > 0) {
       try {
         // Filtra apenas sensores válidos e remove duplicatas
         const sensoresValidos = [...new Set(sensoresParaProcessar.filter(sensorId => sensorId && sensorId !== ""))];
         
         if (sensoresValidos.length > 0) {
           // Cria novas relações para todos os sensores válidos
           const relacoes = [];
           for (const sensorId of sensoresValidos) {
             const relacao = await SensoresxCativeiros.create({
               id_sensor: sensorId,
               id_cativeiro: result._id
             });
             relacoes.push(relacao);
             console.log(`✅ Relação sensor-cativeiro criada: Sensor ${sensorId} -> Cativeiro ${result._id}`);
           }
           console.log(`📝 Total de relações criadas: ${relacoes.length}`);
         } else {
           console.log('⚠️  Nenhum sensor válido fornecido no cadastro');
         }
      } catch (error) {
        console.error('❌ Erro ao criar relações sensor-cativeiro:', error.message);
      }
    } else if (req.body.sensorId && req.body.sensorId !== "") {
      // Fallback para compatibilidade com sensorId único
      try {
        const relacao = await SensoresxCativeiros.create({
          id_sensor: req.body.sensorId,
          id_cativeiro: result._id
        });
        console.log(`✅ Relação sensor-cativeiro criada: Sensor ${req.body.sensorId} -> Cativeiro ${result._id}`);
      } catch (error) {
        console.error('❌ Erro ao criar relação sensor-cativeiro:', error.message);
      }
    } else {
      console.log('⚠️  Nenhum sensor fornecido no cadastro');
    }
    
    res.status(201).json({ 
      message: "Cativeiro criado com sucesso!",
      cativeiroId: result._id,
      sensorRelacionado: req.body.sensorId ? true : false
    });
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
    console.log('🔍 Buscando cativeiro por ID:', id);
    
    const cativeiro = await cativeiroService.getById(id);
    if (!cativeiro) {
      return res.status(404).json({ error: 'Cativeiro não encontrado.' });
    }
    
    console.log('📊 Dados do cativeiro antes do JSON:');
    console.log('  ID:', cativeiro._id);
    console.log('  Fazenda:', cativeiro.fazenda);
    console.log('  Sensores:', cativeiro.sensores ? cativeiro.sensores.length : 0);
    
    if (cativeiro.sensores && cativeiro.sensores.length > 0) {
      console.log('  Detalhes dos sensores:');
      cativeiro.sensores.forEach((sensor, index) => {
        console.log(`    ${index + 1}. ${sensor.apelido} (${sensor.id_tipo_sensor}) - ID: ${sensor._id}`);
      });
    }
    
    res.status(200).json(cativeiro);
  } catch (error) {
    console.error('❌ Erro no getCativeiroById:', error);
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

    // Atualiza as relações sensor-cativeiro se sensores foram fornecidos
    console.log('🔍 Dados recebidos na edição:', {
      sensorIds: req.body.sensorIds,
      sensorId: req.body.sensorId,
      isArray: Array.isArray(req.body.sensorIds),
      bodyKeys: Object.keys(req.body)
    });
    
    // Sempre remove relações anteriores primeiro
    await SensoresxCativeiros.deleteMany({ id_cativeiro: id });
    console.log(`🗑️  Relações anteriores removidas para cativeiro ${id}`);
    
    // Processa os sensores fornecidos
    let sensoresParaProcessar = [];
    
    // Verifica se sensorIds é um array (JSON) ou string única (FormData)
    if (req.body.sensorIds) {
      if (Array.isArray(req.body.sensorIds)) {
        // Dados enviados como JSON
        sensoresParaProcessar = req.body.sensorIds;
        console.log('📦 Processando sensorIds como array JSON:', sensoresParaProcessar);
      } else if (typeof req.body.sensorIds === 'string') {
        // Dados enviados como FormData - pode ser string única ou múltiplas
        sensoresParaProcessar = [req.body.sensorIds];
        console.log('📦 Processando sensorIds como string FormData:', sensoresParaProcessar);
      }
    }
    
         if (sensoresParaProcessar.length > 0) {
       try {
         // Filtra apenas sensores válidos e remove duplicatas
         const sensoresValidos = [...new Set(sensoresParaProcessar.filter(sensorId => sensorId && sensorId !== ""))];
         
         if (sensoresValidos.length > 0) {
           // Cria novas relações para todos os sensores válidos
           const relacoes = [];
           for (const sensorId of sensoresValidos) {
             const relacao = await SensoresxCativeiros.create({
               id_sensor: sensorId,
               id_cativeiro: id
             });
             relacoes.push(relacao);
             console.log(`✅ Relação sensor-cativeiro atualizada: Sensor ${sensorId} -> Cativeiro ${id}`);
           }
           console.log(`📝 Total de relações atualizadas: ${relacoes.length}`);
         } else {
           console.log('⚠️  Nenhum sensor válido fornecido na edição');
         }
      } catch (error) {
        console.error('❌ Erro ao atualizar relações sensor-cativeiro:', error.message);
      }
    } else if (req.body.sensorId && req.body.sensorId !== "") {
      // Fallback para compatibilidade com sensorId único
      try {
        const relacao = await SensoresxCativeiros.create({
          id_sensor: req.body.sensorId,
          id_cativeiro: id
        });
        console.log(`✅ Relação sensor-cativeiro atualizada: Sensor ${req.body.sensorId} -> Cativeiro ${id}`);
      } catch (error) {
        console.error('❌ Erro ao atualizar relação sensor-cativeiro:', error.message);
      }
    } else {
      console.log('⚠️  Nenhum sensor fornecido na edição - todas as relações foram removidas');
    }

    res.status(200).json({ 
      message: 'Cativeiro atualizado com sucesso!', 
      cativeiro: result,
      sensorRelacionado: req.body.sensorId ? true : false
    });
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

const getSensoresCativeiro = async (req, res) => {
  try {
    const { cativeiroId } = req.params;
    const sensores = await SensoresxCativeiros.find({ id_cativeiro: cativeiroId })
      .populate('id_sensor')
      .populate('id_cativeiro');
    res.status(200).json(sensores);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar sensores do cativeiro." });
  }
};

export default { createCativeiro, getAllCativeiros, getAllTiposCamarao, getCativeiroById, updateCativeiro, deleteCativeiro, getAllCondicoesIdeais, getSensoresCativeiro }; 