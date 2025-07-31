#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";
import readline from 'readline';

// Carrega as variáveis de ambiente
dotenv.config();

console.log('🚨 Populando dados que geram alertas críticos...');
console.log('==============================================\n');

// Interface para leitura do terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para fazer perguntas
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function populateAlertData() {
  try {
    // Conecta ao MongoDB
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";
    console.log('📡 Conectando ao MongoDB...');
    
    await mongoose.connect(mongoUrl);
    console.log('✅ Conectado ao MongoDB!');
    
    // Importa os modelos
    await import('./models/Parametros_atuais.js');
    await import('./models/Cativeiros.js');
    await import('./models/Condicoes_ideais.js');
    await import('./models/Camaroes.js');
    
    const ParametrosAtuais = mongoose.model('ParametrosAtuais');
    const Cativeiros = mongoose.model('Cativeiros');
    
    // Busca cativeiros existentes
    const cativeiros = await Cativeiros.find().populate('condicoes_ideais').populate('id_tipo_camarao');
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
      console.log(`     Tipo: ${cativeiro.id_tipo_camarao?.nome || 'N/A'}`);
      if (cativeiro.condicoes_ideais) {
        console.log(`     Condições ideais: Temp=${cativeiro.condicoes_ideais.temp_ideal}°C, pH=${cativeiro.condicoes_ideais.ph_ideal}, Amônia=${cativeiro.condicoes_ideais.amonia_ideal}mg/L`);
      } else {
        console.log(`     ⚠️  Sem condições ideais configuradas`);
      }
      console.log('');
    });
    
    // Pergunta qual cativeiro
    const resposta = await askQuestion('Digite o número do cativeiro que deseja popular com dados de alerta: ');
    const index = parseInt(resposta) - 1;
    const cativeiro = cativeiros[index];
    
    if (!cativeiro) {
      console.log('❌ Cativeiro não encontrado');
      return;
    }
    
    console.log(`✅ Cativeiro selecionado: ${cativeiro.nome}`);
    
    // Pergunta se quer limpar dados existentes
    const limparDados = await askQuestion('\nDeseja limpar dados existentes deste cativeiro? (s/n): ');
    
    if (limparDados.toLowerCase() === 's') {
      console.log('🧹 Limpando dados existentes...');
      await ParametrosAtuais.deleteMany({ id_cativeiro: cativeiro._id });
      console.log('✅ Dados antigos removidos');
    }
    
    // Pergunta qual tipo de alerta
    console.log('\n🚨 Tipos de alerta disponíveis:');
    console.log('  1. Temperatura alta (crítico)');
    console.log('  2. pH baixo (crítico)');
    console.log('  3. Amônia alta (crítico)');
    console.log('  4. Múltiplos alertas (crítico)');
    console.log('  5. Alertas médios (alerta)');
    
    const tipoAlerta = await askQuestion('\nEscolha o tipo de alerta (1-5): ');
    
    // Gera dados de alerta
    await generateAlertData(cativeiro, tipoAlerta);
    
    console.log('\n🎉 Dados de alerta gerados com sucesso!');
    console.log('📊 O cativeiro agora deve aparecer com status crítico/alerta');
    console.log('🔗 Verifique as notificações e a página de status');
    
  } catch (error) {
    console.error('❌ Erro ao popular dados:', error.message);
  } finally {
    rl.close();
    await mongoose.connection.close();
    console.log('\n🔚 Conexão fechada');
  }
}

async function generateAlertData(cativeiro, tipoAlerta) {
  const ParametrosAtuais = mongoose.model('ParametrosAtuais');
  
  if (!cativeiro.condicoes_ideais) {
    console.log('⚠️  Cativeiro sem condições ideais, usando valores padrão');
    cativeiro.condicoes_ideais = {
      temp_ideal: 26,
      ph_ideal: 7.5,
      amonia_ideal: 0.05
    };
  }
  
  const condicoes = cativeiro.condicoes_ideais;
  const agora = new Date();
  
  let tempAtual, phAtual, amoniaAtual;
  
  switch (tipoAlerta) {
    case '1': // Temperatura alta
      tempAtual = condicoes.temp_ideal + (condicoes.temp_ideal * 0.3); // 30% acima do ideal
      phAtual = condicoes.ph_ideal + (Math.random() - 0.5) * 0.2; // Normal
      amoniaAtual = condicoes.amonia_ideal + (Math.random() - 0.5) * 0.01; // Normal
      console.log(`🌡️  Gerando alerta de temperatura alta: ${tempAtual.toFixed(1)}°C (Ideal: ${condicoes.temp_ideal}°C)`);
      break;
      
    case '2': // pH baixo
      tempAtual = condicoes.temp_ideal + (Math.random() - 0.5) * 2; // Normal
      phAtual = condicoes.ph_ideal - (condicoes.ph_ideal * 0.3); // 30% abaixo do ideal
      amoniaAtual = condicoes.amonia_ideal + (Math.random() - 0.5) * 0.01; // Normal
      console.log(`🧪 Gerando alerta de pH baixo: ${phAtual.toFixed(2)} (Ideal: ${condicoes.ph_ideal})`);
      break;
      
    case '3': // Amônia alta
      tempAtual = condicoes.temp_ideal + (Math.random() - 0.5) * 2; // Normal
      phAtual = condicoes.ph_ideal + (Math.random() - 0.5) * 0.2; // Normal
      amoniaAtual = condicoes.amonia_ideal + (condicoes.amonia_ideal * 0.5); // 50% acima do ideal
      console.log(`🐟 Gerando alerta de amônia alta: ${amoniaAtual.toFixed(3)}mg/L (Ideal: ${condicoes.amonia_ideal}mg/L)`);
      break;
      
    case '4': // Múltiplos alertas críticos
      tempAtual = condicoes.temp_ideal + (condicoes.temp_ideal * 0.25); // 25% acima
      phAtual = condicoes.ph_ideal - (condicoes.ph_ideal * 0.25); // 25% abaixo
      amoniaAtual = condicoes.amonia_ideal + (condicoes.amonia_ideal * 0.4); // 40% acima
      console.log(`🚨 Gerando múltiplos alertas críticos:`);
      console.log(`   Temperatura: ${tempAtual.toFixed(1)}°C (Ideal: ${condicoes.temp_ideal}°C)`);
      console.log(`   pH: ${phAtual.toFixed(2)} (Ideal: ${condicoes.ph_ideal})`);
      console.log(`   Amônia: ${amoniaAtual.toFixed(3)}mg/L (Ideal: ${condicoes.amonia_ideal}mg/L)`);
      break;
      
    case '5': // Alertas médios
      tempAtual = condicoes.temp_ideal + (condicoes.temp_ideal * 0.15); // 15% acima (alerta médio)
      phAtual = condicoes.ph_ideal - (condicoes.ph_ideal * 0.15); // 15% abaixo (alerta médio)
      amoniaAtual = condicoes.amonia_ideal + (condicoes.amonia_ideal * 0.2); // 20% acima (alerta médio)
      console.log(`⚠️  Gerando alertas médios:`);
      console.log(`   Temperatura: ${tempAtual.toFixed(1)}°C (Ideal: ${condicoes.temp_ideal}°C)`);
      console.log(`   pH: ${phAtual.toFixed(2)} (Ideal: ${condicoes.ph_ideal})`);
      console.log(`   Amônia: ${amoniaAtual.toFixed(3)}mg/L (Ideal: ${condicoes.amonia_ideal}mg/L)`);
      break;
      
    default:
      console.log('❌ Tipo de alerta inválido');
      return;
  }
  
  // Cria o parâmetro atual com dados de alerta
  const parametroAlerta = new ParametrosAtuais({
    temp_atual: tempAtual,
    ph_atual: phAtual,
    amonia_atual: amoniaAtual,
    datahora: agora,
    id_cativeiro: cativeiro._id
  });
  
  await parametroAlerta.save();
  console.log(`✅ Dados de alerta salvos para ${cativeiro.nome}`);
  
  // Cria alguns dados históricos normais para contexto
  for (let i = 1; i <= 3; i++) {
    const data = new Date(agora.getTime() - (i * 24 * 60 * 60 * 1000));
    
    const dadosHistoricos = new ParametrosAtuais({
      temp_atual: condicoes.temp_ideal + (Math.random() - 0.5) * 1.5,
      ph_atual: condicoes.ph_ideal + (Math.random() - 0.5) * 0.1,
      amonia_atual: condicoes.amonia_ideal + (Math.random() - 0.5) * 0.005,
      datahora: data,
      id_cativeiro: cativeiro._id
    });
    
    await dadosHistoricos.save();
  }
  
  console.log(`✅ 3 registros históricos normais também criados para contexto`);
}

populateAlertData(); 