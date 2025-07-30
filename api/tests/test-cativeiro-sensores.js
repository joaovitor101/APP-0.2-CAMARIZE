#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

// Carrega as variáveis de ambiente
dotenv.config();

console.log('🔍 Teste - Cativeiro com Sensores Relacionados');
console.log('==============================================\n');

const apiUrl = "http://localhost:4000";

async function testCativeiroSensores() {
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
    
    // 1. Busca um cativeiro existente
    const cativeiro = await Cativeiros.findOne();
    if (!cativeiro) {
      console.log('❌ Nenhum cativeiro encontrado. Crie um cativeiro primeiro.');
      return;
    }
    
    console.log(`🏠 Usando cativeiro: ${cativeiro._id}`);
    
    // 2. Verifica se há sensores relacionados
    const relacoes = await SensoresxCativeiros.find({ id_cativeiro: cativeiro._id })
      .populate('id_sensor');
    
    console.log(`📡 Sensores relacionados encontrados: ${relacoes.length}`);
    relacoes.forEach((relacao, index) => {
      console.log(`  ${index + 1}. ${relacao.id_sensor.apelido} (${relacao.id_sensor.id_tipo_sensor}) - ID: ${relacao.id_sensor._id}`);
    });
    
    // 3. Testa o service diretamente
    console.log('\n🔧 Testando service diretamente...');
    
    const cativeiroService = (await import('../services/cativeiroService.js')).default;
    const cativeiroComSensores = await cativeiroService.getById(cativeiro._id);
    
    console.log('📊 Dados retornados pelo service:');
    console.log('  ID:', cativeiroComSensores._id);
    console.log('  Fazenda:', cativeiroComSensores.fazenda);
    console.log('  Sensores:', cativeiroComSensores.sensores ? cativeiroComSensores.sensores.length : 0);
    
    if (cativeiroComSensores.sensores && cativeiroComSensores.sensores.length > 0) {
      console.log('  Detalhes dos sensores:');
      cativeiroComSensores.sensores.forEach((sensor, index) => {
        console.log(`    ${index + 1}. ${sensor.apelido} (${sensor.id_tipo_sensor}) - ID: ${sensor._id}`);
      });
    } else {
      console.log('  ❌ Nenhum sensor encontrado no objeto do cativeiro');
    }
    
    // 4. Testa a API
    console.log('\n🌐 Testando API...');
    
    try {
      const response = await axios.get(`${apiUrl}/cativeiros/${cativeiro._id}`);
      console.log(`📡 API Response: ${response.status}`);
      
      const dadosAPI = response.data;
      console.log('📊 Dados retornados pela API:');
      console.log('  ID:', dadosAPI._id);
      console.log('  Fazenda:', dadosAPI.fazenda);
      console.log('  Sensores:', dadosAPI.sensores ? dadosAPI.sensores.length : 0);
      
      if (dadosAPI.sensores && dadosAPI.sensores.length > 0) {
        console.log('  Detalhes dos sensores:');
        dadosAPI.sensores.forEach((sensor, index) => {
          console.log(`    ${index + 1}. ${sensor.apelido} (${sensor.id_tipo_sensor}) - ID: ${sensor._id}`);
        });
      } else {
        console.log('  ❌ Nenhum sensor encontrado na resposta da API');
      }
      
    } catch (error) {
      console.log(`❌ Erro na API: ${error.message}`);
    }
    
    // 5. Simula o que o frontend deveria receber
    console.log('\n💻 Simulando dados para o frontend...');
    
    if (cativeiroComSensores.sensores && cativeiroComSensores.sensores.length > 0) {
      const sensoresIds = cativeiroComSensores.sensores.map(sensor => sensor._id || sensor);
      console.log('📦 IDs dos sensores para o frontend:', sensoresIds);
      console.log('🔧 O frontend deveria usar esses IDs para preencher os campos de seleção');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔚 Conexão fechada');
  }
}

testCativeiroSensores(); 