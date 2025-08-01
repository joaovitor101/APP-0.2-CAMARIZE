#!/usr/bin/env node

console.log('🧪 Teste - Merge Sort para Códigos de Sensores');
console.log('=============================================\n');

// Função para extrair o número do código do sensor
const extrairNumeroCodigo = (codigo) => {
  const match = codigo.match(/#(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

// Função de merge sort para ordenar sensores por código decrescente
const mergeSort = (array) => {
  if (array.length <= 1) {
    return array;
  }

  const meio = Math.floor(array.length / 2);
  const esquerda = mergeSort(array.slice(0, meio));
  const direita = mergeSort(array.slice(meio));

  return merge(esquerda, direita);
};

const merge = (esquerda, direita) => {
  const resultado = [];
  let i = 0;
  let j = 0;

  while (i < esquerda.length && j < direita.length) {
    const numEsquerda = extrairNumeroCodigo(esquerda[i].codigo);
    const numDireita = extrairNumeroCodigo(direita[j].codigo);
    
    // Ordenação decrescente (maior para menor)
    if (numEsquerda >= numDireita) {
      resultado.push(esquerda[i]);
      i++;
    } else {
      resultado.push(direita[j]);
      j++;
    }
  }

  // Adicionar elementos restantes
  while (i < esquerda.length) {
    resultado.push(esquerda[i]);
    i++;
  }
  while (j < direita.length) {
    resultado.push(direita[j]);
    j++;
  }

  return resultado;
};

// Teste com dados simulados
function testMergeSort() {
  console.log('📋 Testando Merge Sort com dados simulados:');
  console.log('===========================================\n');

  // Dados de teste - sensores com códigos
  const sensoresTeste = [
    { id: 1, codigo: '#001', nome: 'Sensor 1' },
    { id: 2, codigo: '#002', nome: 'Sensor 2' },
    { id: 3, codigo: '#003', nome: 'Sensor 3' },
    { id: 4, codigo: '#004', nome: 'Sensor 4' },
    { id: 5, codigo: '#005', nome: 'Sensor 5' },
    { id: 6, codigo: '#006', nome: 'Sensor 6' },
    { id: 7, codigo: '#007', nome: 'Sensor 7' },
    { id: 8, codigo: '#008', nome: 'Sensor 8' },
  ];

  console.log('🔢 Lista original:');
  sensoresTeste.forEach(sensor => {
    console.log(`   ${sensor.codigo} - ${sensor.nome}`);
  });

  console.log('\n🔄 Aplicando Merge Sort (ordenação decrescente)...');
  
  const sensoresOrdenados = mergeSort([...sensoresTeste]);

  console.log('\n✅ Lista ordenada (decrescente):');
  sensoresOrdenados.forEach(sensor => {
    console.log(`   ${sensor.codigo} - ${sensor.nome}`);
  });

  // Verificar se a ordenação está correta
  console.log('\n🔍 Verificando ordenação:');
  let ordenacaoCorreta = true;
  for (let i = 0; i < sensoresOrdenados.length - 1; i++) {
    const atual = extrairNumeroCodigo(sensoresOrdenados[i].codigo);
    const proximo = extrairNumeroCodigo(sensoresOrdenados[i + 1].codigo);
    
    if (atual < proximo) {
      ordenacaoCorreta = false;
      console.log(`   ❌ Erro: ${sensoresOrdenados[i].codigo} < ${sensoresOrdenados[i + 1].codigo}`);
    }
  }

  if (ordenacaoCorreta) {
    console.log('   ✅ Ordenação decrescente está correta!');
  } else {
    console.log('   ❌ Ordenação decrescente está incorreta!');
  }

  // Teste com números diferentes
  console.log('\n📋 Teste com números diferentes:');
  console.log('=================================');

  const sensoresTeste2 = [
    { id: 1, codigo: '#010', nome: 'Sensor 10' },
    { id: 2, codigo: '#002', nome: 'Sensor 2' },
    { id: 3, codigo: '#150', nome: 'Sensor 150' },
    { id: 4, codigo: '#005', nome: 'Sensor 5' },
    { id: 5, codigo: '#001', nome: 'Sensor 1' },
  ];

  console.log('\n🔢 Lista original:');
  sensoresTeste2.forEach(sensor => {
    console.log(`   ${sensor.codigo} - ${sensor.nome}`);
  });

  const sensoresOrdenados2 = mergeSort([...sensoresTeste2]);

  console.log('\n✅ Lista ordenada (decrescente):');
  sensoresOrdenados2.forEach(sensor => {
    console.log(`   ${sensor.codigo} - ${sensor.nome}`);
  });

  // Verificar se a ordenação está correta
  console.log('\n🔍 Verificando ordenação:');
  let ordenacaoCorreta2 = true;
  for (let i = 0; i < sensoresOrdenados2.length - 1; i++) {
    const atual = extrairNumeroCodigo(sensoresOrdenados2[i].codigo);
    const proximo = extrairNumeroCodigo(sensoresOrdenados2[i + 1].codigo);
    
    if (atual < proximo) {
      ordenacaoCorreta2 = false;
      console.log(`   ❌ Erro: ${sensoresOrdenados2[i].codigo} < ${sensoresOrdenados2[i + 1].codigo}`);
    }
  }

  if (ordenacaoCorreta2) {
    console.log('   ✅ Ordenação decrescente está correta!');
  } else {
    console.log('   ❌ Ordenação decrescente está incorreta!');
  }

  console.log('\n✅ Teste concluído!');
  console.log('\n📋 RESUMO:');
  console.log('   - Merge Sort implementado com sucesso');
  console.log('   - Ordenação decrescente funcionando');
  console.log('   - Códigos de sensores ordenados do maior para o menor');
}

// Executar o teste
testMergeSort(); 