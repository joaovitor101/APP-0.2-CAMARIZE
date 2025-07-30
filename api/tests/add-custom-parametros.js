#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente
dotenv.config();

console.log('🔧 Adicionando dados CUSTOMIZADOS de parâmetros atuais...');
console.log('=======================================================\n');

async function addCustomParametros() {
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
    
    // Busca cativeiros existentes
    const cativeiros = await Cativeiros.find().populate('condicoes_ideais');
    console.log(`📊 Cativeiros encontrados: ${cativeiros.length}`);
    
    if (cativeiros.length === 0) {
      console.log('❌ Nenhum cativeiro encontrado. Crie cativeiros primeiro.');
      return;
    }
    
    // Mostra os cativeiros disponíveis
    console.log('\n📋 Cativeiros disponíveis:');
    cativeiros.forEach((cativeiro, index) => {
      console.log(`  ${index + 1}. ID: ${cativeiro._id}`);
      console.log(`     Nome: ${cativeiro.nome || 'Sem nome'}`);
      if (cativeiro.condicoes_ideais) {
        console.log(`     Condições ideais: Temp=${cativeiro.condicoes_ideais.temp_ideal}°C, pH=${cativeiro.condicoes_ideais.ph_ideal}, Amônia=${cativeiro.condicoes_ideais.amonia_ideal}mg/L`);
      } else {
        console.log(`     ⚠️  Sem condições ideais configuradas`);
      }
      console.log('');
    });
    
    // Escolhe o primeiro cativeiro para o teste
    const cativeiro = cativeiros[0];
    console.log(`🎯 Usando cativeiro: ${cativeiro._id}`);
    
    if (!cativeiro.condicoes_ideais) {
      console.log('❌ Este cativeiro não tem condições ideais configuradas.');
      return;
    }
    
    const condicaoIdeal = cativeiro.condicoes_ideais;
    console.log(`📊 Condições ideais: Temp=${condicaoIdeal.temp_ideal}°C, pH=${condicaoIdeal.ph_ideal}, Amônia=${condicaoIdeal.amonia_ideal}mg/L`);
    
    // ========================================
    // 🎯 AQUI VOCÊ PODE ALTERAR OS VALORES!
    // ========================================
    
    // Dados CUSTOMIZADOS - Altere estes valores para seus testes
    const dadosCustomizados = [
    //   {
    //     temp_atual: 25.5,        // 🌡️ Altere a temperatura aqui
    //     ph_atual: 7.2,           // 🧪 Altere o pH aqui
    //     amonia_atual: 0.8,       // ⚗️ Altere a amônia aqui
    //     datahora: new Date(),
    //     id_cativeiro: cativeiro._id
    //   },
    //   {
    //     temp_atual: 30.0,        // 🌡️ Segundo registro - temperatura alta
    //     ph_atual: 6.5,           // 🧪 pH baixo
    //     amonia_atual: 1.5,       // ⚗️ Amônia alta
    //     datahora: new Date(Date.now() + 60000), // 1 minuto depois
    //     id_cativeiro: cativeiro._id
    //   },
      {
        temp_atual: 22.0,        // 🌡️ Terceiro registro - temperatura baixa
        ph_atual: 8.5,           // 🧪 pH alto
        amonia_atual: 0.3,       // ⚗️ Amônia baixa
        datahora: new Date(Date.now() + 120000), // 2 minutos depois
        id_cativeiro: cativeiro._id
      }
    ];
    
    console.log('\n📝 Criando dados customizados...');
    console.log('💡 Dica: Altere os valores no código para testar diferentes cenários!');
    
    // Cria os registros
    for (const dados of dadosCustomizados) {
      const parametro = new ParametrosAtuais(dados);
      await parametro.save();
      
      console.log(`✅ Parâmetro criado:`, {
        temp: dados.temp_atual,
        ph: dados.ph_atual,
        amonia: dados.amonia_atual,
        datahora: dados.datahora.toLocaleString()
      });
      
      // Calcula e mostra as diferenças
      const diffTemp = Math.abs(dados.temp_atual - condicaoIdeal.temp_ideal);
      const diffPh = Math.abs(dados.ph_atual - condicaoIdeal.ph_ideal);
      const diffAmonia = Math.abs(dados.amonia_atual - condicaoIdeal.amonia_ideal);
      
      const tolerancia = 0.1;
      const toleranciaTemp = condicaoIdeal.temp_ideal * tolerancia;
      const toleranciaPh = condicaoIdeal.ph_ideal * tolerancia;
      const toleranciaAmonia = condicaoIdeal.amonia_ideal * tolerancia;
      
      console.log(`   📊 Análise:`);
      console.log(`      Temperatura: ${diffTemp.toFixed(2)}°C (tolerância: ${toleranciaTemp.toFixed(2)}°C) ${diffTemp > toleranciaTemp ? '⚠️ ALERTA' : '✅ OK'}`);
      console.log(`      pH: ${diffPh.toFixed(2)} (tolerância: ${toleranciaPh.toFixed(2)}) ${diffPh > toleranciaPh ? '⚠️ ALERTA' : '✅ OK'}`);
      console.log(`      Amônia: ${diffAmonia.toFixed(2)}mg/L (tolerância: ${toleranciaAmonia.toFixed(2)}mg/L) ${diffAmonia > toleranciaAmonia ? '⚠️ ALERTA' : '✅ OK'}`);
      console.log('');
    }
    
    console.log('🎉 Dados customizados criados com sucesso!');
    console.log('📊 Agora você pode testar o sistema de notificações');
    console.log('🔗 Acesse: http://localhost:4000/notifications');
    console.log('🧪 Ou execute: npm run test-notifications');
    console.log('\n💡 Para alterar valores, edite o arquivo: api/tests/add-custom-parametros.js');
    
  } catch (error) {
    console.error('❌ Erro ao criar dados customizados:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔚 Conexão fechada');
  }
}

addCustomParametros(); 