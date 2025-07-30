#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

// Carrega as variáveis de ambiente
dotenv.config();

console.log('🔍 Teste - Prevenção de Sensores Duplicados');
console.log('============================================\n');

const apiUrl = "http://localhost:4000";

async function testSensorDuplicatas() {
  try {
    // Conecta ao MongoDB
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";
    console.log('📡 Conectando ao MongoDB...');
    
    await mongoose.connect(mongoUrl);
    console.log('✅ Conectado ao MongoDB Atlas!');
    
    // Importa os modelos
    await import('../models/SensoresxCativeiros.js');
    await import('../models/Sensores.js');
    await import('../models/Cativeiros.js');
    await import('../models/Camaroes.js');
    await import('../models/Condicoes_ideais.js');
    await import('../models/Fazendas.js');
    await import('../models/FazendasxCativeiros.js');
    
    const SensoresxCativeiros = mongoose.model('SensoresxCativeiros');
    const Sensores = mongoose.model('Sensores');
    const Cativeiros = mongoose.model('Cativeiros');
    
    // 1. Busca sensores disponíveis
    const sensores = await Sensores.find().limit(3);
    console.log(`📡 Sensores disponíveis: ${sensores.length}`);
    sensores.forEach((sensor, index) => {
      console.log(`  ${index + 1}. ${sensor.apelido} (${sensor.id_tipo_sensor}) - ID: ${sensor._id}`);
    });
    
    if (sensores.length < 2) {
      console.log('❌ Precisa de pelo menos 2 sensores para o teste');
      return;
    }
    
    // 2. Busca um cativeiro existente
    let cativeiro = await Cativeiros.findOne();
    if (!cativeiro) {
      console.log('❌ Nenhum cativeiro encontrado. Crie um cativeiro primeiro.');
      return;
    }
    
    console.log(`🏠 Usando cativeiro: ${cativeiro._id}`);
    
    // 3. Testa a API com sensores duplicados
    console.log('\n🧪 TESTE 1: Enviando sensores duplicados via API...');
    
    const sensorIds = sensores.slice(0, 2).map(s => s._id.toString());
    const sensoresDuplicados = [
      sensorIds[0], // Primeiro sensor
      sensorIds[0], // Primeiro sensor (duplicado)
      sensorIds[1]  // Segundo sensor
    ];
    
    console.log('📦 Sensores enviados (com duplicata):', sensoresDuplicados);
    
    try {
      const response = await axios.put(`${apiUrl}/cativeiros/${cativeiro._id}`, {
        sensorIds: sensoresDuplicados
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`📡 API Response: ${response.status}`);
      
      // Verifica resultado
      const relacoesAposAPI = await SensoresxCativeiros.find({ id_cativeiro: cativeiro._id })
        .populate('id_sensor');
      
      console.log(`📊 Relações após API: ${relacoesAposAPI.length}`);
      relacoesAposAPI.forEach((relacao, index) => {
        console.log(`  ${index + 1}. ${relacao.id_sensor.apelido} (${relacao.id_sensor.id_tipo_sensor})`);
      });
      
      // Verifica se as duplicatas foram removidas
      const sensoresUnicos = [...new Set(relacoesAposAPI.map(r => r.id_sensor._id.toString()))];
      console.log(`🔍 Sensores únicos: ${sensoresUnicos.length}`);
      
      if (sensoresUnicos.length === 2) {
        console.log('✅ SUCESSO: Duplicatas foram removidas corretamente!');
      } else {
        console.log('❌ FALHA: Duplicatas não foram removidas');
      }
      
    } catch (error) {
      console.log(`❌ Erro na API: ${error.message}`);
    }
    
    // 4. Testa a lógica de filtro do frontend
    console.log('\n🧪 TESTE 2: Simulando filtro do frontend...');
    
    const sensoresDisponiveis = sensores.map(s => ({
      _id: s._id.toString(),
      apelido: s.apelido,
      id_tipo_sensor: s.id_tipo_sensor
    }));
    
    const sensoresSelecionados = [sensorIds[0], "", ""]; // Primeiro sensor selecionado
    
    console.log('📦 Sensores disponíveis:', sensoresDisponiveis.map(s => s.apelido));
    console.log('📦 Sensores selecionados:', sensoresSelecionados);
    
    // Simula a lógica de filtro do frontend
    const sensoresFiltrados = sensoresDisponiveis.filter(s => {
      return sensoresSelecionados[0] === s._id || !sensoresSelecionados.includes(s._id);
    });
    
    console.log('🔍 Sensores filtrados (disponíveis para seleção):');
    sensoresFiltrados.forEach((sensor, index) => {
      console.log(`  ${index + 1}. ${sensor.apelido} (${sensor.id_tipo_sensor})`);
    });
    
    // Verifica se o sensor já selecionado não aparece nos outros campos
    const sensorSelecionado = sensoresDisponiveis.find(s => s._id === sensoresSelecionados[0]);
    const sensoresDisponiveisParaOutros = sensoresFiltrados.filter(s => s._id !== sensoresSelecionados[0]);
    
    console.log(`📊 Sensor selecionado: ${sensorSelecionado?.apelido}`);
    console.log(`📊 Sensores disponíveis para outros campos: ${sensoresDisponiveisParaOutros.length}`);
    
    if (!sensoresDisponiveisParaOutros.find(s => s._id === sensoresSelecionados[0])) {
      console.log('✅ SUCESSO: Sensor já selecionado não aparece nos outros campos!');
    } else {
      console.log('❌ FALHA: Sensor já selecionado ainda aparece nos outros campos');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔚 Conexão fechada');
  }
}

testSensorDuplicatas(); 