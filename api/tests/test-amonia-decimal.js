#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente
dotenv.config();

console.log('🧪 Teste - Validação de Amônia Decimal');
console.log('=====================================\n');

async function testAmoniaDecimal() {
  try {
    // Conecta ao MongoDB
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";
    console.log('📡 Conectando ao MongoDB...');
    
    await mongoose.connect(mongoUrl);
    console.log('✅ Conectado ao MongoDB!');
    
    // Importa os modelos
    await import('../models/Condicoes_ideais.js');
    await import('../models/Parametros_atuais.js');
    
    const CondicoesIdeais = mongoose.model('CondicoesIdeais');
    const ParametrosAtuais = mongoose.model('ParametrosAtuais');
    
    // Função de validação igual à do controller
    const validarEConverter = (valor, padrao) => {
      console.log(`   Input: "${valor}" (tipo: ${typeof valor})`);
      if (!valor || valor === '') {
        console.log(`   → Retornando padrão: ${padrao}`);
        return padrao;
      }
      const num = parseFloat(valor);
      console.log(`   → parseFloat result: ${num} (tipo: ${typeof num})`);
      if (isNaN(num)) {
        console.log(`   → NaN detectado, retornando padrão: ${padrao}`);
        return padrao;
      }
      console.log(`   → Retornando valor convertido: ${num}`);
      return num;
    };
    
    console.log('\n🔍 Testando função validarEConverter:');
    console.log('=====================================');
    
    // Teste 1: Valor decimal com ponto
    console.log('\n1. Testando "0.5":');
    const resultado1 = validarEConverter("0.5", 0.05);
    console.log(`   Resultado: ${resultado1} (tipo: ${typeof resultado1})`);
    
    // Teste 2: Valor decimal com vírgula (problema comum)
    console.log('\n2. Testando "0,5":');
    const resultado2 = validarEConverter("0,5", 0.05);
    console.log(`   Resultado: ${resultado2} (tipo: ${typeof resultado2})`);
    
    // Teste 3: Valor inteiro
    console.log('\n3. Testando "1":');
    const resultado3 = validarEConverter("1", 0.05);
    console.log(`   Resultado: ${resultado3} (tipo: ${typeof resultado3})`);
    
    // Teste 4: Valor vazio
    console.log('\n4. Testando "":');
    const resultado4 = validarEConverter("", 0.05);
    console.log(`   Resultado: ${resultado4} (tipo: ${typeof resultado4})`);
    
    // Teste 5: Valor inválido
    console.log('\n5. Testando "abc":');
    const resultado5 = validarEConverter("abc", 0.05);
    console.log(`   Resultado: ${resultado5} (tipo: ${typeof resultado5})`);
    
    // Teste 6: Número já convertido
    console.log('\n6. Testando 0.5 (número):');
    const resultado6 = validarEConverter(0.5, 0.05);
    console.log(`   Resultado: ${resultado6} (tipo: ${typeof resultado6})`);
    
    console.log('\n📊 Testando salvamento no MongoDB:');
    console.log('==================================');
    
    // Teste de salvamento no MongoDB
    try {
      console.log('\n7. Salvando condição ideal com amônia = 0.5:');
      const condicao = await CondicoesIdeais.create({
        id_tipo_camarao: new mongoose.Types.ObjectId(), // ID temporário
        temp_ideal: 26,
        ph_ideal: 7.5,
        amonia_ideal: 0.5
      });
      console.log(`   ✅ Condição salva com sucesso!`);
      console.log(`   ID: ${condicao._id}`);
      console.log(`   Amônia salva: ${condicao.amonia_ideal} (tipo: ${typeof condicao.amonia_ideal})`);
      
      // Buscar para verificar
      const condicaoBuscada = await CondicoesIdeais.findById(condicao._id);
      console.log(`   Amônia buscada: ${condicaoBuscada.amonia_ideal} (tipo: ${typeof condicaoBuscada.amonia_ideal})`);
      
      // Limpar teste
      await CondicoesIdeais.findByIdAndDelete(condicao._id);
      console.log(`   🧹 Teste removido do banco`);
      
    } catch (error) {
      console.error(`   ❌ Erro ao salvar: ${error.message}`);
    }
    
    // Teste de salvamento de parâmetros
    try {
      console.log('\n8. Salvando parâmetro atual com amônia = 0.5:');
      const parametro = await ParametrosAtuais.create({
        datahora: new Date(),
        temp_atual: 26,
        ph_atual: 7.5,
        amonia_atual: 0.5,
        id_cativeiro: new mongoose.Types.ObjectId() // ID temporário
      });
      console.log(`   ✅ Parâmetro salvo com sucesso!`);
      console.log(`   ID: ${parametro._id}`);
      console.log(`   Amônia salva: ${parametro.amonia_atual} (tipo: ${typeof parametro.amonia_atual})`);
      
      // Buscar para verificar
      const parametroBuscado = await ParametrosAtuais.findById(parametro._id);
      console.log(`   Amônia buscada: ${parametroBuscado.amonia_atual} (tipo: ${typeof parametroBuscado.amonia_atual})`);
      
      // Limpar teste
      await ParametrosAtuais.findByIdAndDelete(parametro._id);
      console.log(`   🧹 Teste removido do banco`);
      
    } catch (error) {
      console.error(`   ❌ Erro ao salvar: ${error.message}`);
    }
    
    console.log('\n✅ Teste concluído!');
    console.log('\n📋 RESUMO:');
    console.log('   - parseFloat() aceita decimais com ponto (0.5)');
    console.log('   - parseFloat() NÃO aceita decimais com vírgula (0,5)');
    console.log('   - MongoDB aceita valores decimais normalmente');
    console.log('   - Se o problema persistir, pode ser no frontend');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Desconectado do MongoDB');
  }
}

// Executa o teste
testAmoniaDecimal(); 