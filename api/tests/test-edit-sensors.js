#!/usr/bin/env node

import axios from 'axios';

console.log('🔄 Teste de Edição de Sensores');
console.log('==============================\n');

const apiUrl = 'http://localhost:4000';

async function testEditSensors() {
  try {
    console.log('1️⃣  Preparando dados de teste...');
    
    // Primeiro, vamos pegar alguns IDs de sensores e cativeiros
    const [sensoresRes, cativeirosRes] = await Promise.all([
      axios.get(`${apiUrl}/test/test-sensores`),
      axios.get(`${apiUrl}/test/test-cativeiros`)
    ]);
    
    const sensores = sensoresRes.data;
    const cativeiros = cativeirosRes.data;
    
    if (sensores.length < 3) {
      console.log('❌ Precisa de pelo menos 3 sensores para testar');
      return;
    }
    
    if (cativeiros.length === 0) {
      console.log('❌ Precisa de pelo menos 1 cativeiro para testar');
      return;
    }
    
    const sensorIds = sensores.slice(0, 3).map(s => s._id);
    const cativeiroId = cativeiros[0]._id;
    
    console.log('📡 Sensores disponíveis:', sensorIds);
    console.log('🏠 Cativeiro para testar:', cativeiroId);
    
    // Teste 1: Criar relação com 2 sensores
    console.log('\n2️⃣  Criando relações com 2 sensores...');
    
    for (const sensorId of sensorIds.slice(0, 2)) {
      await axios.post(`${apiUrl}/test/test-relacao`, {
        sensorId: sensorId,
        cativeiroId: cativeiroId
      });
      console.log(`✅ Relação criada: ${sensorId} -> ${cativeiroId}`);
    }
    
    // Verificar estado inicial
    console.log('\n3️⃣  Verificando estado inicial...');
    const relacoesIniciais = await axios.get(`${apiUrl}/test/test-relacoes`);
    const relacoesDoCativeiro = relacoesIniciais.data.relacoes.filter(r => r.id_cativeiro === cativeiroId);
    console.log(`📊 Relações iniciais do cativeiro: ${relacoesDoCativeiro.length}`);
    
    // Teste 2: Simular edição - remover todas as relações e criar apenas 1
    console.log('\n4️⃣  Simulando edição - removendo 2 sensores e deixando apenas 1...');
    
    // Remove todas as relações
    await axios.delete(`${apiUrl}/test/limpar-relacoes/${cativeiroId}`);
    console.log('🗑️  Todas as relações removidas');
    
    // Cria apenas 1 relação
    await axios.post(`${apiUrl}/test/test-relacao`, {
      sensorId: sensorIds[0],
      cativeiroId: cativeiroId
    });
    console.log(`✅ Nova relação criada: ${sensorIds[0]} -> ${cativeiroId}`);
    
    // Verificar estado final
    console.log('\n5️⃣  Verificando estado final...');
    const relacoesFinais = await axios.get(`${apiUrl}/test/test-relacoes`);
    const relacoesFinaisDoCativeiro = relacoesFinais.data.relacoes.filter(r => r.id_cativeiro === cativeiroId);
    console.log(`📊 Relações finais do cativeiro: ${relacoesFinaisDoCativeiro.length}`);
    
    if (relacoesFinaisDoCativeiro.length === 1) {
      console.log('✅ Teste PASSOU! Apenas 1 relação permaneceu');
    } else {
      console.log('❌ Teste FALHOU! Deveria ter apenas 1 relação');
    }
    
    console.log('\n🎉 Teste de edição concluído!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testEditSensors(); 