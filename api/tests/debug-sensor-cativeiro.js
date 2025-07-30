#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente
dotenv.config();

console.log('🔍 Diagnóstico SensoresxCativeiros');
console.log('==================================\n');

// Conecta ao MongoDB
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";
console.log('📡 Conectando ao MongoDB...');

mongoose.connect(mongoUrl)
.then(async () => {
  console.log('✅ Conectado ao MongoDB Atlas!');
  
  // Importa os modelos
  await import('../models/SensoresxCativeiros.js');
  await import('../models/Sensores.js');
  await import('../models/Cativeiros.js');
  
  const SensoresxCativeiros = mongoose.model('SensoresxCativeiros');
  
  try {
    // Verifica se a coleção existe
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === 'SensoresxCativeiros');
    
    console.log(`📊 Coleção SensoresxCativeiros existe: ${collectionExists ? '✅ SIM' : '❌ NÃO'}`);
    
    if (collectionExists) {
      // Conta documentos na coleção
      const count = await SensoresxCativeiros.countDocuments();
      console.log(`📈 Total de relações: ${count}`);
      
      if (count > 0) {
        // Lista as relações
        const relacoes = await SensoresxCativeiros.find()
          .populate('id_sensor')
          .populate('id_cativeiro');
        
        console.log('\n🔗 Relações encontradas:');
        relacoes.forEach((relacao, index) => {
          console.log(`${index + 1}. Sensor: ${relacao.id_sensor?.nome || relacao.id_sensor} -> Cativeiro: ${relacao.id_cativeiro?._id || relacao.id_cativeiro}`);
        });
      } else {
        console.log('⚠️  Nenhuma relação encontrada na coleção');
      }
    }
    
    // Verifica se há sensores cadastrados
    const Sensores = mongoose.model('Sensores');
    const sensoresCount = await Sensores.countDocuments();
    console.log(`\n📡 Total de sensores cadastrados: ${sensoresCount}`);
    
    // Verifica se há cativeiros cadastrados
    const Cativeiros = mongoose.model('Cativeiros');
    const cativeirosCount = await Cativeiros.countDocuments();
    console.log(`🏠 Total de cativeiros cadastrados: ${cativeirosCount}`);
    
    console.log('\n💡 Possíveis problemas:');
    console.log('1. API não está rodando');
    console.log('2. Campo sensorId não foi enviado no cadastro');
    console.log('3. IDs de sensor ou cativeiro inválidos');
    console.log('4. Erro na criação da relação');
    
    console.log('\n🔧 Para testar:');
    console.log('1. Certifique-se que a API está rodando: npm start');
    console.log('2. Cadastre um cativeiro com sensorId válido');
    console.log('3. Verifique os logs da API para erros');
    
  } catch (error) {
    console.error('❌ Erro durante diagnóstico:', error.message);
  }
  
  mongoose.connection.close();
})
.catch(err => {
  console.error('❌ Erro na conexão:', err.message);
}); 