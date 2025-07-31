#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";
import CondicoesIdeais from "./models/Condicoes_ideais.js";
import Cativeiros from "./models/Cativeiros.js";
import TiposCamarao from "./models/Camaroes.js";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";

async function fixCondicoesIdeais() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ Conectado ao MongoDB");

    console.log("\n🔧 Verificando e corrigindo condições ideais incorretas...");
    
    // Busca todas as condições ideais
    const condicoes = await CondicoesIdeais.find();
    console.log(`📊 Total de condições ideais encontradas: ${condicoes.length}`);
    
    let corrigidas = 0;
    
    for (const condicao of condicoes) {
      let precisaCorrigir = false;
      const valoresCorrigidos = {};
      
      // Verifica temperatura
      if (condicao.temp_ideal < 10 || condicao.temp_ideal > 40) {
        console.log(`⚠️  Temperatura incorreta: ${condicao.temp_ideal}°C -> corrigindo para 26°C`);
        valoresCorrigidos.temp_ideal = 26;
        precisaCorrigir = true;
      }
      
      // Verifica pH
      if (condicao.ph_ideal < 5 || condicao.ph_ideal > 10) {
        console.log(`⚠️  pH incorreto: ${condicao.ph_ideal} -> corrigindo para 7.5`);
        valoresCorrigidos.ph_ideal = 7.5;
        precisaCorrigir = true;
      }
      
      // Verifica amônia
      if (condicao.amonia_ideal < 0.01 || condicao.amonia_ideal > 1) {
        console.log(`⚠️  Amônia incorreta: ${condicao.amonia_ideal}mg/L -> corrigindo para 0.05mg/L`);
        valoresCorrigidos.amonia_ideal = 0.05;
        precisaCorrigir = true;
      }
      
      if (precisaCorrigir) {
        await CondicoesIdeais.findByIdAndUpdate(condicao._id, valoresCorrigidos);
        corrigidas++;
        console.log(`✅ Condição ${condicao._id} corrigida`);
      }
    }
    
    console.log(`\n🎉 Correção concluída! ${corrigidas} condições ideais foram corrigidas.`);
    
    // Mostra as condições após a correção
    console.log("\n📊 Condições ideais após correção:");
    const condicoesCorrigidas = await CondicoesIdeais.find().populate('id_tipo_camarao');
    
    condicoesCorrigidas.forEach((condicao, index) => {
      console.log(`\n${index + 1}. Condição Ideal:`);
      console.log(`   Tipo de Camarão: ${condicao.id_tipo_camarao?.nome || 'N/A'}`);
      console.log(`   Temperatura Ideal: ${condicao.temp_ideal}°C`);
      console.log(`   pH Ideal: ${condicao.ph_ideal}`);
      console.log(`   Amônia Ideal: ${condicao.amonia_ideal}mg/L`);
    });

  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Desconectado do MongoDB");
  }
}

fixCondicoesIdeais(); 