import fetch from 'node-fetch';

const API_URL = 'http://localhost:4000';

async function testGustaSpecific() {
  console.log("🧪 Testando especificamente o email gusta@gusta...");
  
  try {
    // 1. Verificar se o usuário gusta@gusta existe
    console.log("\n📧 1. Verificando se gusta@gusta existe...");
    const loginResponse = await fetch(`${API_URL}/users/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "gusta@gusta",
        senha: "123"
      })
    });
    
    console.log("Status do login:", loginResponse.status);
    const loginData = await loginResponse.text();
    console.log("Resposta do login:", loginData);
    
    // 2. Tentar registrar com gusta@gusta
    console.log("\n📝 2. Tentando registrar com gusta@gusta...");
    const registerResponse = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: "gusta",
        email: "gusta@gusta",
        senha: "123",
        foto_perfil: null
      })
    });
    
    console.log("Status do registro:", registerResponse.status);
    const registerData = await registerResponse.text();
    console.log("Resposta do registro:", registerData);
    
    // 3. Tentar registrar com um email similar
    console.log("\n📝 3. Tentando registrar com gusta2@gusta...");
    const registerResponse2 = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: "gusta2",
        email: "gusta2@gusta",
        senha: "123",
        foto_perfil: null
      })
    });
    
    console.log("Status do registro (gusta2):", registerResponse2.status);
    const registerData2 = await registerResponse2.text();
    console.log("Resposta do registro (gusta2):", registerData2);
    
  } catch (error) {
    console.error("❌ Erro durante o teste:", error);
  }
}

testGustaSpecific(); 