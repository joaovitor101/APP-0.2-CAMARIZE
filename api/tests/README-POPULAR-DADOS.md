# 📊 Scripts para Popular Dados de Cativeiros

Este diretório contém scripts para popular dados de parâmetros atuais dos cativeiros no banco de dados.

## 🎯 Scripts Disponíveis

### 1. `populate-specific-cativeiros.js`
**Popula dados para cativeiros específicos**

**Funcionalidades:**
- ✅ Lista todos os cativeiros disponíveis
- ✅ Permite escolher cativeiros específicos (ex: "1,2,3" ou "todos")
- ✅ Opção de limpar dados existentes
- ✅ Configuração de quantos dias de dados históricos gerar
- ✅ Usa as condições ideais reais de cada cativeiro

**Como usar:**
```bash
cd api
node tests/populate-specific-cativeiros.js
```

**Exemplo de uso:**
```
📋 Cativeiros disponíveis:
  1. ID: 688b59068f7117f0e7577b85
     Nome: Cativeiro Junior
     Tipo: Rosa
     Condições ideais: Temp=26°C, pH=7.5, Amônia=0.05mg/L

Digite os números dos cativeiros que deseja popular (ex: 1,2,3) ou "todos" para popular todos: 1
Deseja limpar dados existentes dos cativeiros selecionados? (s/n): s
Quantos dias de dados históricos gerar? (padrão: 7): 10
```

### 2. `populate-alert-data.js`
**Gera dados que produzem alertas críticos/alerta**

**Funcionalidades:**
- ✅ Escolhe um cativeiro específico
- ✅ 5 tipos de alerta diferentes:
  - **Temperatura alta** (crítico)
  - **pH baixo** (crítico) 
  - **Amônia alta** (crítico)
  - **Múltiplos alertas** (crítico)
  - **Alertas médios** (alerta)
- ✅ Gera dados que garantem status crítico/alerta

**Como usar:**
```bash
cd api
node tests/populate-alert-data.js
```

**Exemplo de uso:**
```
🚨 Tipos de alerta disponíveis:
  1. Temperatura alta (crítico)
  2. pH baixo (crítico)
  3. Amônia alta (crítico)
  4. Múltiplos alertas (crítico)
  5. Alertas médios (alerta)

Escolha o tipo de alerta (1-5): 4
🚨 Gerando múltiplos alertas críticos:
   Temperatura: 32.5°C (Ideal: 26°C)
   pH: 5.6 (Ideal: 7.5)
   Amônia: 0.07mg/L (Ideal: 0.05mg/L)
```

### 3. `clear-mock-parametros.js`
**Limpa todos os dados de parâmetros existentes**

**Como usar:**
```bash
cd api
node tests/clear-mock-parametros.js
```

## 📋 Casos de Uso

### 🧪 **Para Testes de Status Crítico:**
1. Execute `populate-alert-data.js`
2. Escolha o cativeiro desejado
3. Escolha opção **4 (Múltiplos alertas críticos)**
4. Verifique:
   - Página `/status` - deve mostrar status "CRÍTICO"
   - Página `/notifications` - deve mostrar alertas "ALTA"

### 📊 **Para Dados Realistas:**
1. Execute `populate-specific-cativeiros.js`
2. Escolha "todos" ou cativeiros específicos
3. Configure quantos dias de dados históricos
4. Os dados serão gerados baseados nas condições ideais reais

### 🧹 **Para Limpar Dados:**
1. Execute `clear-mock-parametros.js`
2. Confirme a limpeza
3. Use um dos scripts acima para popular novos dados

## 🔧 **Dados Gerados**

Cada script gera:
- **Dados atuais** (última leitura)
- **Dados históricos** (últimos N dias)
- **Dados detalhados** (leituras a cada 2 horas nos últimos 3 dias)

## 📈 **Valores Realistas**

Os dados são gerados com variações realistas:
- **Temperatura**: ±2-3°C do valor ideal
- **pH**: ±0.3-0.5 do valor ideal  
- **Amônia**: ±0.02-0.03mg/L do valor ideal

## 🚨 **Alertas**

Os alertas são calculados com:
- **Tolerância**: 10% do valor ideal
- **Alerta médio**: 10-20% fora da tolerância
- **Alerta crítico**: >20% fora da tolerância

## 📝 **Notas Importantes**

- ✅ Os scripts usam as condições ideais reais dos cativeiros
- ✅ Dados antigos com valores incorretos foram corrigidos
- ✅ Todos os scripts são interativos e seguros
- ✅ Backup automático não é feito - use com cuidado em produção 