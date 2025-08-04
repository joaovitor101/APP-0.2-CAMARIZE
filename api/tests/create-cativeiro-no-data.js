import mongoose from "mongoose";
import dotenv from "dotenv";
import Cativeiros from "../models/Cativeiros.js";

// Carrega as variáveis de ambiente
dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";

async function createCativeiroNoData() {
  try {
    console.log("🔍 Criando cativeiro sem dados...");
    await mongoose.connect(mongoUrl);
    console.log("✅ Conexão com MongoDB estabelecida!");
    
    // Criar um cativeiro de teste
    const novoCativeiro = new Cativeiros({
      nome: "Cativeiro Teste Sem Dados",
      capacidade: 1000,
      tipo_camarao: "Litopenaeus vannamei",
      data_inicio: new Date(),
      status: "Ativo"
    });
    
    await novoCativeiro.save();
    console.log(`✅ Cativeiro criado: ${novoCativeiro.nome} (ID: ${novoCativeiro._id})`);
    
    console.log("\n🎯 Agora você pode testar o dashboard com este cativeiro!");
    console.log(`📡 URL: http://localhost:3000/dashboard/${novoCativeiro._id}`);
    console.log(`🔧 Ou use o endpoint: GET /parametros/dashboard/${novoCativeiro._id}`);
    
  } catch (error) {
    console.error("❌ Erro durante a criação:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Conexão com MongoDB fechada.");
  }
}

createCativeiroNoData(); 