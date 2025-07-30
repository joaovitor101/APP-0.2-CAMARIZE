#!/usr/bin/env node

import axios from 'axios';

console.log('🧪 Teste de Múltiplos Sensores');
console.log('==============================\n');

const apiUrl = 'http://localhost:4000';

async function testMultipleSensors() {
  try {
    console.log('1️⃣  Testando criação com múltiplos sensores...');
    
    // Primeiro, vamos pegar alguns IDs de sensores e cativeiros
    const [sensoresRes, cativeirosRes] = await Promise.all([
      axios.get(`${apiUrl}/test/test-sensores`),
      axios.get(`${apiUrl}/test/test-cativeiros`)
    ]);
    
    const sensores = sensoresRes.data;
    const cativeiros = cativeirosRes.data;
    
    if (sensores.length < 2) {
      console.log('❌ Precisa de pelo menos 2 sensores para testar');
      return;
    }
    
    if (cativeiros.length === 0) {
      console.log('❌ Precisa de pelo menos 1 cativeiro para testar');
      return;
    }
    
    const sensorIds = sensores.slice(0, 2).map(s => s._id);
    const cativeiroId = cativeiros[0]._id;
    
    console.log('📡 Sensores para testar:', sensorIds);
    console.log('🏠 Cativeiro para testar:', cativeiroId);
    
    // Teste 1: Criar relação com múltiplos sensores
    console.log('\n2️⃣  Criando relações com múltiplos sensores...');
    
    for (const sensorId of sensorIds) {
      const response = await axios.post(`${apiUrl}/test/test-relacao`, {
        sensorId: sensorId,
        cativeiroId: cativeiroId
      });
      console.log(`✅ Relação criada: ${sensorId} -> ${cativeiroId}`);
    }
    
    // Teste 2: Verificar se as relações foram criadas
    console.log('\n3️⃣  Verificando relações criadas...');
    
    const relacoesRes = await axios.get(`${apiUrl}/test/test-relacoes`);
    const relacoes = relacoesRes.data.relacoes;
    
    console.log(`📊 Total de relações encontradas: ${relacoes.length}`);
    
    const relacoesDoCativeiro = relacoes.filter(r => r.id_cativeiro === cativeiroId);
    console.log(`📊 Relações do cativeiro ${cativeiroId}: ${relacoesDoCativeiro.length}`);
    
    relacoesDoCativeiro.forEach((relacao, index) => {
      console.log(`   ${index + 1}. Sensor: ${relacao.id_sensor} -> Cativeiro: ${relacao.id_cativeiro}`);
    });
    
    console.log('\n🎉 Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testMultipleSensors(); 