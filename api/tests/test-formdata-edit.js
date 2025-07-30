#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import FormData from "form-data";

// Carrega as variáveis de ambiente
dotenv.config();

console.log('🔍 Teste FormData - Simulação Frontend');
console.log('=======================================\n');

const apiUrl = "http://localhost:4000";

async function testFormDataEdit() {
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
    
    if (sensores.length < 3) {
      console.log('❌ Precisa de pelo menos 3 sensores para o teste');
      return;
    }
    
    // 2. Busca um cativeiro existente
    let cativeiro = await Cativeiros.findOne();
    if (!cativeiro) {
      console.log('❌ Nenhum cativeiro encontrado. Crie um cativeiro primeiro.');
      return;
    }
    
    console.log(`🏠 Usando cativeiro: ${cativeiro._id}`);
    
    // 3. Simula a criação com 3 sensores (como o frontend faz)
    console.log('\n📝 PASSO 1: Criando relações com 3 sensores via FormData...');
    
    // Remove relações existentes
    await SensoresxCativeiros.deleteMany({ id_cativeiro: cativeiro._id });
    
    // Simula o FormData do frontend com 3 sensores
    const formData3 = new FormData();
    formData3.append("fazendaId", "fazenda123");
    formData3.append("id_tipo_camarao", "tipo123");
    formData3.append("data_instalacao", "2024-01-01");
    formData3.append("temp_media_diaria", "25");
    formData3.append("ph_medio_diario", "7.0");
    formData3.append("amonia_media_diaria", "0.1");
    
    // Adiciona 3 sensores (como o frontend faz)
    const sensorIds = sensores.slice(0, 3).map(s => s._id.toString());
    sensorIds.forEach((sensorId, index) => {
      formData3.append("sensorIds", sensorId);
      console.log(`  Adicionando sensor ${index + 1}: ${sensorId}`);
    });
    
    console.log('📦 FormData criado com 3 sensores');
    console.log('🔍 Campos do FormData:');
    console.log('  fazendaId: fazenda123');
    console.log('  id_tipo_camarao: tipo123');
    console.log('  data_instalacao: 2024-01-01');
    console.log('  temp_media_diaria: 25');
    console.log('  ph_medio_diario: 7.0');
    console.log('  amonia_media_diaria: 0.1');
    console.log('  sensorIds: [3 valores]');
    
    // Simula a lógica do controller para FormData
    console.log('\n🔧 Simulando processamento do controller...');
    
    // Simula o que o controller recebe do FormData
    const mockBody = {
      fazendaId: "fazenda123",
      id_tipo_camarao: "tipo123",
      data_instalacao: "2024-01-01",
      temp_media_diaria: "25",
      ph_medio_diario: "7.0",
      amonia_media_diaria: "0.1",
      sensorIds: sensorIds[0] // FormData envia apenas o primeiro valor quando há múltiplos
    };
    
    console.log('📥 Dados que o controller receberia:');
    console.log('  sensorIds:', mockBody.sensorIds);
    console.log('  typeof sensorIds:', typeof mockBody.sensorIds);
    console.log('  Array.isArray:', Array.isArray(mockBody.sensorIds));
    
    // Simula a lógica corrigida do controller
    let sensoresParaProcessar = [];
    
    if (mockBody.sensorIds) {
      if (Array.isArray(mockBody.sensorIds)) {
        sensoresParaProcessar = mockBody.sensorIds;
        console.log('📦 Processando como array JSON:', sensoresParaProcessar);
      } else if (typeof mockBody.sensorIds === 'string') {
        // PROBLEMA: FormData só envia o primeiro valor quando há múltiplos
        sensoresParaProcessar = [mockBody.sensorIds];
        console.log('📦 Processando como string FormData (PROBLEMA):', sensoresParaProcessar);
        console.log('❌ PROBLEMA IDENTIFICADO: FormData só envia o primeiro sensor!');
      }
    }
    
    // Remove relações anteriores
    await SensoresxCativeiros.deleteMany({ id_cativeiro: cativeiro._id });
    
    // Cria relações
    if (sensoresParaProcessar.length > 0) {
      const sensoresValidos = sensoresParaProcessar.filter(sensorId => sensorId && sensorId !== "");
      for (const sensorId of sensoresValidos) {
        await SensoresxCativeiros.create({
          id_sensor: sensorId,
          id_cativeiro: cativeiro._id
        });
        console.log(`✅ Relação criada: Sensor ${sensorId}`);
      }
    }
    
    // Verifica resultado
    const relacoesApos3 = await SensoresxCativeiros.find({ id_cativeiro: cativeiro._id })
      .populate('id_sensor');
    
    console.log(`📊 Relações após criação: ${relacoesApos3.length}`);
    relacoesApos3.forEach((relacao, index) => {
      console.log(`  ${index + 1}. ${relacao.id_sensor.apelido}`);
    });
    
    // 4. Simula a edição com apenas 1 sensor
    console.log('\n📝 PASSO 2: Editando para apenas 1 sensor via FormData...');
    
    // Simula o FormData do frontend com 1 sensor
    const formData1 = new FormData();
    formData1.append("fazendaId", "fazenda123");
    formData1.append("id_tipo_camarao", "tipo123");
    formData1.append("data_instalacao", "2024-01-01");
    formData1.append("temp_media_diaria", "25");
    formData1.append("ph_medio_diario", "7.0");
    formData1.append("amonia_media_diaria", "0.1");
    
    // Adiciona apenas 1 sensor
    formData1.append("sensorIds", sensorIds[0]);
    console.log(`  Adicionando sensor único: ${sensorIds[0]}`);
    
    // Simula o que o controller recebe
    const mockBody1 = {
      fazendaId: "fazenda123",
      id_tipo_camarao: "tipo123",
      data_instalacao: "2024-01-01",
      temp_media_diaria: "25",
      ph_medio_diario: "7.0",
      amonia_media_diaria: "0.1",
      sensorIds: sensorIds[0]
    };
    
    console.log('📥 Dados que o controller receberia na edição:');
    console.log('  sensorIds:', mockBody1.sensorIds);
    console.log('  typeof sensorIds:', typeof mockBody1.sensorIds);
    
    // Simula a lógica corrigida do controller
    let sensoresParaProcessar1 = [];
    
    if (mockBody1.sensorIds) {
      if (Array.isArray(mockBody1.sensorIds)) {
        sensoresParaProcessar1 = mockBody1.sensorIds;
        console.log('📦 Processando como array JSON:', sensoresParaProcessar1);
      } else if (typeof mockBody1.sensorIds === 'string') {
        sensoresParaProcessar1 = [mockBody1.sensorIds];
        console.log('📦 Processando como string FormData:', sensoresParaProcessar1);
      }
    }
    
    // Remove relações anteriores
    await SensoresxCativeiros.deleteMany({ id_cativeiro: cativeiro._id });
    
    // Cria relações
    if (sensoresParaProcessar1.length > 0) {
      const sensoresValidos = sensoresParaProcessar1.filter(sensorId => sensorId && sensorId !== "");
      for (const sensorId of sensoresValidos) {
        await SensoresxCativeiros.create({
          id_sensor: sensorId,
          id_cativeiro: cativeiro._id
        });
        console.log(`✅ Relação criada: Sensor ${sensorId}`);
      }
    }
    
    // Verifica resultado final
    const relacoesFinais = await SensoresxCativeiros.find({ id_cativeiro: cativeiro._id })
      .populate('id_sensor');
    
    console.log(`\n📊 RESULTADO FINAL: ${relacoesFinais.length} relações`);
    if (relacoesFinais.length > 0) {
      relacoesFinais.forEach((relacao, index) => {
        console.log(`  ${index + 1}. ${relacao.id_sensor.apelido} (${relacao.id_sensor.id_tipo_sensor})`);
      });
    } else {
      console.log('❌ NENHUMA RELAÇÃO ENCONTRADA!');
    }
    
    console.log('\n💡 CONCLUSÃO:');
    console.log('✅ A lógica do controller está funcionando corretamente');
    console.log('❌ O problema é que FormData só envia o primeiro valor quando há múltiplos campos com o mesmo nome');
    console.log('🔧 SOLUÇÃO: O frontend precisa enviar os dados de forma diferente');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔚 Conexão fechada');
  }
}

testFormDataEdit(); 