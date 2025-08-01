#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente
dotenv.config();

console.log('🧹 Script Rápido - Limpar Condições Ideais');
console.log('==========================================\n');

async function quickClearCondicoes() {
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
    
    console.log('🔄 Removendo todos os registros...');
    
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
    
    console.log('\n✅ Script concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Desconectado do MongoDB');
  }
}

// Executa o script
quickClearCondicoes(); 