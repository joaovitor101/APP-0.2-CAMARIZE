import ParametrosAtuais from "../models/Parametros_atuais.js";
import Cativeiros from "../models/Cativeiros.js";

// Buscar dados atuais de um cativeiro específico
const getParametrosAtuais = async (req, res) => {
  try {
    const { cativeiroId } = req.params;
    
    if (!cativeiroId) {
      return res.status(400).json({ error: "ID do cativeiro é obrigatório" });
    }

    // Busca o cativeiro para verificar se existe
    const cativeiro = await Cativeiros.findById(cativeiroId);
    if (!cativeiro) {
      return res.status(404).json({ error: "Cativeiro não encontrado" });
    }

    // Busca o parâmetro mais recente do cativeiro
    const parametroAtual = await ParametrosAtuais.findOne({ 
      id_cativeiro: cativeiroId 
    }).sort({ datahora: -1 });

    // Se não há dados, usa valores padrão
    const parametros = parametroAtual ? {
      temperatura: parametroAtual.temp_atual,
      ph: parametroAtual.ph_atual,
      amonia: parametroAtual.amonia_atual,
      datahora: parametroAtual.datahora
    } : {
      temperatura: "#",
      ph: "#",
      amonia: "#",
      datahora: new Date()
    };

    res.json({
      cativeiro: {
        id: cativeiro._id,
        nome: cativeiro.nome
      },
      parametros: parametros
    });

  } catch (error) {
    console.error('Erro ao buscar parâmetros atuais:', error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Buscar dados históricos dos últimos 7 dias
const getParametrosHistoricos = async (req, res) => {
  try {
    const { cativeiroId } = req.params;
    const { dias = 7 } = req.query;
    
    if (!cativeiroId) {
      return res.status(400).json({ error: "ID do cativeiro é obrigatório" });
    }

    // Busca o cativeiro para verificar se existe
    const cativeiro = await Cativeiros.findById(cativeiroId);
    if (!cativeiro) {
      return res.status(404).json({ error: "Cativeiro não encontrado" });
    }

    // Calcula a data limite (X dias atrás)
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - parseInt(dias));

    // Busca os parâmetros dos últimos X dias
    const parametros = await ParametrosAtuais.find({
      id_cativeiro: cativeiroId,
      datahora: { $gte: dataLimite }
    }).sort({ datahora: 1 });

    // Se não há dados históricos, retorna array vazio
    if (parametros.length === 0) {
      return res.json({
        cativeiro: {
          id: cativeiro._id,
          nome: cativeiro.nome
        },
        dados: []
      });
    }

    // Agrupa os dados por dia para o gráfico
    const dadosPorDia = {};
    parametros.forEach(parametro => {
      const data = new Date(parametro.datahora);
      const dia = data.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!dadosPorDia[dia]) {
        dadosPorDia[dia] = {
          temperatura: [],
          ph: [],
          amonia: []
        };
      }
      
      dadosPorDia[dia].temperatura.push(parametro.temp_atual);
      dadosPorDia[dia].ph.push(parametro.ph_atual);
      dadosPorDia[dia].amonia.push(parametro.amonia_atual);
    });

    // Calcula médias diárias
    const dadosMedios = Object.keys(dadosPorDia).map(dia => {
      const dados = dadosPorDia[dia];
      return {
        data: dia,
        temperatura: dados.temperatura.reduce((a, b) => a + b, 0) / dados.temperatura.length,
        ph: dados.ph.reduce((a, b) => a + b, 0) / dados.ph.length,
        amonia: dados.amonia.reduce((a, b) => a + b, 0) / dados.amonia.length
      };
    });

    res.json({
      cativeiro: {
        id: cativeiro._id,
        nome: cativeiro.nome
      },
      periodo: `${dias} dias`,
      dados: dadosMedios
    });

  } catch (error) {
    console.error('Erro ao buscar parâmetros históricos:', error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Buscar dados para o dashboard (atual + histórico resumido)
const getDadosDashboard = async (req, res) => {
  try {
    const { cativeiroId } = req.params;
    
    if (!cativeiroId) {
      return res.status(400).json({ error: "ID do cativeiro é obrigatório" });
    }

    // Busca o cativeiro
    const cativeiro = await Cativeiros.findById(cativeiroId);
    if (!cativeiro) {
      return res.status(404).json({ error: "Cativeiro não encontrado" });
    }

    // Busca o parâmetro mais recente
    const parametroAtual = await ParametrosAtuais.findOne({ 
      id_cativeiro: cativeiroId 
    }).sort({ datahora: -1 });

    // Se não há dados, usa valores padrão
    const dadosAtuais = parametroAtual ? {
      temperatura: parametroAtual.temp_atual,
      ph: parametroAtual.ph_atual,
      amonia: parametroAtual.amonia_atual,
      datahora: parametroAtual.datahora
    } : {
      temperatura: "#",
      ph: "#",
      amonia: "#",
      datahora: new Date()
    };

    // Busca dados dos últimos 7 dias para o gráfico
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 7);

    const parametrosHistoricos = await ParametrosAtuais.find({
      id_cativeiro: cativeiroId,
      datahora: { $gte: dataLimite }
    }).sort({ datahora: 1 });

    // Agrupa por dia e calcula médias
    const dadosPorDia = {};
    parametrosHistoricos.forEach(parametro => {
      const data = new Date(parametro.datahora);
      const dia = data.toISOString().split('T')[0];
      
      if (!dadosPorDia[dia]) {
        dadosPorDia[dia] = {
          temperatura: [],
          ph: [],
          amonia: []
        };
      }
      
      dadosPorDia[dia].temperatura.push(parametro.temp_atual);
      dadosPorDia[dia].ph.push(parametro.ph_atual);
      dadosPorDia[dia].amonia.push(parametro.amonia_atual);
    });

    // Calcula médias diárias para os últimos 7 dias
    const dadosSemanais = [];
    for (let i = 6; i >= 0; i--) {
      const data = new Date();
      data.setDate(data.getDate() - i);
      const dia = data.toISOString().split('T')[0];
      
      if (dadosPorDia[dia]) {
        const dados = dadosPorDia[dia];
        dadosSemanais.push({
          temperatura: dados.temperatura.reduce((a, b) => a + b, 0) / dados.temperatura.length,
          ph: dados.ph.reduce((a, b) => a + b, 0) / dados.ph.length,
          amonia: dados.amonia.reduce((a, b) => a + b, 0) / dados.amonia.length
        });
      } else {
        // Se não há dados para este dia, usa valores padrão
        dadosSemanais.push({
          temperatura: "#",
          ph: "#",
          amonia: "#"
        });
      }
    }

    res.json({
      cativeiro: {
        id: cativeiro._id,
        nome: cativeiro.nome
      },
      dadosAtuais: dadosAtuais,
      dadosSemanais: dadosSemanais
    });

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export {
  getParametrosAtuais,
  getParametrosHistoricos,
  getDadosDashboard
}; 