# Script de População de Parâmetros Atuais

## 📋 Descrição

Este script popula a tabela `parametros_atuais` com dados realistas dos sensores para substituir os dados mockados do dashboard.

## 🚀 Como Executar

### Opção 1: Usando npm script (Recomendado)
```bash
cd api
npm run populate-parametros
```

### Opção 2: Execução direta
```bash
cd api
node tests/populate-parametros-atuais.js
```

## 📊 O que o Script Faz

1. **Conecta ao MongoDB** e busca todos os cativeiros existentes
2. **Limpa dados antigos** da tabela `parametros_atuais` para evitar duplicatas
3. **Gera dados realistas** para cada cativeiro baseado nas condições ideais
4. **Cria dados históricos** dos últimos 7 dias para o gráfico semanal
5. **Adiciona leituras extras** para simular sensores funcionando a cada 4 horas

## 📈 Dados Gerados

### Para cada cativeiro, o script gera:

- **Dados atuais**: Última leitura dos sensores
- **Dados históricos**: 7 dias de histórico para o gráfico
- **Leituras extras**: Simulação de sensores funcionando a cada 4 horas

### Parâmetros incluídos:
- 🌡️ **Temperatura** (20-35°C)
- 🧪 **pH** (6.5-8.5)
- ⚗️ **Amônia** (0.01-0.2 mg/L)

## 🔧 Configuração

### Valores Padrão (se não houver condições ideais):
```javascript
{
  temp_ideal: 26,    // 26°C
  ph_ideal: 7.5,     // pH 7.5
  amonia_ideal: 0.05 // 0.05 mg/L
}
```

### Variações Realistas:
- **Temperatura**: ±2°C variação diária
- **pH**: ±0.3 variação diária  
- **Amônia**: ±0.02 mg/L variação diária

## 📡 Endpoints da API

Após executar o script, você pode acessar os dados via API:

### 1. Dados Atuais
```
GET /parametros/atuais/:cativeiroId
```

### 2. Dados Históricos
```
GET /parametros/historicos/:cativeiroId?dias=7
```

### 3. Dados do Dashboard (Completo)
```
GET /parametros/dashboard/:cativeiroId
```

## 🎯 Exemplo de Uso

1. **Execute o script**:
   ```bash
   npm run populate-parametros
   ```

2. **Acesse o dashboard** no frontend
3. **Verifique os dados** - agora devem ser reais em vez de mockados

## 🔄 Reexecução

Para atualizar os dados, simplesmente execute o script novamente. Ele limpará os dados antigos e criará novos.

## ⚠️ Observações

- O script **limpa todos os dados existentes** antes de criar novos
- Dados são baseados nas **condições ideais** configuradas para cada cativeiro
- Se um cativeiro não tiver condições ideais, usa **valores padrão**
- Os dados são **realistas** mas **simulados** para demonstração

## 🐛 Troubleshooting

### Erro: "Nenhum cativeiro encontrado"
- Crie cativeiros primeiro usando a aplicação
- Verifique se há dados na tabela `cativeiros`

### Erro de conexão com MongoDB
- Verifique se o MongoDB está rodando
- Confirme a string de conexão no arquivo `.env`

### Dados não aparecem no dashboard
- Verifique se o frontend está fazendo as chamadas corretas para a API
- Confirme se o token de autenticação está sendo enviado 