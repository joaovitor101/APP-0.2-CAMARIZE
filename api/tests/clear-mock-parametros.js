#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente
dotenv.config();

console.log('🗑️  Limpando dados mockados de parâmetros atuais...');
console.log('==================================================\n');

async function clearMockParametros() {
  try {
    // Conecta ao MongoDB
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";
    console.log('📡 Conectando ao MongoDB...');
    
    await mongoose.connect(mongoUrl);
    console.log('✅ Conectado ao MongoDB Atlas!');
    
    // Importa os modelos
    await import('../models/Parametros_atuais.js');
    
    const ParametrosAtuais = mongoose.model('ParametrosAtuais');
    
    // Conta quantos registros existem
    const totalRegistros = await ParametrosAtuais.countDocuments();
    console.log(`📊 Total de registros encontrados: ${totalRegistros}`);
    
    if (totalRegistros === 0) {
      console.log('✅ Nenhum registro para remover.');
      return;
    }
    
    // Mostra alguns registros antes de remover
    console.log('\n📋 Últimos 3 registros (serão removidos):');
    const ultimosRegistros = await ParametrosAtuais.find()
      .sort({ datahora: -1 })
      .limit(3);
    
    ultimosRegistros.forEach((registro, index) => {
      console.log(`  ${index + 1}. ID: ${registro._id}`);
      console.log(`     Temperatura: ${registro.temp_atual}°C`);
      console.log(`     pH: ${registro.ph_atual}`);
      console.log(`     Amônia: ${registro.amonia_atual}mg/L`);
      console.log(`     Cativeiro: ${registro.id_cativeiro}`);
      console.log(`     Data/Hora: ${registro.datahora.toLocaleString()}`);
      console.log('');
    });
    
    // Remove todos os registros
    console.log('🗑️  Removendo todos os registros...');
    const resultado = await ParametrosAtuais.deleteMany({});
    
    console.log(`✅ Removidos ${resultado.deletedCount} registros com sucesso!`);
    console.log('📊 Coleção "parametros_atuais" está limpa.');
    console.log('\n💡 Agora você pode adicionar dados customizados usando:');
    console.log('   npm run add-custom-parametros');
    
  } catch (error) {
    console.error('❌ Erro ao limpar dados mockados:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔚 Conexão fechada');
  }
}

clearMockParametros(); 