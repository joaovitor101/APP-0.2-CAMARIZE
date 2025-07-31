#!/usr/bin/env node

// Teste da lógica de cálculo de status
function testStatusLogic() {
  console.log("🧪 Testando lógica de cálculo de status...\n");
  
  // Dados do cativeiro
  const tempAtual = 24.375475976673492;
  const tempIdeal = 26;
  const phAtual = 7.226836967063006;
  const phIdeal = 7.5;
  const amoniaAtual = 0.05305892488842257;
  const amoniaIdeal = 0.05;
  
  const tolerancia = 0.1; // 10%
  
  console.log("📊 Dados do cativeiro:");
  console.log(`   Temperatura: ${tempAtual}°C (Ideal: ${tempIdeal}°C)`);
  console.log(`   pH: ${phAtual} (Ideal: ${phIdeal})`);
  console.log(`   Amônia: ${amoniaAtual}mg/L (Ideal: ${amoniaIdeal}mg/L)`);
  console.log(`   Tolerância: ${tolerancia * 100}%\n`);
  
  // Teste temperatura
  const diffTemp = Math.abs(tempAtual - tempIdeal);
  const toleranciaTemp = tempIdeal * tolerancia;
  const severidadeTemp = diffTemp > toleranciaTemp * 2 ? 'alta' : 'media';
  
  console.log("🌡️  Teste Temperatura:");
  console.log(`   Diferença: ${diffTemp.toFixed(2)}°C`);
  console.log(`   Tolerância: ${toleranciaTemp.toFixed(2)}°C`);
  console.log(`   Tolerância * 2: ${(toleranciaTemp * 2).toFixed(2)}°C`);
  console.log(`   Está fora da tolerância? ${diffTemp > toleranciaTemp ? 'SIM' : 'NÃO'}`);
  console.log(`   Severidade: ${severidadeTemp}\n`);
  
  // Teste pH
  const diffPh = Math.abs(phAtual - phIdeal);
  const toleranciaPh = phIdeal * tolerancia;
  const severidadePh = diffPh > toleranciaPh * 2 ? 'alta' : 'media';
  
  console.log("🧪 Teste pH:");
  console.log(`   Diferença: ${diffPh.toFixed(3)}`);
  console.log(`   Tolerância: ${toleranciaPh.toFixed(3)}`);
  console.log(`   Tolerância * 2: ${(toleranciaPh * 2).toFixed(3)}`);
  console.log(`   Está fora da tolerância? ${diffPh > toleranciaPh ? 'SIM' : 'NÃO'}`);
  console.log(`   Severidade: ${severidadePh}\n`);
  
  // Teste amônia
  const diffAmonia = Math.abs(amoniaAtual - amoniaIdeal);
  const toleranciaAmonia = amoniaIdeal * tolerancia;
  const severidadeAmonia = diffAmonia > toleranciaAmonia * 2 ? 'alta' : 'media';
  
  console.log("🐟 Teste Amônia:");
  console.log(`   Diferença: ${diffAmonia.toFixed(4)}mg/L`);
  console.log(`   Tolerância: ${toleranciaAmonia.toFixed(4)}mg/L`);
  console.log(`   Tolerância * 2: ${(toleranciaAmonia * 2).toFixed(4)}mg/L`);
  console.log(`   Está fora da tolerância? ${diffAmonia > toleranciaAmonia ? 'SIM' : 'NÃO'}`);
  console.log(`   Severidade: ${severidadeAmonia}\n`);
  
  // Cálculo do status final
  let status = 'ok';
  let statusText = 'OK';
  let statusColor = '#10b981';
  
  if (diffTemp > toleranciaTemp) {
    if (severidadeTemp === 'alta') {
      status = 'critico';
      statusText = 'CRÍTICO';
      statusColor = '#ef4444';
    } else if (status !== 'critico') {
      status = 'alerta';
      statusText = 'ALERTA';
      statusColor = '#f59e0b';
    }
  }
  
  if (diffPh > toleranciaPh) {
    if (severidadePh === 'alta') {
      status = 'critico';
      statusText = 'CRÍTICO';
      statusColor = '#ef4444';
    } else if (status !== 'critico') {
      status = 'alerta';
      statusText = 'ALERTA';
      statusColor = '#f59e0b';
    }
  }
  
  if (diffAmonia > toleranciaAmonia) {
    if (severidadeAmonia === 'alta') {
      status = 'critico';
      statusText = 'CRÍTICO';
      statusColor = '#ef4444';
    } else if (status !== 'critico') {
      status = 'alerta';
      statusText = 'ALERTA';
      statusColor = '#f59e0b';
    }
  }
  
  console.log("🎯 Status Final:");
  console.log(`   Status: ${status}`);
  console.log(`   Texto: ${statusText}`);
  console.log(`   Cor: ${statusColor}`);
}

testStatusLogic(); 