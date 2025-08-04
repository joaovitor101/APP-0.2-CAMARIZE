import ParametrosAtuais from "../models/Parametros_atuais.js";
import CondicoesIdeais from "../models/Condicoes_ideais.js";
import Cativeiros from "../models/Cativeiros.js";
import PushSubscription from "../models/PushSubscriptions.js";

// Configuração VAPID
const VAPID_PUBLIC_KEY = "BHRkSsllT2m1OmHkc6xsGdN7CpJFm0zHrfDuA4xh14kMt750uWzOsSNc5tI7wUS3Y_qYF6CjBBfyfIrlZgCY9cs";
const VAPID_PRIVATE_KEY = "UU6vhFAQVPc-dKZhBncvxTaIQhibrrmqZKlO72f_t8o";

// Função para enviar notificações push
const sendPushNotification = async (subscription, notificationData) => {
  try {
    const webpush = await import('web-push');
    
    // Configurar VAPID
    webpush.default.setVapidDetails(
      'mailto:camarize@example.com',
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    );
    
    const payload = JSON.stringify({
      title: 'Camarize - Alerta',
      body: notificationData.mensagem,
      icon: '/images/logo_camarize1.png',
      badge: '/images/logo_camarize2.png',
      data: {
        url: `/rel-individual/${notificationData.cativeiro}`,
        cativeiroId: notificationData.cativeiro,
        tipo: notificationData.tipo,
        severidade: notificationData.severidade
      }
    });

    await webpush.default.sendNotification(subscription, payload);
    console.log('✅ Notificação push enviada:', notificationData.mensagem);
  } catch (error) {
    console.error('❌ Erro ao enviar notificação push:', error);
  }
};

// Função para enviar notificações push para todos os usuários inscritos
const sendNotificationsToAllSubscribers = async (notificationData) => {
  try {
    console.log('📱 Enviando notificação push para todos os inscritos:', notificationData.mensagem);
    
    // Buscar todas as subscriptions ativas
    const subscriptions = await PushSubscription.find({ isActive: true });
    
    console.log(`📊 Encontradas ${subscriptions.length} subscriptions ativas`);
    
    // Enviar para cada subscription
    for (const sub of subscriptions) {
      try {
        await sendPushNotification(sub.subscription, notificationData);
      } catch (error) {
        console.error(`❌ Erro ao enviar para subscription ${sub._id}:`, error);
        
        // Se a subscription está inválida, marcar como inativa
        if (error.statusCode === 410) {
          await PushSubscription.findByIdAndUpdate(sub._id, { isActive: false });
          console.log(`🗑️ Subscription ${sub._id} marcada como inativa`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Erro ao enviar notificações push:', error);
  }
};

// Função para gerar notificações baseadas na comparação de dados
const generateNotifications = async (usuarioId = null) => {
  try {
    const notifications = [];
    
    let cativeiros;
    
    if (usuarioId) {
      // Se um usuário foi especificado, busca apenas os cativeiros do usuário
      const cativeiroService = (await import('../services/cativeiroService.js')).default;
      cativeiros = await cativeiroService.getAllByUsuarioViaRelacionamentos(usuarioId);
    } else {
      // Se não, busca todos os cativeiros (comportamento original)
      cativeiros = await Cativeiros.find()
        .populate('condicoes_ideais')
        .populate('id_tipo_camarao');
    }
    
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
          const notificationData = {
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
          };
          
          notifications.push(notificationData);
          
          // Enviar notificação push automaticamente
          await sendNotificationsToAllSubscribers(notificationData);
        }
      }
      
      // Compara pH
      if (condicaoIdeal.ph_ideal) {
        const diffPh = Math.abs(parametroAtual.ph_atual - condicaoIdeal.ph_ideal);
        const toleranciaPhValor = condicaoIdeal.ph_ideal * toleranciaPh;
        
        if (diffPh > toleranciaPhValor) {
          const tipo = parametroAtual.ph_atual > condicaoIdeal.ph_ideal ? 'aumento' : 'diminuição';
          const notificationData = {
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
          };
          
          notifications.push(notificationData);
          
          // Enviar notificação push automaticamente
          await sendNotificationsToAllSubscribers(notificationData);
        }
      }
      
      // Compara amônia
      if (condicaoIdeal.amonia_ideal) {
        const diffAmonia = Math.abs(parametroAtual.amonia_atual - condicaoIdeal.amonia_ideal);
        const toleranciaAmoniaValor = condicaoIdeal.amonia_ideal * toleranciaAmonia;
        
        if (diffAmonia > toleranciaAmoniaValor) {
          const tipo = parametroAtual.amonia_atual > condicaoIdeal.amonia_ideal ? 'aumento' : 'diminuição';
          const notificationData = {
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
          };
          
          notifications.push(notificationData);
          
          // Enviar notificação push automaticamente
          await sendNotificationsToAllSubscribers(notificationData);
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
    const usuarioId = req.loggedUser?.id;
    const notifications = await generateNotifications(usuarioId);
    
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
    const usuarioId = req.loggedUser?.id;
    
    const notifications = await generateNotifications(usuarioId);
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

// Controller para inscrever em notificações push
const subscribeToPush = async (req, res) => {
  try {
    const { subscription, userId, deviceInfo } = req.body;
    
    // Verificar se já existe uma subscription para este endpoint
    const existingSubscription = await PushSubscription.findOne({
      'subscription.endpoint': subscription.endpoint
    });
    
    if (existingSubscription) {
      // Atualizar subscription existente
      await PushSubscription.findByIdAndUpdate(existingSubscription._id, {
        userId: userId,
        subscription: subscription,
        deviceInfo: deviceInfo,
        isActive: true,
        createdAt: new Date()
      });
      console.log('✅ Subscription atualizada:', subscription.endpoint);
    } else {
      // Criar nova subscription
      await PushSubscription.create({
        userId: userId,
        subscription: subscription,
        deviceInfo: deviceInfo
      });
      console.log('✅ Nova subscription criada:', subscription.endpoint);
    }
    
    console.log('✅ Nova inscrição para notificações push:', {
      userId,
      deviceInfo,
      subscription: subscription.endpoint
    });
    
    res.status(200).json({
      success: true,
      message: 'Inscrito para notificações push com sucesso!'
    });
  } catch (error) {
    console.error('❌ Erro ao inscrever para notificações push:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Controller para cancelar inscrição em notificações push
const unsubscribeFromPush = async (req, res) => {
  try {
    const { subscription, userId } = req.body;
    
    // Marcar subscription como inativa
    await PushSubscription.findOneAndUpdate(
      { 'subscription.endpoint': subscription.endpoint },
      { isActive: false }
    );
    
    console.log('❌ Cancelamento de inscrição para notificações push:', {
      userId,
      subscription: subscription.endpoint
    });
    
    res.status(200).json({
      success: true,
      message: 'Inscrição cancelada com sucesso!'
    });
  } catch (error) {
    console.error('❌ Erro ao cancelar inscrição:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

export default {
  getNotifications,
  getNotificationsByCativeiro,
  generateNotifications,
  subscribeToPush,
  unsubscribeFromPush
}; 