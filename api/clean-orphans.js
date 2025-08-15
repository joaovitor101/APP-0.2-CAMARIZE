import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Importar todos os modelos necessários
import './models/Users.js';
import './models/Fazendas.js';
import './models/Cativeiros.js';
import './models/UsuariosxFazendas.js';
import './models/FazendasxCativeiros.js';

dotenv.config();

async function cleanOrphans() {
  try {
    console.log('🔍 Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/camarize');
    console.log('✅ Conectado!');

    console.log('\n🧹 Limpando relacionamentos órfãos...\n');

    // Importar modelos após conexão
    const FazendasxCativeiros = (await import('./models/FazendasxCativeiros.js')).default;
    const Cativeiros = (await import('./models/Cativeiros.js')).default;

    // Buscar todos os relacionamentos
    const allRels = await FazendasxCativeiros.find();
    console.log(`📊 Total de relacionamentos: ${allRels.length}`);

    // Verificar quais relacionamentos são órfãos
    let orphanCount = 0;
    for (const rel of allRels) {
      const cativeiroExists = await Cativeiros.findById(rel.cativeiro);
      if (!cativeiroExists) {
        console.log(`🗑️ Relacionamento órfão encontrado: Cativeiro ${rel.cativeiro} não existe`);
        await FazendasxCativeiros.findByIdAndDelete(rel._id);
        orphanCount++;
      }
    }

    console.log(`\n✅ Limpeza concluída! ${orphanCount} relacionamentos órfãos removidos.`);

    // Verificar resultado
    const remainingRels = await FazendasxCativeiros.find();
    console.log(`📊 Relacionamentos restantes: ${remainingRels.length}`);

    await mongoose.disconnect();

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

cleanOrphans();
