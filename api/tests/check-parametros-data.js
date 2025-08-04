import mongoose from "mongoose";
import dotenv from "dotenv";
import ParametrosAtuais from "../models/Parametros_atuais.js";
import Cativeiros from "../models/Cativeiros.js";

// Carrega as variáveis de ambiente
dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";

async function checkParametrosData() {
  try {
    console.log("🔍 Verificando dados de parâmetros...");
    await mongoose.connect(mongoUrl);
    console.log("✅ Conexão com MongoDB estabelecida!");
    
    // Verificar se há cativeiros
    console.log("\n🏠 Cativeiros no banco:");
    const cativeiros = await Cativeiros.find();
    console.log(`Total: ${cativeiros.length} cativeiros`);
    
    cativeiros.forEach((cativeiro, index) => {
      console.log(`  ${index + 1}. ${cativeiro.nome} (ID: ${cativeiro._id})`);
    });
    
    // Verificar se há parâmetros
    console.log("\n📊 Parâmetros no banco:");
    const parametros = await ParametrosAtuais.find();
    console.log(`Total: ${parametros.length} registros de parâmetros`);
    
    if (parametros.length === 0) {
      console.log("❌ Nenhum parâmetro encontrado!");
      console.log("💡 Você precisa popular a tabela parametros_atuais com dados.");
    } else {
      parametros.forEach((parametro, index) => {
        console.log(`  ${index + 1}. Cativeiro: ${parametro.id_cativeiro}`);
        console.log(`     Temperatura: ${parametro.temp_atual}°C`);
        console.log(`     pH: ${parametro.ph_atual}`);
        console.log(`     Amônia: ${parametro.amonia_atual} mg/L`);
        console.log(`     Data/Hora: ${parametro.datahora}`);
        console.log(`     ---`);
      });
    }
    
    // Verificar se há parâmetros para cada cativeiro
    if (cativeiros.length > 0) {
      console.log("\n🔍 Verificando parâmetros por cativeiro:");
      for (const cativeiro of cativeiros) {
        const parametrosCativeiro = await ParametrosAtuais.find({ 
          id_cativeiro: cativeiro._id 
        });
        console.log(`  ${cativeiro.nome}: ${parametrosCativeiro.length} registros`);
      }
    }
    
  } catch (error) {
    console.error("❌ Erro durante a verificação:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Conexão com MongoDB fechada.");
  }
}

checkParametrosData(); 