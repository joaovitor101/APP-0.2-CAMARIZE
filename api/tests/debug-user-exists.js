import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/Users.js";

// Carrega as variáveis de ambiente
dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";

async function debugUserExists() {
  try {
    console.log("🔍 Debugando problema de usuário já existente...");
    await mongoose.connect(mongoUrl);
    console.log("✅ Conexão com MongoDB estabelecida!");
    
    const testEmail = "gusta@gusta";
    
    // 1. Verificar se há usuários com esse email
    console.log(`\n📧 Verificando usuários com email: ${testEmail}`);
    const usersWithEmail = await User.find({ email: testEmail });
    console.log(`Encontrados ${usersWithEmail.length} usuários com este email`);
    
    if (usersWithEmail.length > 0) {
      usersWithEmail.forEach((user, index) => {
        console.log(`  ${index + 1}. ID: ${user._id}, Nome: ${user.nome}, Email: ${user.email}`);
      });
    }
    
    // 2. Verificar se há usuários com email similar (case insensitive)
    console.log(`\n🔍 Verificando emails similares (case insensitive)...`);
    const similarUsers = await User.find({
      email: { $regex: new RegExp(testEmail, 'i') }
    });
    console.log(`Encontrados ${similarUsers.length} usuários com email similar`);
    
    if (similarUsers.length > 0) {
      similarUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ID: ${user._id}, Nome: ${user.nome}, Email: ${user.email}`);
      });
    }
    
    // 3. Listar todos os usuários para verificar
    console.log(`\n👥 Listando todos os usuários no banco:`);
    const allUsers = await User.find();
    console.log(`Total de usuários: ${allUsers.length}`);
    
    allUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ID: ${user._id}, Nome: ${user.nome}, Email: ${user.email}`);
    });
    
    // 4. Testar a função getOne diretamente
    console.log(`\n🧪 Testando função getOne com email: ${testEmail}`);
    const foundUser = await User.findOne({ email: testEmail });
    console.log(`Resultado da busca:`, foundUser ? `Usuário encontrado (${foundUser._id})` : "Usuário não encontrado");
    
    // 5. Verificar se há problemas de case sensitivity
    console.log(`\n🔤 Testando variações de case:`);
    const variations = [
      testEmail,
      testEmail.toLowerCase(),
      testEmail.toUpperCase(),
      "GUSTA@GUSTA",
      "gusta@gusta"
    ];
    
    for (const variation of variations) {
      const user = await User.findOne({ email: variation });
      console.log(`  "${variation}": ${user ? "ENCONTRADO" : "não encontrado"}`);
    }
    
  } catch (error) {
    console.error("❌ Erro durante o debug:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Conexão com MongoDB fechada.");
  }
}

debugUserExists(); 