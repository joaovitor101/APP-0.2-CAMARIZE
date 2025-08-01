#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente
dotenv.config();

console.log('🧹 Script - Limpar Condições Ideais');
console.log('===================================\n');

async function clearCondicoesIdeais() {
  try {
    // Conecta ao MongoDB
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";
    console.log('📡 Conectando ao MongoDB...');
    
    await mongoose.connect(mongoUrl);
    console.log('✅ Conectado ao MongoDB!');
    
    // Importa o modelo
    await import('../models/Condicoes_ideais.js');
    const CondicoesIdeais = mongoose.model('CondicoesIdeais');
    
    // Conta registros antes da limpeza
    const countBefore = await CondicoesIdeais.countDocuments();
    console.log(`📊 Registros encontrados: ${countBefore}`);
    
    if (countBefore === 0) {
      console.log('✅ Nenhum registro para limpar!');
      return;
    }
    
    // Mostra alguns registros antes da limpeza
    console.log('\n📋 Últimos registros antes da limpeza:');
    const sampleRecords = await CondicoesIdeais.find().limit(5).sort({ _id: -1 });
    sampleRecords.forEach((record, index) => {
      console.log(`   ${index + 1}. ID: ${record._id}`);
      console.log(`      Tipo Camarão: ${record.id_tipo_camarao}`);
      console.log(`      Temp Ideal: ${record.temp_ideal}°C`);
      console.log(`      pH Ideal: ${record.ph_ideal}`);
      console.log(`      Amônia Ideal: ${record.amonia_ideal} mg/L`);
      console.log(`      Criado em: ${record.createdAt}`);
      console.log('');
    });
    
    // Confirmação do usuário
    console.log('⚠️  ATENÇÃO: Esta ação irá REMOVER TODOS os registros de condições ideais!');
    console.log('   Para continuar, digite "CONFIRMAR" (exatamente assim):');
    
    // Simula confirmação (em produção, você pode usar readline)
    const confirmacao = process.argv[2];
    
    if (confirmacao !== 'CONFIRMAR') {
      console.log('❌ Operação cancelada. Use: node clear-condicoes-ideais.js CONFIRMAR');
      return;
    }
    
    console.log('\n🔄 Iniciando limpeza...');
    
    // Remove todos os registros
    const result = await CondicoesIdeais.deleteMany({});
    
    console.log(`✅ Limpeza concluída!`);
    console.log(`📊 Registros removidos: ${result.deletedCount}`);
    
    // Verifica se realmente foram removidos
    const countAfter = await CondicoesIdeais.countDocuments();
    console.log(`📊 Registros restantes: ${countAfter}`);
    
    if (countAfter === 0) {
      console.log('✅ Todos os registros foram removidos com sucesso!');
    } else {
      console.log('⚠️  Alguns registros ainda permanecem no banco.');
    }
    
    // Opção para limpar também cativeiros que referenciam condições ideais
    console.log('\n🔍 Verificando cativeiros que referenciam condições ideais...');
    
    await import('../models/Cativeiros.js');
    const Cativeiros = mongoose.model('Cativeiros');
    
    const cativeirosComCondicoes = await Cativeiros.find({ condicoes_ideais: { $exists: true, $ne: null } });
    console.log(`📊 Cativeiros com condições ideais: ${cativeirosComCondicoes.length}`);
    
    if (cativeirosComCondicoes.length > 0) {
      console.log('\n📋 Cativeiros afetados:');
      cativeirosComCondicoes.forEach((cativeiro, index) => {
        console.log(`   ${index + 1}. ${cativeiro.nome || cativeiro._id}`);
        console.log(`      Condições Ideais ID: ${cativeiro.condicoes_ideais}`);
        console.log('');
      });
      
      console.log('❓ Deseja também limpar as referências nos cativeiros? (S/N)');
      const limparCativeiros = process.argv[3];
      
      if (limparCativeiros === 'S') {
        console.log('🔄 Limpando referências nos cativeiros...');
        const updateResult = await Cativeiros.updateMany(
          { condicoes_ideais: { $exists: true } },
          { $unset: { condicoes_ideais: "" } }
        );
        console.log(`✅ Referências removidas de ${updateResult.modifiedCount} cativeiros`);
      }
    }
    
    console.log('\n✅ Script concluído!');
    console.log('\n📋 RESUMO:');
    console.log(`   - Registros removidos: ${result.deletedCount}`);
    console.log(`   - Registros restantes: ${countAfter}`);
    console.log('   - Banco limpo com sucesso');
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error.message);
    console.error('🔧 Stack trace:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Desconectado do MongoDB');
  }
}

// Verifica se foi passado o parâmetro de confirmação
if (process.argv.length < 3) {
  console.log('❌ Uso: node clear-condicoes-ideais.js CONFIRMAR');
  console.log('   Para limpar também cativeiros: node clear-condicoes-ideais.js CONFIRMAR S');
  process.exit(1);
}

// Executa o script
clearCondicoesIdeais(); 