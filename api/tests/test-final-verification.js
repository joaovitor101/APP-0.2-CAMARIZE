import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/Users.js";
import Fazendas from "../models/Fazendas.js";

// Carrega as variáveis de ambiente
dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";

async function finalVerification() {
  try {
    console.log("🔍 Verificação final do sistema...");
    await mongoose.connect(mongoUrl);
    console.log("✅ Conexão com MongoDB estabelecida!");
    
    // Verificar se há usuários no banco
    const users = await User.find();
    console.log(`📊 Total de usuários no banco: ${users.length}`);
    
    if (users.length > 0) {
      console.log("👥 Últimos usuários cadastrados:");
      users.slice(-5).forEach(user => {
        console.log(`  - ${user.nome} (${user.email}) - ID: ${user._id}`);
      });
    }
    
    // Verificar se há fazendas no banco
    const fazendas = await Fazendas.find();
    console.log(`🏭 Total de fazendas no banco: ${fazendas.length}`);
    
    if (fazendas.length > 0) {
      console.log("🏭 Últimas fazendas cadastradas:");
      fazendas.slice(-5).forEach(fazenda => {
        console.log(`  - ${fazenda.nome} - Código: ${fazenda.codigo} - ID: ${fazenda._id}`);
      });
    }
    
    console.log("\n✅ Verificação final concluída!");
    console.log("💡 Se você vê usuários e fazendas listados acima, o sistema está funcionando corretamente.");
    console.log("💡 Se não vê dados, pode ser que o problema ainda persista no frontend.");
    
  } catch (error) {
    console.error("❌ Erro durante a verificação:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Conexão com MongoDB fechada.");
  }
}

finalVerification(); 