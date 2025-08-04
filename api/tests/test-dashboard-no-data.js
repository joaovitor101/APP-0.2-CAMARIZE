import axios from 'axios';

const API_URL = 'http://localhost:4000';

async function testDashboardNoData() {
  console.log("🧪 Testando dashboard sem dados...");
  
  try {
    // Primeiro fazer login
    const loginResponse = await axios.post(`${API_URL}/users/auth`, {
      email: "j@j",
      senha: "123"
    });
    
    const token = loginResponse.data.token;
    console.log("✅ Login realizado");
    
    // Buscar todos os cativeiros
    const cativeirosResponse = await axios.get(`${API_URL}/cativeiros`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`📋 Encontrados ${cativeirosResponse.data.length} cativeiros`);
    
    // Testar cada cativeiro
    for (const cativeiro of cativeirosResponse.data) {
      console.log(`\n🔍 Testando cativeiro: ${cativeiro.nome} (${cativeiro._id})`);
      
      try {
        const dashboardResponse = await axios.get(`${API_URL}/parametros/dashboard/${cativeiro._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const dados = dashboardResponse.data;
        console.log(`✅ Dashboard funcionando!`);
        console.log(`  - Temperatura: ${dados.dadosAtuais.temperatura}`);
        console.log(`  - pH: ${dados.dadosAtuais.ph}`);
        console.log(`  - Amônia: ${dados.dadosAtuais.amonia}`);
        
        // Verificar se tem "#" quando não há dados
        if (dados.dadosAtuais.temperatura === "#") {
          console.log(`  🎯 CORRETO: Retornando "#" para dados vazios`);
        }
        
      } catch (error) {
        console.log(`❌ ERRO: ${error.response?.status} - ${error.response?.data?.error}`);
      }
    }
    
  } catch (error) {
    console.error("❌ Erro durante o teste:", error.response?.data || error.message);
  }
}

testDashboardNoData(); 