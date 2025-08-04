import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/Users.js";

// Carrega as variáveis de ambiente
dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";

async function checkUserSaved() {
  try {
    console.log("🔍 Verificando se o usuário foi salvo no banco...");
    await mongoose.connect(mongoUrl);
    console.log("✅ Conexão com MongoDB estabelecida!");
    
    const testEmail = "teste.real@teste.com";
    
    // Verificar se o usuário existe no banco
    console.log(`\n📧 Buscando usuário com email: ${testEmail}`);
    const user = await User.findOne({ email: testEmail });
    
    if (user) {
      console.log("✅ Usuário encontrado no banco!");
      console.log("📋 Dados do usuário:");
      console.log(`  - ID: ${user._id}`);
      console.log(`  - Nome: ${user.nome}`);
      console.log(`  - Email: ${user.email}`);
      console.log(`  - Senha: ${user.senha}`);
      console.log(`  - Foto: ${user.foto_perfil}`);
      console.log(`  - Fazenda: ${user.fazenda}`);
      console.log(`  - Criado em: ${user.createdAt || 'N/A'}`);
    } else {
      console.log("❌ Usuário NÃO encontrado no banco!");
    }
    
    // Listar todos os usuários para comparação
    console.log(`\n👥 Todos os usuários no banco:`);
    const allUsers = await User.find();
    console.log(`Total: ${allUsers.length} usuários`);
    
    allUsers.forEach((u, index) => {
      console.log(`  ${index + 1}. ${u.nome} (${u.email}) - ID: ${u._id}`);
    });
    
  } catch (error) {
    console.error("❌ Erro durante a verificação:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Conexão com MongoDB fechada.");
  }
}

checkUserSaved(); 