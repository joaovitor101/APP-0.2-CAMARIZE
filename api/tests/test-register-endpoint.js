import fetch from 'node-fetch';

const API_URL = 'http://localhost:4000';

async function testRegisterEndpoint() {
  console.log("🧪 Testando endpoint de registro...");
  
  try {
    // Teste 1: Registrar usuário
    console.log("\n📝 Teste 1: Registrando usuário...");
    const registerResponse = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: "Usuário Teste Endpoint",
        email: "teste@endpoint.com",
        senha: "123456",
        foto_perfil: null
      })
    });
    
    console.log("Status do registro:", registerResponse.status);
    console.log("Headers:", registerResponse.headers.raw());
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log("✅ Registro bem-sucedido:", registerData);
      
      // Teste 2: Fazer login com o usuário registrado
      console.log("\n🔐 Teste 2: Fazendo login...");
      const loginResponse = await fetch(`${API_URL}/users/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: "teste@endpoint.com",
          senha: "123456"
        })
      });
      
      console.log("Status do login:", loginResponse.status);
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log("✅ Login bem-sucedido:", loginData);
        
        // Teste 3: Registrar fazenda com o token
        console.log("\n🏭 Teste 3: Registrando fazenda...");
        const fazendaResponse = await fetch(`${API_URL}/fazendas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.token}`
          },
          body: JSON.stringify({
            nome: "Fazenda Teste Endpoint",
            rua: "Rua Teste",
            bairro: "Bairro Teste",
            cidade: "Cidade Teste",
            numero: 123
          })
        });
        
        console.log("Status da fazenda:", fazendaResponse.status);
        
        if (fazendaResponse.ok) {
          const fazendaData = await fazendaResponse.json();
          console.log("✅ Fazenda registrada:", fazendaData);
        } else {
          const errorData = await fazendaResponse.text();
          console.log("❌ Erro ao registrar fazenda:", errorData);
        }
      } else {
        const errorData = await loginResponse.text();
        console.log("❌ Erro no login:", errorData);
      }
    } else {
      const errorData = await registerResponse.text();
      console.log("❌ Erro no registro:", errorData);
    }
    
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
  }
}

testRegisterEndpoint(); 