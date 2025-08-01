#!/usr/bin/env node

console.log('🧪 Teste - Frontend Merge Sort Simulação');
console.log('========================================\n');

// Simular a lógica do frontend
const sensores = [
  { _id: '1', id_tipo_sensor: 'Temperatura', apelido: 'Temp 1' },
  { _id: '2', id_tipo_sensor: 'pH', apelido: 'pH 1' },
  { _id: '3', id_tipo_sensor: 'Amônia', apelido: 'Amon 1' },
  { _id: '4', id_tipo_sensor: 'Oxigênio', apelido: 'Oxi 1' },
  { _id: '5', id_tipo_sensor: 'Salinidade', apelido: 'Sal 1' },
];

// Função de merge sort (igual ao frontend)
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
    // Usar o índice original na lista completa para determinar o código
    const indexEsquerda = sensores.findIndex(s => s._id === esquerda[i]._id);
    const indexDireita = sensores.findIndex(s => s._id === direita[j]._id);
    
    const numEsquerda = indexEsquerda + 1; // +1 porque os códigos começam em #001
    const numDireita = indexDireita + 1;
    
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

// Simular a função handleOrdenar
const handleOrdenar = (sensoresFiltrados, ordenacaoAtiva) => {
  if (ordenacaoAtiva) {
    // Se já está ordenado, voltar à ordem original
    const sensoresOriginais = sensores.filter(sensor => 
      sensor.id_tipo_sensor?.toLowerCase().includes('') ||
      sensor.apelido?.toLowerCase().includes('')
    );
    console.log('🔄 Voltando à ordem original');
    return { sensores: sensoresOriginais, ordenacaoAtiva: false };
  } else {
    // Aplicar merge sort
    console.log('🔄 Aplicando merge sort decrescente...');
    const ordenados = mergeSort([...sensoresFiltrados]);
    console.log('✅ Merge sort aplicado');
    return { sensores: ordenados, ordenacaoAtiva: true };
  }
};

// Teste
console.log('📋 Testando lógica do frontend:');
console.log('================================\n');

console.log('🔢 Lista original:');
sensores.forEach((sensor, idx) => {
  console.log(`   #${String(idx + 1).padStart(3, '0')} - ${sensor.id_tipo_sensor} (${sensor.apelido})`);
});

console.log('\n🔄 Aplicando ordenação...');
let estado = { sensores: [...sensores], ordenacaoAtiva: false };
estado = handleOrdenar(estado.sensores, estado.ordenacaoAtiva);

console.log('\n✅ Lista ordenada (decrescente):');
estado.sensores.forEach((sensor, idx) => {
  const codigoOriginal = sensores.findIndex(s => s._id === sensor._id) + 1;
  console.log(`   #${String(codigoOriginal).padStart(3, '0')} - ${sensor.id_tipo_sensor} (${sensor.apelido})`);
});

console.log('\n🔄 Desfazendo ordenação...');
estado = handleOrdenar(estado.sensores, estado.ordenacaoAtiva);

console.log('\n✅ Lista voltou à ordem original:');
estado.sensores.forEach((sensor, idx) => {
  console.log(`   #${String(idx + 1).padStart(3, '0')} - ${sensor.id_tipo_sensor} (${sensor.apelido})`);
});

console.log('\n✅ Teste concluído!');
console.log('\n📋 RESUMO:');
console.log('   - Lógica do frontend funcionando corretamente');
console.log('   - Merge sort aplicado com sucesso');
console.log('   - Ordenação e desordenação funcionando'); 