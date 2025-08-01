#!/usr/bin/env node

console.log('🧪 Testando novas tolerâncias implementadas...');
console.log('=============================================\n');

// Seus dados
const dados = {
  tempIdeal: 22,
  phIdeal: 7,
  amoniaIdeal: 0.5,
  tempAtual: 20,
  phAtual: 6,
  amoniaAtual: 1.0
};

console.log('📊 Seus dados:');
console.log(`   Temperatura: ${dados.tempAtual}°C (Ideal: ${dados.tempIdeal}°C)`);
console.log(`   pH: ${dados.phAtual} (Ideal: ${dados.phIdeal})`);
console.log(`   Amônia: ${dados.amoniaAtual}mg/L (Ideal: ${dados.amoniaIdeal}mg/L)`);
console.log('');

// Calcula diferenças
const diffTemp = Math.abs(dados.tempAtual - dados.tempIdeal);
const diffPh = Math.abs(dados.phAtual - dados.phIdeal);
const diffAmonia = Math.abs(dados.amoniaAtual - dados.amoniaIdeal);

console.log('📈 Diferenças:');
console.log(`   Temperatura: ${diffTemp}°C`);
console.log(`   pH: ${diffPh}`);
console.log(`   Amônia: ${diffAmonia}mg/L`);
console.log('');

// Novas tolerâncias implementadas
const toleranciaTemp = 0.15; // 15% para temperatura
const toleranciaPh = 0.2;    // 20% para pH
const toleranciaAmonia = 0.25; // 25% para amônia

// Calcula tolerâncias
const tolTempValor = dados.tempIdeal * toleranciaTemp;
const tolPhValor = dados.phIdeal * toleranciaPh;
const tolAmoniaValor = dados.amoniaIdeal * toleranciaAmonia;

console.log('🎯 Novas tolerâncias implementadas:');
console.log(`   Temperatura: ${(toleranciaTemp * 100)}% = ${tolTempValor.toFixed(2)}°C`);
console.log(`   pH: ${(toleranciaPh * 100)}% = ${tolPhValor.toFixed(2)}`);
console.log(`   Amônia: ${(toleranciaAmonia * 100)}% = ${tolAmoniaValor.toFixed(3)}mg/L`);
console.log('');

// Verifica status
const tempOk = diffTemp <= tolTempValor;
const phOk = diffPh <= tolPhValor;
const amoniaOk = diffAmonia <= tolAmoniaValor;

console.log('✅ Resultado com novas tolerâncias:');
console.log(`   Temperatura: ${diffTemp.toFixed(1)}°C/${tolTempValor.toFixed(2)}°C - ${tempOk ? '✅ OK' : '❌ ALERTA'}`);
console.log(`   pH: ${diffPh.toFixed(1)}/${tolPhValor.toFixed(2)} - ${phOk ? '✅ OK' : '❌ ALERTA'}`);
console.log(`   Amônia: ${diffAmonia.toFixed(2)}mg/L/${tolAmoniaValor.toFixed(3)}mg/L - ${amoniaOk ? '✅ OK' : '❌ ALERTA'}`);
console.log('');

let status = 'OK';
if (!tempOk || !phOk || !amoniaOk) {
  const problemas = [];
  if (!tempOk) problemas.push('Temperatura');
  if (!phOk) problemas.push('pH');
  if (!amoniaOk) problemas.push('Amônia');
  status = `ALERTA (${problemas.join(', ')})`;
}

console.log(`🎯 Status final: ${status}`);

console.log('\n💡 Comparação com tolerância antiga (10%):');
const toleranciaAntiga = 0.1;
const tolTempAntiga = dados.tempIdeal * toleranciaAntiga;
const tolPhAntiga = dados.phIdeal * toleranciaAntiga;
const tolAmoniaAntiga = dados.amoniaIdeal * toleranciaAntiga;

console.log(`   Temperatura: ${diffTemp.toFixed(1)}°C/${tolTempAntiga.toFixed(2)}°C - ${diffTemp <= tolTempAntiga ? '✅ OK' : '❌ ALERTA'}`);
console.log(`   pH: ${diffPh.toFixed(1)}/${tolPhAntiga.toFixed(2)} - ${diffPh <= tolPhAntiga ? '✅ OK' : '❌ ALERTA'}`);
console.log(`   Amônia: ${diffAmonia.toFixed(2)}mg/L/${tolAmoniaAntiga.toFixed(3)}mg/L - ${diffAmonia <= tolAmoniaAntiga ? '✅ OK' : '❌ ALERTA'}`);

console.log('\n🎉 Agora status e notificações devem estar consistentes!'); 