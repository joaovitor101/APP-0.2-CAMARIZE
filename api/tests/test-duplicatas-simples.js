#!/usr/bin/env node

console.log('🔍 Teste Simples - Remoção de Duplicatas');
console.log('========================================\n');

// Simula os dados que vêm do frontend
const sensoresEnviados = [
  'sensor1',
  'sensor1', // duplicado
  'sensor2',
  'sensor1', // duplicado novamente
  'sensor3'
];

console.log('📦 Sensores enviados (com duplicatas):', sensoresEnviados);

// Aplica a lógica do backend para remover duplicatas
const sensoresValidos = [...new Set(sensoresEnviados.filter(sensorId => sensorId && sensorId !== ""))];

console.log('🔧 Sensores após remoção de duplicatas:', sensoresValidos);
console.log(`📊 Total: ${sensoresEnviados.length} -> ${sensoresValidos.length}`);

// Testa a lógica do frontend
console.log('\n🧪 Teste da lógica do frontend...');

const sensoresDisponiveis = [
  { _id: 'sensor1', apelido: 'Temp012', id_tipo_sensor: 'Temperatura' },
  { _id: 'sensor2', apelido: 'Ph012', id_tipo_sensor: 'pH' },
  { _id: 'sensor3', apelido: 'AM012', id_tipo_sensor: 'Amônia' }
];

const sensoresSelecionados = ['sensor1', 'sensor2', '']; // Dois sensores selecionados

console.log('📦 Sensores disponíveis:', sensoresDisponiveis.map(s => s.apelido));
console.log('📦 Sensores selecionados:', sensoresSelecionados);

// Simula a lógica de filtro para cada campo
for (let i = 0; i < sensoresSelecionados.length; i++) {
  const sensorAtual = sensoresSelecionados[i];
  
  const sensoresFiltrados = sensoresDisponiveis.filter(s => {
    // Mostra o sensor se ele está selecionado neste campo OU se não está selecionado em nenhum outro campo
    return sensorAtual === s._id || !sensoresSelecionados.includes(s._id);
  });
  
  console.log(`\n🔍 Campo ${i + 1} (valor: "${sensorAtual || 'vazio'}"):`);
  sensoresFiltrados.forEach((sensor, index) => {
    console.log(`  ${index + 1}. ${sensor.apelido} (${sensor.id_tipo_sensor})`);
  });
}

console.log('\n✅ Teste concluído!'); 