# 🧹 Scripts de Limpeza - Condições Ideais

## 📋 Scripts Disponíveis

### **1. Script Completo (com confirmação)**
```bash
npm run clear-condicoes-ideais CONFIRMAR
```

**Características:**
- ✅ Mostra registros antes da limpeza
- ✅ Requer confirmação explícita
- ✅ Opção de limpar referências nos cativeiros
- ✅ Relatório detalhado

**Uso:**
```bash
# Limpar apenas condições ideais
npm run clear-condicoes-ideais CONFIRMAR

# Limpar condições ideais + referências nos cativeiros
npm run clear-condicoes-ideais CONFIRMAR S
```

### **2. Script Rápido (sem confirmação)**
```bash
npm run quick-clear-condicoes
```

**Características:**
- ⚡ Execução rápida
- 🚀 Sem confirmação
- 📊 Relatório básico
- 💡 Ideal para desenvolvimento

## 🔍 O que cada script faz

### **clear-condicoes-ideais.js**
1. **Conecta ao MongoDB**
2. **Conta registros existentes**
3. **Mostra amostra dos dados**
4. **Solicita confirmação**
5. **Remove todos os registros**
6. **Verifica limpeza**
7. **Opção de limpar cativeiros**
8. **Relatório completo**

### **quick-clear-condicoes.js**
1. **Conecta ao MongoDB**
2. **Conta registros existentes**
3. **Remove todos os registros**
4. **Verifica limpeza**
5. **Relatório básico**

## ⚠️ **ATENÇÃO**

- **Estes scripts REMOVEM TODOS os dados de condições ideais**
- **Ação irreversível** - não há backup automático
- **Use com cuidado** em ambiente de produção
- **Recomendado** fazer backup antes de usar

## 🛠️ **Troubleshooting**

### Erro de Conexão
```bash
❌ Erro: connect ECONNREFUSED
```
**Solução:** Verifique se o MongoDB está rodando e a string de conexão está correta.

### Erro de Permissão
```bash
❌ Erro: Operation not permitted
```
**Solução:** Verifique se o usuário do MongoDB tem permissões de escrita.

### Erro de Modelo
```bash
❌ Erro: Model not found
```
**Solução:** Verifique se o arquivo do modelo existe e está correto.

## 📊 **Exemplo de Saída**

### Script Completo
```
🧹 Script - Limpar Condições Ideais
===================================

📡 Conectando ao MongoDB...
✅ Conectado ao MongoDB!
📊 Registros encontrados: 5

📋 Últimos registros antes da limpeza:
   1. ID: 507f1f77bcf86cd799439011
      Tipo Camarão: 507f1f77bcf86cd799439012
      Temp Ideal: 26°C
      pH Ideal: 7.5
      Amônia Ideal: 0.05 mg/L
      Criado em: 2024-01-15T10:30:00.000Z

⚠️  ATENÇÃO: Esta ação irá REMOVER TODOS os registros de condições ideais!
   Para continuar, digite "CONFIRMAR" (exatamente assim):

🔄 Iniciando limpeza...
✅ Limpeza concluída!
📊 Registros removidos: 5
📊 Registros restantes: 0
✅ Todos os registros foram removidos com sucesso!

✅ Script concluído!
```

### Script Rápido
```
🧹 Script Rápido - Limpar Condições Ideais
==========================================

📡 Conectando ao MongoDB...
✅ Conectado ao MongoDB!
📊 Registros encontrados: 3
🔄 Removendo todos os registros...
✅ Limpeza concluída!
📊 Registros removidos: 3
📊 Registros restantes: 0
✅ Todos os registros foram removidos com sucesso!

✅ Script concluído!
```

## 🔄 **Recriar Dados**

Após limpar, você pode recriar dados usando:
```bash
npm run populate-specific-cativeiros
npm run populate-alert-data
```

## 📞 **Suporte**

- Consulte os logs para identificar problemas
- Verifique a conexão com MongoDB
- Teste em ambiente de desenvolvimento primeiro 