import fetch from 'node-fetch';

const API_URL = 'http://localhost:4000';

async function testFrontendFlow() {
  console.log("🧪 Testando fluxo completo do frontend...");
  
  try {
    // Simular o fluxo do frontend: registro -> login -> cadastro de fazenda
    
    // 1. REGISTRO DE USUÁRIO (como no RegisterContent)
    console.log("\n📝 1. Registrando usuário (como no frontend)...");
    const registerData = {
      nome: "Usuário Frontend Test",
      email: "frontend@test.com",
      senha: "123456",
      foto_perfil: null
    };
    
    const registerResponse = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    });
    
    console.log("Status do registro:", registerResponse.status);
    
    if (!registerResponse.ok) {
      const errorText = await registerResponse.text();
      console.log("❌ Erro no registro:", errorText);
      return;
    }
    
    const registerResult = await registerResponse.json();
    console.log("✅ Registro bem-sucedido:", registerResult);
    
    // 2. LOGIN AUTOMÁTICO (como no frontend)
    console.log("\n🔐 2. Fazendo login automático...");
    const loginResponse = await fetch(`${API_URL}/users/auth`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: registerData.email,
        senha: registerData.senha
      })
    });
    
    console.log("Status do login:", loginResponse.status);
    
    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.log("❌ Erro no login:", errorText);
      return;
    }
    
    const loginResult = await loginResponse.json();
    console.log("✅ Login bem-sucedido, token recebido");
    
    // 3. BUSCAR USUÁRIO PELO ID (como no frontend)
    console.log("\n👤 3. Buscando usuário pelo ID...");
    const decoded = JSON.parse(Buffer.from(loginResult.token.split('.')[1], 'base64').toString());
    const userId = decoded.id;
    console.log("ID do usuário extraído do token:", userId);
    
    const userResponse = await fetch(`${API_URL}/users/${userId}`);
    console.log("Status da busca do usuário:", userResponse.status);
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log("✅ Usuário encontrado:", userData.nome);
    } else {
      console.log("❌ Erro ao buscar usuário");
    }
    
    // 4. CADASTRO DE FAZENDA (como no frontend)
    console.log("\n🏭 4. Cadastrando fazenda...");
    const fazendaData = {
      nome: "Fazenda Frontend Test",
      rua: "Rua Frontend",
      bairro: "Bairro Frontend",
      cidade: "Cidade Frontend",
      numero: 123
    };
    
    const fazendaResponse = await fetch(`${API_URL}/fazendas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginResult.token}`
      },
      body: JSON.stringify(fazendaData)
    });
    
    console.log("Status do cadastro de fazenda:", fazendaResponse.status);
    
    if (fazendaResponse.ok) {
      const fazendaResult = await fazendaResponse.json();
      console.log("✅ Fazenda cadastrada:", fazendaResult);
    } else {
      const errorText = await fazendaResponse.text();
      console.log("❌ Erro ao cadastrar fazenda:", errorText);
    }
    
    console.log("\n🎉 Teste do fluxo frontend concluído!");
    
  } catch (error) {
    console.error("❌ Erro durante o teste:", error);
  }
}

testFrontendFlow(); 