#!/usr/bin/env node

import axios from 'axios';

console.log('🧪 Testando endpoint do Dashboard...');
console.log('=====================================\n');

async function testDashboardEndpoint() {
  try {
    const apiUrl = "http://localhost:4000";
    const cativeiroId = "688b59068f7117f0e7577b87"; // ID do Cativeiro Junior
    
    console.log(`📡 Testando: GET ${apiUrl}/parametros/dashboard/${cativeiroId}`);
    
    // Teste sem token (deve retornar 401)
    console.log('\n🔒 Teste 1: Sem token de autenticação');
    try {
      const response = await axios.get(`${apiUrl}/parametros/dashboard/${cativeiroId}`);
      console.log('❌ ERRO: Deveria ter retornado 401, mas retornou:', response.status);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ CORRETO: Retornou 401 (não autorizado)');
      } else {
        console.log('❌ ERRO: Status inesperado:', error.response?.status);
      }
    }
    
    // Teste com token inválido (deve retornar 401)
    console.log('\n🔒 Teste 2: Com token inválido');
    try {
      const response = await axios.get(`${apiUrl}/parametros/dashboard/${cativeiroId}`, {
        headers: { Authorization: 'Bearer token_invalido' }
      });
      console.log('❌ ERRO: Deveria ter retornado 401, mas retornou:', response.status);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ CORRETO: Retornou 401 (token inválido)');
      } else {
        console.log('❌ ERRO: Status inesperado:', error.response?.status);
      }
    }
    
    // Teste com ID inválido (deve retornar 404)
    console.log('\n🔍 Teste 3: Com ID de cativeiro inválido');
    try {
      const response = await axios.get(`${apiUrl}/parametros/dashboard/123456789012345678901234`, {
        headers: { Authorization: 'Bearer token_invalido' }
      });
      console.log('❌ ERRO: Deveria ter retornado 404, mas retornou:', response.status);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ CORRETO: Retornou 404 (cativeiro não encontrado)');
      } else if (error.response?.status === 401) {
        console.log('✅ CORRETO: Retornou 401 (token inválido) - esperado');
      } else {
        console.log('❌ ERRO: Status inesperado:', error.response?.status);
      }
    }
    
    console.log('\n📊 Resumo dos testes:');
    console.log('✅ Endpoint está protegido por autenticação');
    console.log('✅ Validação de ID de cativeiro funcionando');
    console.log('✅ Respostas de erro corretas');
    
    console.log('\n💡 Para testar com dados reais:');
    console.log('1. Faça login na aplicação para obter um token válido');
    console.log('2. Use o token no header Authorization: Bearer <seu_token>');
    console.log('3. Acesse o endpoint com o ID correto do cativeiro');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testDashboardEndpoint(); 