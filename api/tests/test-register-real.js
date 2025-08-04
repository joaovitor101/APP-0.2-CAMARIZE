import fetch from 'node-fetch';

const API_URL = 'http://localhost:4000';

async function testRealRegister() {
  console.log("🧪 Testando registro real (simulando frontend)...");
  
  try {
    // Teste com email que não existe
    const testEmail = "teste.real@teste.com";
    const testData = {
      nome: "Teste Real",
      email: testEmail,
      senha: "123456",
      foto_perfil: null
    };
    
    console.log(`\n📝 Tentando registrar usuário com email: ${testEmail}`);
    console.log("Dados:", { ...testData, senha: "***" });
    
    const registerResponse = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log("Status da resposta:", registerResponse.status);
    console.log("Headers da resposta:", Object.fromEntries(registerResponse.headers.entries()));
    
    const responseText = await registerResponse.text();
    console.log("Resposta completa:", responseText);
    
    if (registerResponse.ok) {
      console.log("✅ Registro bem-sucedido!");
      
      // Tentar registrar novamente com o mesmo email
      console.log(`\n🔄 Tentando registrar novamente com o mesmo email: ${testEmail}`);
      
      const duplicateResponse = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });
      
      console.log("Status da resposta (duplicata):", duplicateResponse.status);
      const duplicateText = await duplicateResponse.text();
      console.log("Resposta (duplicata):", duplicateText);
      
    } else {
      console.log("❌ Registro falhou!");
    }
    
  } catch (error) {
    console.error("❌ Erro durante o teste:", error);
  }
}

testRealRegister(); 