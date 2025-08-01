#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";
import CondicoesIdeais from "./models/Condicoes_ideais.js";
import Cativeiros from "./models/Cativeiros.js";
import ParametrosAtuais from "./models/Parametros_atuais.js";
import TiposCamarao from "./models/Camaroes.js";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";

async function debugNotifications() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ Conectado ao MongoDB");

    console.log("\n🔍 Debugando notificações...");
    
    // Busca todos os cativeiros com seus parâmetros atuais e condições ideais
    const cativeiros = await Cativeiros.find()
      .populate('condicoes_ideais')
      .populate('id_tipo_camarao');
    
    for (const cativeiro of cativeiros) {
      console.log(`\n📊 Cativeiro: ${cativeiro.nome}`);
      console.log(`   Tipo: ${cativeiro.id_tipo_camarao?.nome}`);
      
      if (!cativeiro.condicoes_ideais) {
        console.log("   ⚠️  Sem condições ideais");
        continue;
      }
      
      const condicaoIdeal = cativeiro.condicoes_ideais;
      console.log(`   Condições ideais:`);
      console.log(`     Temp: ${condicaoIdeal.temp_ideal}°C`);
      console.log(`     pH: ${condicaoIdeal.ph_ideal}`);
      console.log(`     Amônia: ${condicaoIdeal.amonia_ideal}mg/L`);
      
      // Busca o parâmetro atual mais recente para este cativeiro
      const parametroAtual = await ParametrosAtuais.findOne({ 
        id_cativeiro: cativeiro._id 
      }).sort({ datahora: -1 });
      
      if (!parametroAtual) {
        console.log("   ⚠️  Sem parâmetros atuais");
        continue;
      }
      
      console.log(`   Parâmetro mais recente (${parametroAtual.datahora}):`);
      console.log(`     Temp: ${parametroAtual.temp_atual}°C`);
      console.log(`     pH: ${parametroAtual.ph_atual}`);
      console.log(`     Amônia: ${parametroAtual.amonia_atual}mg/L`);
      
      // Testa a lógica de notificações
      const tolerancia = 0.1; // 10%
      
      console.log(`   Análise de tolerância (${tolerancia * 100}%):`);
      
      // Testa temperatura
      if (condicaoIdeal.temp_ideal) {
        const diffTemp = Math.abs(parametroAtual.temp_atual - condicaoIdeal.temp_ideal);
        const toleranciaTemp = condicaoIdeal.temp_ideal * tolerancia;
        const severidade = diffTemp > toleranciaTemp * 2 ? 'alta' : 'media';
        
        console.log(`     Temperatura:`);
        console.log(`       Diferença: ${diffTemp.toFixed(2)}°C`);
        console.log(`       Tolerância: ${toleranciaTemp.toFixed(2)}°C`);
        console.log(`       Fora da tolerância: ${diffTemp > toleranciaTemp ? 'SIM' : 'NÃO'}`);
        console.log(`       Severidade: ${severidade}`);
      }
      
      // Testa pH
      if (condicaoIdeal.ph_ideal) {
        const diffPh = Math.abs(parametroAtual.ph_atual - condicaoIdeal.ph_ideal);
        const toleranciaPh = condicaoIdeal.ph_ideal * tolerancia;
        const severidade = diffPh > toleranciaPh * 2 ? 'alta' : 'media';
        
        console.log(`     pH:`);
        console.log(`       Diferença: ${diffPh.toFixed(3)}`);
        console.log(`       Tolerância: ${toleranciaPh.toFixed(3)}`);
        console.log(`       Fora da tolerância: ${diffPh > toleranciaPh ? 'SIM' : 'NÃO'}`);
        console.log(`       Severidade: ${severidade}`);
      }
      
      // Testa amônia
      if (condicaoIdeal.amonia_ideal) {
        const diffAmonia = Math.abs(parametroAtual.amonia_atual - condicaoIdeal.amonia_ideal);
        const toleranciaAmonia = condicaoIdeal.amonia_ideal * tolerancia;
        const severidade = diffAmonia > toleranciaAmonia * 2 ? 'alta' : 'media';
        
        console.log(`     Amônia:`);
        console.log(`       Diferença: ${diffAmonia.toFixed(4)}mg/L`);
        console.log(`       Tolerância: ${toleranciaAmonia.toFixed(4)}mg/L`);
        console.log(`       Fora da tolerância: ${diffAmonia > toleranciaAmonia ? 'SIM' : 'NÃO'}`);
        console.log(`       Severidade: ${severidade}`);
      }
    }

  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Desconectado do MongoDB");
  }
}

debugNotifications(); 