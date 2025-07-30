#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

// Carrega as variáveis de ambiente
dotenv.config();

console.log('🔔 Teste - Sistema de Notificações');
console.log('==================================\n');

const apiUrl = "http://localhost:4000";

async function testNotifications() {
  try {
    // Conecta ao MongoDB
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";
    console.log('📡 Conectando ao MongoDB...');
    
    await mongoose.connect(mongoUrl);
    console.log('✅ Conectado ao MongoDB Atlas!');
    
    // Importa os modelos
    await import('../models/Parametros_atuais.js');
    await import('../models/Cativeiros.js');
    await import('../models/Condicoes_ideais.js');
    
    const ParametrosAtuais = mongoose.model('ParametrosAtuais');
    const Cativeiros = mongoose.model('Cativeiros');
    const CondicoesIdeais = mongoose.model('CondicoesIdeais');
    
    // 1. Verifica se há dados para testar
    const cativeiros = await Cativeiros.find().populate('condicoes_ideais');
    console.log(`📊 Cativeiros encontrados: ${cativeiros.length}`);
    
    if (cativeiros.length === 0) {
      console.log('❌ Nenhum cativeiro encontrado. Crie cativeiros primeiro.');
      return;
    }
    
    const parametros = await ParametrosAtuais.find();
    console.log(`📊 Parâmetros atuais encontrados: ${parametros.length}`);
    
    if (parametros.length === 0) {
      console.log('❌ Nenhum parâmetro atual encontrado. Execute: npm run add-custom-parametros');
      return;
    }
    
    // 2. Testa a API de notificações
    console.log('\n🧪 TESTE 1: Chamando API de notificações...');
    
    try {
      const response = await axios.get(`${apiUrl}/notifications`);
      
      console.log(`📡 API Response: ${response.status}`);
      console.log(`📊 Notificações retornadas: ${response.data.notifications?.length || 0}`);
      
      if (response.data.success && response.data.notifications) {
        console.log('\n📋 Detalhes das notificações:');
        response.data.notifications.forEach((notification, index) => {
          console.log(`  ${index + 1}. ${notification.tipo.toUpperCase()}: ${notification.mensagem}`);
          console.log(`     Cativeiro: ${notification.cativeiroNome}`);
          console.log(`     Severidade: ${notification.severidade}`);
          console.log(`     Data/Hora: ${new Date(notification.datahora).toLocaleString()}`);
          console.log('');
        });
        
        if (response.data.notifications.length > 0) {
          console.log('✅ SUCESSO: Sistema de notificações funcionando!');
        } else {
          console.log('⚠️  Nenhuma notificação gerada. Verifique se os dados estão fora da tolerância.');
        }
      } else {
        console.log('❌ Erro na resposta da API:', response.data);
      }
      
    } catch (error) {
      console.log(`❌ Erro na API: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data:`, error.response.data);
      }
    }
    
    // 3. Testa notificações por cativeiro específico
    if (cativeiros.length > 0) {
      console.log('\n🧪 TESTE 2: Notificações por cativeiro específico...');
      
      const cativeiroId = cativeiros[0]._id;
      console.log(`📊 Testando cativeiro: ${cativeiroId}`);
      
      try {
        const response = await axios.get(`${apiUrl}/notifications/cativeiro/${cativeiroId}`);
        
        console.log(`📡 API Response: ${response.status}`);
        console.log(`📊 Notificações do cativeiro: ${response.data.notifications?.length || 0}`);
        
        if (response.data.success) {
          console.log('✅ SUCESSO: Filtro por cativeiro funcionando!');
        }
        
      } catch (error) {
        console.log(`❌ Erro na API por cativeiro: ${error.message}`);
      }
    }
    
    // 4. Mostra dados de exemplo para debug
    console.log('\n🔍 DEBUG: Dados de exemplo...');
    
    const cativeiroExemplo = cativeiros[0];
    const parametroExemplo = await ParametrosAtuais.findOne({ 
      id_cativeiro: cativeiroExemplo._id 
    }).sort({ datahora: -1 });
    
    if (cativeiroExemplo.condicoes_ideais && parametroExemplo) {
      console.log('📊 Cativeiro exemplo:');
      console.log(`  ID: ${cativeiroExemplo._id}`);
      console.log(`  Nome: ${cativeiroExemplo.nome || 'Sem nome'}`);
      console.log(`  Condições ideais:`, {
        temp: cativeiroExemplo.condicoes_ideais.temp_ideal,
        ph: cativeiroExemplo.condicoes_ideais.ph_ideal,
        amonia: cativeiroExemplo.condicoes_ideais.amonia_ideal
      });
      
      console.log('📊 Parâmetro atual mais recente:');
      console.log(`  Temperatura: ${parametroExemplo.temp_atual}°C`);
      console.log(`  pH: ${parametroExemplo.ph_atual}`);
      console.log(`  Amônia: ${parametroExemplo.amonia_atual}mg/L`);
      console.log(`  Data/Hora: ${parametroExemplo.datahora.toLocaleString()}`);
      
      // Calcula diferenças
      const condicao = cativeiroExemplo.condicoes_ideais;
      const tolerancia = 0.1;
      
      console.log('\n📊 Análise de diferenças:');
      if (condicao.temp_ideal) {
        const diffTemp = Math.abs(parametroExemplo.temp_atual - condicao.temp_ideal);
        const toleranciaTemp = condicao.temp_ideal * tolerancia;
        console.log(`  Temperatura: Diferença ${diffTemp.toFixed(2)}°C, Tolerância ${toleranciaTemp.toFixed(2)}°C ${diffTemp > toleranciaTemp ? '⚠️ ALERTA' : '✅ OK'}`);
      }
      
      if (condicao.ph_ideal) {
        const diffPh = Math.abs(parametroExemplo.ph_atual - condicao.ph_ideal);
        const toleranciaPh = condicao.ph_ideal * tolerancia;
        console.log(`  pH: Diferença ${diffPh.toFixed(2)}, Tolerância ${toleranciaPh.toFixed(2)} ${diffPh > toleranciaPh ? '⚠️ ALERTA' : '✅ OK'}`);
      }
      
      if (condicao.amonia_ideal) {
        const diffAmonia = Math.abs(parametroExemplo.amonia_atual - condicao.amonia_ideal);
        const toleranciaAmonia = condicao.amonia_ideal * tolerancia;
        console.log(`  Amônia: Diferença ${diffAmonia.toFixed(2)}mg/L, Tolerância ${toleranciaAmonia.toFixed(2)}mg/L ${diffAmonia > toleranciaAmonia ? '⚠️ ALERTA' : '✅ OK'}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔚 Conexão fechada');
  }
}

testNotifications(); 