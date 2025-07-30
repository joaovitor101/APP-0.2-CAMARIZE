# 🧪 Guia de Teste - Edição de Sensores

## Problema Corrigido
- **Antes**: Quando você editava um cativeiro e selecionava apenas 1 sensor, as relações antigas permaneciam no banco
- **Agora**: As relações antigas são sempre removidas antes de criar as novas

## 🔧 Correções Aplicadas

### 1. Backend (API)
- ✅ **Sempre remove relações antigas primeiro** antes de criar novas
- ✅ **Filtra sensores válidos** (remove strings vazias)
- ✅ **Logs detalhados** para debug
- ✅ **Tratamento de casos especiais** (nenhum sensor, sensor único, múltiplos sensores)

### 2. Frontend
- ✅ **Envia todos os sensores selecionados** como `sensorIds`
- ✅ **Interface melhorada** com texto explicativo
- ✅ **Notificações específicas** mostrando quantos sensores foram relacionados

## 🧪 Como Testar

### Teste 1: Via Script Automático
```bash
cd api
npm run test-edit
```

### Teste 2: Via Frontend (Manual)

#### Passo 1: Criar cativeiro com 2 sensores
1. Acesse: `http://localhost:3000/create-cativeiros`
2. Preencha os dados
3. **Selecione 2 sensores** nos dropdowns
4. Clique em "Cadastrar"
5. Verifique no MongoDB Atlas: deve ter 2 relações

#### Passo 2: Editar e deixar apenas 1 sensor
1. Vá para a página de edição do cativeiro
2. **Selecione apenas 1 sensor** (deixe os outros vazios)
3. Clique em "Atualizar"
4. Verifique no MongoDB Atlas: deve ter apenas 1 relação

#### Passo 3: Editar e remover todos os sensores
1. Vá para a página de edição do cativeiro
2. **Deixe todos os sensores vazios**
3. Clique em "Atualizar"
4. Verifique no MongoDB Atlas: não deve ter nenhuma relação

## 🔍 Verificação no MongoDB Atlas

### Antes da Correção
```
SensoresxCativeiros Collection:
- Documento 1: Sensor A -> Cativeiro X
- Documento 2: Sensor B -> Cativeiro X
- Documento 3: Sensor C -> Cativeiro X (permanecia mesmo após edição)
```

### Após a Correção
```
SensoresxCativeiros Collection:
- Documento 1: Sensor A -> Cativeiro X (apenas se selecionado)
- Documento 2: Sensor B -> Cativeiro X (apenas se selecionado)
```

## 📊 Logs Esperados

### Na Criação
```
🔍 Verificando sensores na criação: { sensorIds: ['id1', 'id2'], sensorId: undefined, isArray: true }
✅ Relação sensor-cativeiro criada: Sensor id1 -> Cativeiro cativeiroId
✅ Relação sensor-cativeiro criada: Sensor id2 -> Cativeiro cativeiroId
📝 Total de relações criadas: 2
```

### Na Edição
```
🔍 Dados recebidos na edição: { sensorIds: ['id1'], sensorId: undefined, isArray: true }
🗑️  Relações anteriores removidas para cativeiro cativeiroId
✅ Relação sensor-cativeiro atualizada: Sensor id1 -> Cativeiro cativeiroId
📝 Total de relações atualizadas: 1
```

## ✅ Critérios de Sucesso

1. **Criação com múltiplos sensores**: ✅ Funciona
2. **Edição reduzindo para 1 sensor**: ✅ Remove os outros
3. **Edição removendo todos os sensores**: ✅ Remove todas as relações
4. **Logs detalhados**: ✅ Mostram o que está acontecendo
5. **Interface clara**: ✅ Usuário entende que pode selecionar múltiplos

## 🚨 Se Ainda Não Funcionar

1. **Verifique os logs** no console da API
2. **Teste via script**: `npm run test-edit`
3. **Verifique o MongoDB Atlas** diretamente
4. **Reinicie a API**: `npm start`

## 📝 Notas Técnicas

- **FormData**: O frontend envia `sensorIds` como array via `formData.append()`
- **Filtro**: Backend filtra sensores vazios antes de processar
- **Transação**: Sempre remove antigas antes de criar novas
- **Logs**: Detalhados para facilitar debug 