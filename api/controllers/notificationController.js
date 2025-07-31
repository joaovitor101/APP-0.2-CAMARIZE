import ParametrosAtuais from "../models/Parametros_atuais.js";
import CondicoesIdeais from "../models/Condicoes_ideais.js";
import Cativeiros from "../models/Cativeiros.js";

// Função para gerar notificações baseadas na comparação de dados
const generateNotifications = async () => {
  try {
    const notifications = [];
    
    // Busca todos os cativeiros com seus parâmetros atuais e condições ideais
    const cativeiros = await Cativeiros.find()
      .populate('condicoes_ideais')
      .populate('id_tipo_camarao');
    
    for (const cativeiro of cativeiros) {
      // Busca o parâmetro atual mais recente para este cativeiro
      const parametroAtual = await ParametrosAtuais.findOne({ 
        id_cativeiro: cativeiro._id 
      }).sort({ datahora: -1 });
      
      if (!parametroAtual || !cativeiro.condicoes_ideais) {
        continue; // Pula se não há dados para comparar
      }
      
      const condicaoIdeal = cativeiro.condicoes_ideais;
      
      // Tolerâncias mais realistas por parâmetro
      const toleranciaTemp = 0.15; // 15% para temperatura
      const toleranciaPh = 0.2;    // 20% para pH
      const toleranciaAmonia = 0.25; // 25% para amônia
      
      // Compara temperatura
      if (condicaoIdeal.temp_ideal) {
        const diffTemp = Math.abs(parametroAtual.temp_atual - condicaoIdeal.temp_ideal);
        const toleranciaTempValor = condicaoIdeal.temp_ideal * toleranciaTemp;
        
        if (diffTemp > toleranciaTempValor) {
          const tipo = parametroAtual.temp_atual > condicaoIdeal.temp_ideal ? 'aumento' : 'diminuição';
          notifications.push({
            id: `temp_${cativeiro._id}_${parametroAtual._id}`,
            tipo: 'temperatura',
            cativeiro: cativeiro._id,
            cativeiroNome: cativeiro.nome || `Cativeiro ${cativeiro._id}`,
            valorAtual: parametroAtual.temp_atual,
            valorIdeal: condicaoIdeal.temp_ideal,
            diferenca: diffTemp,
            mensagem: `Temperatura com ${tipo}! Atual: ${parametroAtual.temp_atual}°C, Ideal: ${condicaoIdeal.temp_ideal}°C`,
            datahora: parametroAtual.datahora,
            severidade: diffTemp > toleranciaTempValor * 2 ? 'alta' : 'media'
          });
        }
      }
      
      // Compara pH
      if (condicaoIdeal.ph_ideal) {
        const diffPh = Math.abs(parametroAtual.ph_atual - condicaoIdeal.ph_ideal);
        const toleranciaPhValor = condicaoIdeal.ph_ideal * toleranciaPh;
        
        if (diffPh > toleranciaPhValor) {
          const tipo = parametroAtual.ph_atual > condicaoIdeal.ph_ideal ? 'aumento' : 'diminuição';
          notifications.push({
            id: `ph_${cativeiro._id}_${parametroAtual._id}`,
            tipo: 'ph',
            cativeiro: cativeiro._id,
            cativeiroNome: cativeiro.nome || `Cativeiro ${cativeiro._id}`,
            valorAtual: parametroAtual.ph_atual,
            valorIdeal: condicaoIdeal.ph_ideal,
            diferenca: diffPh,
            mensagem: `pH com ${tipo}! Atual: ${parametroAtual.ph_atual}, Ideal: ${condicaoIdeal.ph_ideal}`,
            datahora: parametroAtual.datahora,
            severidade: diffPh > toleranciaPhValor * 2 ? 'alta' : 'media'
          });
        }
      }
      
      // Compara amônia
      if (condicaoIdeal.amonia_ideal) {
        const diffAmonia = Math.abs(parametroAtual.amonia_atual - condicaoIdeal.amonia_ideal);
        const toleranciaAmoniaValor = condicaoIdeal.amonia_ideal * toleranciaAmonia;
        
        if (diffAmonia > toleranciaAmoniaValor) {
          const tipo = parametroAtual.amonia_atual > condicaoIdeal.amonia_ideal ? 'aumento' : 'diminuição';
          notifications.push({
            id: `amonia_${cativeiro._id}_${parametroAtual._id}`,
            tipo: 'amonia',
            cativeiro: cativeiro._id,
            cativeiroNome: cativeiro.nome || `Cativeiro ${cativeiro._id}`,
            valorAtual: parametroAtual.amonia_atual,
            valorIdeal: condicaoIdeal.amonia_ideal,
            diferenca: diffAmonia,
            mensagem: `Nível de amônia com ${tipo}! Atual: ${parametroAtual.amonia_atual}mg/L, Ideal: ${condicaoIdeal.amonia_ideal}mg/L`,
            datahora: parametroAtual.datahora,
            severidade: diffAmonia > toleranciaAmoniaValor * 2 ? 'alta' : 'media'
          });
        }
      }
    }
    
    // Ordena por data/hora (mais recentes primeiro)
    notifications.sort((a, b) => new Date(b.datahora) - new Date(a.datahora));
    
    return notifications;
  } catch (error) {
    console.error('Erro ao gerar notificações:', error);
    return [];
  }
};

// Controller para buscar notificações
const getNotifications = async (req, res) => {
  try {
    const notifications = await generateNotifications();
    
    res.status(200).json({
      success: true,
      notifications: notifications,
      total: notifications.length
    });
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
};

// Controller para buscar notificações de um cativeiro específico
const getNotificationsByCativeiro = async (req, res) => {
  try {
    const { cativeiroId } = req.params;
    
    const notifications = await generateNotifications();
    const filteredNotifications = notifications.filter(
      notification => notification.cativeiro.toString() === cativeiroId
    );
    
    res.status(200).json({
      success: true,
      notifications: filteredNotifications,
      total: filteredNotifications.length
    });
  } catch (error) {
    console.error('Erro ao buscar notificações do cativeiro:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
};

export default {
  getNotifications,
  getNotificationsByCativeiro,
  generateNotifications
}; 