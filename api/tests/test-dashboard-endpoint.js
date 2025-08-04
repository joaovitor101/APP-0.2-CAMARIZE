#!/usr/bin/env node

import axios from 'axios';

const API_URL = 'http://localhost:4000';
const cativeiroId = '6890ab0102816c0ffab726e2'; // ID do cativeiro que existe

async function testDashboardEndpoint() {
  console.log("🧪 Testando endpoint do dashboard...");
  
  try {
    // Teste 1: Sem autenticação (deve retornar 401)
    console.log("\n📡 Teste 1: Sem autenticação");
    try {
      const response = await axios.get(`${API_URL}/parametros/dashboard/${cativeiroId}`);
      console.log("❌ ERRO: Deveria ter retornado 401, mas retornou:", response.status);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Correto: Retornou 401 (não autorizado)");
      } else {
        console.log("❌ ERRO: Retornou status inesperado:", error.response?.status);
      }
    }
    
    // Teste 2: Com token válido (deve retornar 200)
    console.log("\n📡 Teste 2: Com autenticação");
    try {
      // Primeiro fazer login para obter token
      const loginResponse = await axios.post(`${API_URL}/users/auth`, {
        email: "j@j",
        senha: "123"
      });
      
      const token = loginResponse.data.token;
      console.log("✅ Login realizado, token obtido");
      
      // Agora testar o endpoint do dashboard
      const dashboardResponse = await axios.get(`${API_URL}/parametros/dashboard/${cativeiroId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("✅ Dashboard funcionando!");
      console.log("📊 Dados retornados:");
      console.log(`  - Cativeiro: ${dashboardResponse.data.cativeiro.nome}`);
      console.log(`  - Temperatura atual: ${dashboardResponse.data.dadosAtuais.temperatura}°C`);
      console.log(`  - pH atual: ${dashboardResponse.data.dadosAtuais.ph}`);
      console.log(`  - Amônia atual: ${dashboardResponse.data.dadosAtuais.amonia} mg/L`);
      console.log(`  - Dados semanais: ${dashboardResponse.data.dadosSemanais.length} registros`);
      
    } catch (error) {
      console.log("❌ ERRO no teste 2:", error.response?.status, error.response?.data);
    }
    
    // Teste 3: ID inválido (deve retornar 404)
    console.log("\n📡 Teste 3: ID inválido");
    try {
             const loginResponse = await axios.post(`${API_URL}/users/auth`, {
         email: "j@j",
         senha: "123"
       });
      
      const token = loginResponse.data.token;
      
      const response = await axios.get(`${API_URL}/parametros/dashboard/123456789012345678901234`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("❌ ERRO: Deveria ter retornado 404, mas retornou:", response.status);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("✅ Correto: Retornou 404 (cativeiro não encontrado)");
      } else {
        console.log("❌ ERRO: Retornou status inesperado:", error.response?.status);
      }
    }
    
  } catch (error) {
    console.error("❌ Erro durante o teste:", error);
  }
}

testDashboardEndpoint(); 