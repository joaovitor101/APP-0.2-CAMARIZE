import axios from 'axios';

async function testStatusDetalhado() {
  try {
    console.log('🧪 Testando endpoint de status detalhado dos cativeiros...');

    const apiUrl = process.env.API_URL || "http://localhost:4000";

    // Primeiro, vamos fazer login para obter um token
    const loginResponse = await axios.post(`${apiUrl}/users/login`, {
      email: "teste@teste.com",
      password: "123456"
    });

    if (!loginResponse.data.token) {
      console.error('❌ Falha no login');
      return;
    }

    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');

    // Agora vamos testar o endpoint de status dos cativeiros
    const statusResponse = await axios.get(`${apiUrl}/cativeiros-status`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('📊 Resposta do endpoint de status:');
    console.log(JSON.stringify(statusResponse.data, null, 2));

    if (statusResponse.data.success) {
      console.log('✅ Endpoint de status funcionando corretamente!');
      console.log(`📈 Total de cativeiros: ${statusResponse.data.cativeiros?.length || 0}`);

      if (statusResponse.data.cativeiros && statusResponse.data.cativeiros.length > 0) {
        console.log('\n📋 Status dos cativeiros:');
        statusResponse.data.cativeiros.forEach((cativeiro, index) => {
          console.log(`${index + 1}. ${cativeiro.nome} - Status: ${cativeiro.statusText} (${cativeiro.status})`);
          if (cativeiro.alertas && cativeiro.alertas.length > 0) {
            console.log(`   Alertas: ${cativeiro.alertas.join(', ')}`);
          }
          console.log(`   Total de alertas: ${cativeiro.totalAlertas}`);

          // Verifica se há detalhes dos alertas
          if (cativeiro.alertasDetalhados && cativeiro.alertasDetalhados.length > 0) {
            console.log(`   📝 Detalhes dos alertas:`);
            cativeiro.alertasDetalhados.forEach((alerta, alertaIndex) => {
              console.log(`      ${alertaIndex + 1}. ${alerta.tipo} - ${alerta.severidade}`);
              console.log(`         Mensagem: ${alerta.mensagem}`);
              console.log(`         Atual: ${alerta.valorAtual}, Ideal: ${alerta.valorIdeal}, Diferença: ${alerta.diferenca}`);
            });
          }
        });
      }
    } else {
      console.error('❌ Erro no endpoint de status');
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

// Executa o teste
testStatusDetalhado(); 