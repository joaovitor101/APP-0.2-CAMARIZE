import mongoose from 'mongoose';
import Cativeiros from '../models/Cativeiros.js';
import dotenv from 'dotenv';

dotenv.config();

const updateCativeiroNames = async () => {
  try {
    // Conectar ao MongoDB
    const mongoUri = process.env.MONGO_URL || process.env.MONGO_URL_LOCAL || 'mongodb://localhost:27017/camarize';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB');

    // Buscar todos os cativeiros
    const cativeiros = await Cativeiros.find();
    console.log(`📊 Encontrados ${cativeiros.length} cativeiros`);

    let updatedCount = 0;

    for (const cativeiro of cativeiros) {
      // Se o cativeiro não tem nome ou o nome está vazio
      if (!cativeiro.nome || cativeiro.nome.trim() === '') {
        const novoNome = `Cativeiro ${cativeiro.id_cativeiro || cativeiro._id.toString().slice(-6)}`;
        
        await Cativeiros.findByIdAndUpdate(cativeiro._id, { nome: novoNome });
        console.log(`✅ Atualizado: ${cativeiro._id} -> ${novoNome}`);
        updatedCount++;
      } else {
        console.log(`ℹ️  Já tem nome: ${cativeiro._id} -> ${cativeiro.nome}`);
      }
    }

    console.log(`\n🎉 Processo concluído! ${updatedCount} cativeiros foram atualizados.`);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
  }
};

// Executar o script
updateCativeiroNames(); 