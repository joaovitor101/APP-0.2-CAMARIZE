#!/usr/bin/env node

import axios from 'axios';

async function testStatusVsNotifications() {
  try {
    console.log('🔍 Teste - Comparando Status vs Notificações');
    console.log('===========================================\n');

    const apiUrl = process.env.API_URL || "http://localhost:4000";

    // Primeiro, vamos fazer login para obter um token
    const loginResponse = await axios.post(`${apiUrl}/users/auth`, {
      email: "teste@teste.com",
      password: "123456"
    });

    if (!loginResponse.data.token) {
      console.error('❌ Falha no login');
      return;
    }

    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');

    // Testa o endpoint de status dos cativeiros
    console.log('\n📊 Testando endpoint de status dos cativeiros...');
    const statusResponse = await axios.get(`${apiUrl}/cativeiros-status`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Testa o endpoint de notificações
    console.log('🔔 Testando endpoint de notificações...');
    const notificationsResponse = await axios.get(`${apiUrl}/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('\n📋 RESULTADOS:');
    console.log('==============');

    if (statusResponse.data.success) {
      console.log(`\n📊 Status dos Cativeiros:`);
      console.log(`   Total de cativeiros: ${statusResponse.data.cativeiros?.length || 0}`);
      
      const resumo = statusResponse.data.resumo;
      console.log(`   Resumo: OK=${resumo?.ok || 0}, Alerta=${resumo?.alerta || 0}, Crítico=${resumo?.critico || 0}, Sem dados=${resumo?.semDados || 0}`);
      
      if (statusResponse.data.cativeiros && statusResponse.data.cativeiros.length > 0) {
        console.log('\n   Detalhes dos cativeiros:');
        statusResponse.data.cativeiros.forEach((cativeiro, index) => {
          console.log(`   ${index + 1}. ${cativeiro.nome} - Status: ${cativeiro.statusText} (${cativeiro.status})`);
          console.log(`      Alertas: ${cativeiro.totalAlertas}`);
          if (cativeiro.alertasDetalhados && cativeiro.alertasDetalhados.length > 0) {
            cativeiro.alertasDetalhados.forEach((alerta, alertaIndex) => {
              console.log(`        ${alertaIndex + 1}. ${alerta.tipo} - ${alerta.severidade}: ${alerta.mensagem}`);
            });
          }
        });
      }
    } else {
      console.log('❌ Erro no endpoint de status');
    }

    if (notificationsResponse.data.success) {
      console.log(`\n🔔 Notificações:`);
      console.log(`   Total de notificações: ${notificationsResponse.data.notifications?.length || 0}`);
      
      if (notificationsResponse.data.notifications && notificationsResponse.data.notifications.length > 0) {
        console.log('\n   Detalhes das notificações:');
        notificationsResponse.data.notifications.forEach((notification, index) => {
          console.log(`   ${index + 1}. ${notification.tipo.toUpperCase()} - ${notification.severidade}`);
          console.log(`      Cativeiro: ${notification.cativeiroNome}`);
          console.log(`      Mensagem: ${notification.mensagem}`);
        });
      } else {
        console.log('   ⚠️  Nenhuma notificação encontrada');
      }
    } else {
      console.log('❌ Erro no endpoint de notificações');
    }

    // Análise de inconsistências
    console.log('\n🔍 ANÁLISE DE INCONSISTÊNCIAS:');
    console.log('==============================');

    if (statusResponse.data.success && notificationsResponse.data.success) {
      const cativeirosComProblemas = statusResponse.data.cativeiros?.filter(c => c.status === 'ok' || c.status === 'alerta') || [];
      const notificacoesCriticas = notificationsResponse.data.notifications?.filter(n => n.severidade === 'alta') || [];
      
      console.log(`   Cativeiros com status OK/ALERTA: ${cativeirosComProblemas.length}`);
      console.log(`   Notificações críticas: ${notificacoesCriticas.length}`);
      
      if (notificacoesCriticas.length > 0 && cativeirosComProblemas.length > 0) {
        console.log('\n   ⚠️  POSSÍVEL INCONSISTÊNCIA DETECTADA!');
        console.log('   Há notificações críticas mas cativeiros com status OK/ALERTA');
        
        // Verifica se há cativeiros com notificações críticas mas status OK
        const inconsistencias = [];
        notificacoesCriticas.forEach(notif => {
          const cativeiro = statusResponse.data.cativeiros?.find(c => c.id === notif.cativeiro);
          if (cativeiro && cativeiro.status !== 'critico') {
            inconsistencias.push({
              cativeiro: cativeiro.nome,
              status: cativeiro.status,
              notificacao: notif
            });
          }
        });
        
        if (inconsistencias.length > 0) {
          console.log('\n   📝 Inconsistências encontradas:');
          inconsistencias.forEach((inc, index) => {
            console.log(`   ${index + 1}. ${inc.cativeiro} - Status: ${inc.status}, mas tem notificação ${inc.notificacao.severidade}`);
          });
        }
      } else {
        console.log('   ✅ Nenhuma inconsistência detectada');
      }
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

// Executa o teste
testStatusVsNotifications(); 