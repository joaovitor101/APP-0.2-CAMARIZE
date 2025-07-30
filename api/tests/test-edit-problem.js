#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

// Carrega as variáveis de ambiente
dotenv.config();

console.log('🔍 Teste Específico - Problema de Edição');
console.log('========================================\n');

const apiUrl = "http://localhost:4000";

async function testEditProblem() {
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
    
    // 2. Busca um cativeiro existente ou cria um
    let cativeiro = await Cativeiros.findOne();
    if (!cativeiro) {
      console.log('❌ Nenhum cativeiro encontrado. Crie um cativeiro primeiro.');
      return;
    }
    
    console.log(`🏠 Usando cativeiro: ${cativeiro._id}`);
    
    // 3. Simula a criação com 3 sensores
    console.log('\n📝 PASSO 1: Criando relações com 3 sensores...');
    
    // Remove relações existentes
    await SensoresxCativeiros.deleteMany({ id_cativeiro: cativeiro._id });
    
    // Cria 3 relações
    const sensorIds = sensores.slice(0, 3).map(s => s._id.toString());
    for (const sensorId of sensorIds) {
      await SensoresxCativeiros.create({
        id_sensor: sensorId,
        id_cativeiro: cativeiro._id
      });
    }
    
    // Verifica se foram criadas
    const relacoesIniciais = await SensoresxCativeiros.find({ id_cativeiro: cativeiro._id });
    console.log(`✅ Relações criadas: ${relacoesIniciais.length}`);
    
    // 4. Simula a edição com apenas 1 sensor
    console.log('\n📝 PASSO 2: Editando para apenas 1 sensor...');
    
    // Simula o que o frontend envia
    const formData = new FormData();
    formData.append("sensorIds", sensorIds[0]); // Apenas o primeiro sensor
    
    console.log('🔍 Dados que seriam enviados:');
    console.log(`  sensorIds: [${sensorIds[0]}]`);
    console.log(`  Array.isArray: ${Array.isArray([sensorIds[0]])}`);
    
    // Simula a lógica do controller
    console.log('\n🔧 Simulando lógica do controller...');
    
    // Remove relações anteriores
    await SensoresxCativeiros.deleteMany({ id_cativeiro: cativeiro._id });
    console.log(`🗑️  Relações anteriores removidas`);
    
    // Processa o sensor fornecido
    const sensorIdFornecido = sensorIds[0];
    if (sensorIdFornecido && sensorIdFornecido !== "") {
      await SensoresxCativeiros.create({
        id_sensor: sensorIdFornecido,
        id_cativeiro: cativeiro._id
      });
      console.log(`✅ Nova relação criada: Sensor ${sensorIdFornecido} -> Cativeiro ${cativeiro._id}`);
    }
    
    // 5. Verifica o resultado final
    console.log('\n📊 RESULTADO FINAL:');
    const relacoesFinais = await SensoresxCativeiros.find({ id_cativeiro: cativeiro._id })
      .populate('id_sensor');
    
    console.log(`📈 Total de relações: ${relacoesFinais.length}`);
    
    if (relacoesFinais.length > 0) {
      console.log('🔗 Relações encontradas:');
      relacoesFinais.forEach((relacao, index) => {
        console.log(`  ${index + 1}. Sensor: ${relacao.id_sensor.apelido} (${relacao.id_sensor.id_tipo_sensor})`);
      });
    } else {
      console.log('❌ NENHUMA RELAÇÃO ENCONTRADA - PROBLEMA IDENTIFICADO!');
    }
    
    // 6. Testa a API real
    console.log('\n🌐 TESTANDO API REAL...');
    
    try {
      // Primeiro, recria as 3 relações
      await SensoresxCativeiros.deleteMany({ id_cativeiro: cativeiro._id });
      for (const sensorId of sensorIds) {
        await SensoresxCativeiros.create({
          id_sensor: sensorId,
          id_cativeiro: cativeiro._id
        });
      }
      
      // Testa a API
      const response = await axios.put(`${apiUrl}/cativeiros/${cativeiro._id}`, {
        sensorIds: [sensorIds[0]] // Apenas 1 sensor
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`📡 API Response: ${response.status}`);
      
      // Verifica resultado
      const relacoesAposAPI = await SensoresxCativeiros.find({ id_cativeiro: cativeiro._id })
        .populate('id_sensor');
      
      console.log(`📈 Relações após API: ${relacoesAposAPI.length}`);
      
    } catch (error) {
      console.log(`❌ Erro na API: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔚 Conexão fechada');
  }
}

testEditProblem(); 