import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/Users.js";

// Carrega as variáveis de ambiente
dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";

async function removeUser() {
  try {
    console.log("🗑️ Removendo usuário gusta@gusta...");
    await mongoose.connect(mongoUrl);
    console.log("✅ Conexão com MongoDB estabelecida!");
    
    const emailToRemove = "gusta@gusta";
    
    // Verificar se o usuário existe
    const existingUser = await User.findOne({ email: emailToRemove });
    if (!existingUser) {
      console.log("❌ Usuário não encontrado");
      return;
    }
    
    console.log(`👤 Usuário encontrado: ${existingUser.nome} (${existingUser.email})`);
    console.log(`🆔 ID: ${existingUser._id}`);
    
    // Remover o usuário
    await User.findByIdAndDelete(existingUser._id);
    console.log("✅ Usuário removido com sucesso!");
    
    // Verificar se foi removido
    const checkUser = await User.findOne({ email: emailToRemove });
    if (!checkUser) {
      console.log("✅ Confirmação: Usuário não existe mais no banco");
    } else {
      console.log("❌ Erro: Usuário ainda existe no banco");
    }
    
  } catch (error) {
    console.error("❌ Erro durante a remoção:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Conexão com MongoDB fechada.");
  }
}

removeUser(); 