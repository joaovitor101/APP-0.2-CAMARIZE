# 🧪 Testes da API

Esta pasta contém todos os arquivos de teste e debug da API.

## 📁 Arquivos de Teste

### 🔧 Testes de Funcionalidade
- **`test-sensor-cativeiro.js`** - Guia para testar relacionamento sensor-cativeiro
- **`test-multiple-sensors.js`** - Teste de múltiplos sensores
- **`test-edit-sensors.js`** - Teste de edição de sensores
- **`test-manual.js`** - Guia para testes manuais

### 🔍 Testes de Debug
- **`debug-sensor-cativeiro.js`** - Diagnóstico completo do sistema
- **`test-api-status.js`** - Verificação rápida do status da API
- **`quick-test.js`** - Teste rápido da API

### 📚 Documentação
- **`TESTE_EDICAO_SENSORES.md`** - Guia detalhado para testar edição de sensores

## 🚀 Como Executar

### Via npm scripts (recomendado)
```bash
# Teste de relacionamento sensor-cativeiro
npm run test-sensor

# Debug completo do sistema
npm run debug

# Teste de múltiplos sensores
npm run test-multiple

# Teste de edição
npm run test-edit

# Verificação rápida da API
npm run test-api

# Teste manual
npm run test-manual

# Teste rápido
npm run quick-test
```

### Via Node diretamente
```bash
# Teste específico
node tests/test-sensor-cativeiro.js
node tests/debug-sensor-cativeiro.js
node tests/test-multiple-sensors.js
node tests/test-edit-sensors.js
node tests/test-api-status.js
node tests/test-manual.js
node tests/quick-test.js
```

## 📊 Tipos de Teste

### 1. **Testes de Funcionalidade**
Testam se as funcionalidades principais estão funcionando:
- Criação de relacionamentos sensor-cativeiro
- Múltiplos sensores por cativeiro
- Edição e remoção de relacionamentos

### 2. **Testes de Debug**
Diagnosticam problemas no sistema:
- Conexão com MongoDB
- Status dos endpoints da API
- Verificação de coleções e documentos

### 3. **Testes Manuais**
Guias para testar via interface ou ferramentas externas:
- Postman/Insomnia
- Frontend da aplicação
- MongoDB Compass

## 🔧 Pré-requisitos

Antes de executar os testes:

1. **API rodando**: `npm start`
2. **MongoDB conectado**: Verificar conexão no `.env`
3. **Dados de teste**: Sensores e cativeiros cadastrados

## 📝 Logs e Debug

Todos os testes geram logs detalhados no console:
- ✅ Sucessos
- ❌ Erros
- 🔍 Informações de debug
- 📊 Estatísticas

## 🚨 Troubleshooting

Se um teste falhar:

1. **Verifique se a API está rodando**
2. **Confirme a conexão com MongoDB**
3. **Verifique se há dados de teste**
4. **Consulte os logs de erro**
5. **Execute o debug completo**: `npm run debug`

## 📈 Ordem Recomendada de Testes

1. **`npm run test-api`** - Verificar se a API está funcionando
2. **`npm run debug`** - Diagnóstico completo
3. **`npm run test-sensor`** - Teste básico de relacionamento
4. **`npm run test-multiple`** - Teste de múltiplos sensores
5. **`npm run test-edit`** - Teste de edição

## 🔄 Manutenção

Para adicionar novos testes:

1. Crie o arquivo na pasta `tests/`
2. Adicione o script no `package.json`
3. Documente no `README.md`
4. Teste a funcionalidade

## 📞 Suporte

Se encontrar problemas:
1. Execute `npm run debug` para diagnóstico
2. Verifique os logs no console
3. Consulte a documentação específica
4. Teste via interface manual 