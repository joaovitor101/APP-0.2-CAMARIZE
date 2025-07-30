#!/usr/bin/env node

console.log('🧪 Teste Manual - Relação Sensor-Cativeiro');
console.log('==========================================\n');

console.log('📋 Para testar a criação de relação, siga estes passos:\n');

console.log('1️⃣  Primeiro, veja os sensores disponíveis:');
console.log('   GET http://localhost:4000/test/test-sensores');
console.log('   Copie o _id de um sensor\n');

console.log('2️⃣  Veja os cativeiros disponíveis:');
console.log('   GET http://localhost:4000/test/test-cativeiros');
console.log('   Copie o _id de um cativeiro\n');

console.log('3️⃣  Crie a relação manualmente:');
console.log('   POST http://localhost:4000/test/test-relacao');
console.log('   Content-Type: application/json');
console.log('   {');
console.log('     "sensorId": "ID_DO_SENSOR_COPIADO",');
console.log('     "cativeiroId": "ID_DO_CATIVEIRO_COPIADO"');
console.log('   }\n');

console.log('4️⃣  Verifique se a relação foi criada:');
console.log('   GET http://localhost:4000/test/test-relacoes');
console.log('   GET http://localhost:4000/sensoresxcativeiros\n');

console.log('🔍 Se funcionar no teste manual, o problema está no frontend.');
console.log('🔍 Se não funcionar, o problema está na API.\n');

console.log('💡 Dica: Use o Postman ou Insomnia para testar as requisições!'); 