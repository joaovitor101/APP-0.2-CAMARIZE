#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";
import readline from 'readline';

// Carrega as variáveis de ambiente
dotenv.config();

console.log('🌊 Populando dados de cativeiros específicos...');
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

async function populateSpecificCativeiros() {
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
    
    // Pergunta quais cativeiros popular
    const resposta = await askQuestion('Digite os números dos cativeiros que deseja popular (ex: 1,2,3) ou "todos" para popular todos: ');
    
    let cativeirosParaPopular = [];
    
    if (resposta.toLowerCase() === 'todos') {
      cativeirosParaPopular = cativeiros;
      console.log('✅ Todos os cativeiros serão populados');
    } else {
      const indices = resposta.split(',').map(s => s.trim()).map(s => parseInt(s) - 1);
      cativeirosParaPopular = indices.map(i => cativeiros[i]).filter(c => c);
      
      if (cativeirosParaPopular.length === 0) {
        console.log('❌ Nenhum cativeiro válido selecionado');
        return;
      }
      
      console.log(`✅ ${cativeirosParaPopular.length} cativeiro(s) selecionado(s):`);
      cativeirosParaPopular.forEach(c => console.log(`   - ${c.nome}`));
    }
    
    // Pergunta se quer limpar dados existentes
    const limparDados = await askQuestion('\nDeseja limpar dados existentes dos cativeiros selecionados? (s/n): ');
    
    if (limparDados.toLowerCase() === 's') {
      console.log('🧹 Limpando dados existentes dos cativeiros selecionados...');
      const idsCativeiros = cativeirosParaPopular.map(c => c._id);
      await ParametrosAtuais.deleteMany({ id_cativeiro: { $in: idsCativeiros } });
      console.log('✅ Dados antigos removidos');
    }
    
    // Pergunta quantos dias de dados gerar
    const diasResposta = await askQuestion('\nQuantos dias de dados históricos gerar? (padrão: 7): ');
    const dias = parseInt(diasResposta) || 7;
    
    // Gera dados para cada cativeiro selecionado
    for (const cativeiro of cativeirosParaPopular) {
      console.log(`\n🎯 Populando dados para: ${cativeiro.nome || 'Cativeiro sem nome'}`);
      
      if (!cativeiro.condicoes_ideais) {
        console.log('⚠️  Cativeiro sem condições ideais, usando valores padrão');
        const valoresPadrao = {
          temp_ideal: 26,
          ph_ideal: 7.5,
          amonia_ideal: 0.05
        };
        await generateParametros(cativeiro._id, valoresPadrao, dias);
      } else {
        await generateParametros(cativeiro._id, cativeiro.condicoes_ideais, dias);
      }
    }
    
    console.log('\n🎉 População concluída com sucesso!');
    console.log('📊 Os cativeiros selecionados agora têm dados atualizados');
    console.log('🔗 Acesse o Dashboard para ver os dados atualizados');
    
  } catch (error) {
    console.error('❌ Erro ao popular dados:', error.message);
  } finally {
    rl.close();
    await mongoose.connection.close();
    console.log('\n🔚 Conexão fechada');
  }
}

async function generateParametros(cativeiroId, condicoesIdeais, dias) {
  const ParametrosAtuais = mongoose.model('ParametrosAtuais');
  
  const dados = [];
  const agora = new Date();
  
  // Dados atuais (última leitura)
  const dadosAtuais = {
    temp_atual: generateRealisticValue(condicoesIdeais.temp_ideal, 2, 20, 35),
    ph_atual: generateRealisticValue(condicoesIdeais.ph_ideal, 0.3, 6.5, 8.5),
    amonia_atual: generateRealisticValue(condicoesIdeais.amonia_ideal, 0.02, 0.01, 0.2),
    datahora: agora,
    id_cativeiro: cativeiroId
  };
  
  dados.push(dadosAtuais);
  console.log(`   📊 Dados atuais: Temp=${dadosAtuais.temp_atual.toFixed(1)}°C, pH=${dadosAtuais.ph_atual.toFixed(1)}, Amônia=${dadosAtuais.amonia_atual.toFixed(2)}mg/L`);
  
  // Dados históricos dos últimos N dias
  for (let i = 1; i <= dias; i++) {
    const data = new Date(agora.getTime() - (i * 24 * 60 * 60 * 1000));
    
    const dadosHistoricos = {
      temp_atual: generateRealisticValue(condicoesIdeais.temp_ideal, 3, 20, 35),
      ph_atual: generateRealisticValue(condicoesIdeais.ph_ideal, 0.5, 6.5, 8.5),
      amonia_atual: generateRealisticValue(condicoesIdeais.amonia_ideal, 0.03, 0.01, 0.2),
      datahora: data,
      id_cativeiro: cativeiroId
    };
    
    dados.push(dadosHistoricos);
  }
  
  // Dados adicionais para simular leituras a cada 2 horas nos últimos 3 dias
  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 12; j++) {
      const data = new Date(agora.getTime() - (i * 24 * 60 * 60 * 1000) + (j * 2 * 60 * 60 * 1000));
      
      const dadosAdicionais = {
        temp_atual: generateRealisticValue(condicoesIdeais.temp_ideal, 2.5, 20, 35),
        ph_atual: generateRealisticValue(condicoesIdeais.ph_ideal, 0.4, 6.5, 8.5),
        amonia_atual: generateRealisticValue(condicoesIdeais.amonia_ideal, 0.025, 0.01, 0.2),
        datahora: data,
        id_cativeiro: cativeiroId
      };
      
      dados.push(dadosAdicionais);
    }
  }
  
  // Salva todos os dados
  console.log(`   💾 Salvando ${dados.length} registros...`);
  
  for (const dadosRegistro of dados) {
    const parametro = new ParametrosAtuais(dadosRegistro);
    await parametro.save();
  }
  
  console.log(`   ✅ ${dados.length} registros salvos para este cativeiro`);
}

function generateRealisticValue(valorIdeal, variacao, min, max) {
  const variacaoReal = (Math.random() - 0.5) * variacao * 2;
  const variacaoAdicional = (Math.random() - 0.5) * variacao * 0.5;
  const valorFinal = valorIdeal + variacaoReal + variacaoAdicional;
  return Math.max(min, Math.min(max, valorFinal));
}

populateSpecificCativeiros(); 