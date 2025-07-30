# 🔔 Sistema de Notificações - Camarize

## 📋 Visão Geral

O sistema de notificações do Camarize monitora automaticamente as diferenças entre os **parâmetros atuais** (dados dos sensores IoT) e as **condições ideais** (configuradas pelo usuário) para gerar alertas inteligentes.

## 🎯 Funcionalidades

### ✅ Comparação Automática
- **Temperatura**: Compara `temp_atual` vs `temp_ideal`
- **pH**: Compara `ph_atual` vs `ph_ideal`  
- **Amônia**: Compara `amonia_atual` vs `amonia_ideal`

### ⚠️ Sistema de Tolerância
- **Tolerância padrão**: 10% do valor ideal
- **Severidade média**: Diferença > 10% do ideal
- **Severidade alta**: Diferença > 20% do ideal

### 📊 Tipos de Notificação
- **Aumento**: Quando o valor atual está acima do ideal
- **Diminuição**: Quando o valor atual está abaixo do ideal

## 🏗️ Arquitetura

### Backend
```
api/
├── controllers/
│   └── notificationController.js    # Lógica de comparação e geração
├── routes/
│   └── notificationRoutes.js        # Endpoints da API
└── models/
    ├── Parametros_atuais.js         # Dados dos sensores IoT
    └── Condicoes_ideais.js          # Valores ideais configurados
```

### Frontend
```
front-react/src/pages/
└── notifications.js                 # Interface de notificações
```

## 🔌 Endpoints da API

### GET `/notifications`
Retorna todas as notificações ativas.

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "temp_cativeiroId_parametroId",
      "tipo": "temperatura",
      "cativeiro": "cativeiroId",
      "cativeiroNome": "Nome do Cativeiro",
      "valorAtual": 25.5,
      "valorIdeal": 24.0,
      "diferenca": 1.5,
      "mensagem": "Temperatura com aumento! Atual: 25.5°C, Ideal: 24.0°C",
      "datahora": "2025-07-30T12:42:36.000Z",
      "severidade": "media"
    }
  ],
  "total": 1
}
```

### GET `/notifications/cativeiro/:cativeiroId`
Retorna notificações de um cativeiro específico.

## 🧪 Scripts de Teste

### 1. Limpar Dados Existentes (Opcional)
```bash
npm run clear-mock-parametros
```
- Remove todos os dados de parâmetros atuais do banco
- Útil para começar com um banco limpo

### 2. Adicionar Dados Customizados
```bash
npm run add-custom-parametros
```
- Cria dados com valores que você pode alterar no código
- Simula diferentes cenários (normal, alta, baixa, múltiplos problemas)
- Mostra análise detalhada das diferenças
- **Edite o arquivo** `api/tests/add-custom-parametros.js` para alterar valores

### 3. Testar Sistema
```bash
npm run test-notifications
```
- Testa a API de notificações
- Verifica filtros por cativeiro
- Mostra análise detalhada das diferenças
- Valida se as notificações estão sendo geradas corretamente

## 📊 Estrutura dos Dados

### Parâmetros Atuais (Mockados)
```javascript
{
  datahora: Date,           // Timestamp da medição
  temp_atual: Number,       // Temperatura atual (°C)
  ph_atual: Number,         // pH atual
  amonia_atual: Number,     // Amônia atual (mg/L)
  id_cativeiro: ObjectId    // Referência ao cativeiro
}
```

### Condições Ideais
```javascript
{
  id_tipo_camarao: ObjectId,  // Tipo de camarão
  temp_ideal: Number,         // Temperatura ideal (°C)
  ph_ideal: Number,           // pH ideal
  amonia_ideal: Number        // Amônia ideal (mg/L)
}
```

## 🎨 Interface do Frontend

### Estados da Interface
- **Carregando**: Mostra spinner durante busca
- **Erro**: Exibe mensagem de erro com botão "Tentar novamente"
- **Vazio**: Mostra mensagem quando não há notificações
- **Lista**: Exibe notificações com cores por severidade

### Cores por Severidade
- **Alta**: Vermelho (#ff4444)
- **Média**: Laranja (#ff8800)
- **Baixa**: Amarelo (#ffaa00)

### Ícones por Tipo
- **Temperatura**: 🌡️
- **pH**: 🧪
- **Amônia**: ⚗️

## 🔄 Fluxo de Funcionamento

1. **Coleta de Dados**: Sensores IoT enviam dados para `Parametros_atuais`
2. **Comparação**: Sistema compara com `Condicoes_ideais` do cativeiro
3. **Análise**: Calcula diferenças e aplica tolerância de 10%
4. **Geração**: Cria notificações para valores fora da tolerância
5. **Exibição**: Frontend consome API e exibe notificações em tempo real

## 🚀 Como Usar

### 1. Configurar Condições Ideais
Ao criar/editar um cativeiro, configure:
- Temperatura ideal
- pH ideal  
- Nível de amônia ideal

### 2. Adicionar Dados Customizados (Desenvolvimento)
```bash
cd api
npm run add-custom-parametros
```

### 3. Testar Sistema
```bash
cd api
npm run test-notifications
```

### 4. Acessar Notificações
- Frontend: `/notifications`
- API: `GET /notifications`

## 🔧 Configurações

### Tolerância
Edite em `notificationController.js`:
```javascript
const tolerancia = 0.1; // 10% - altere conforme necessário
```

### Severidade
```javascript
// Severidade média: > 10% do ideal
// Severidade alta: > 20% do ideal
severidade: diffTemp > toleranciaTemp * 2 ? 'alta' : 'media'
```

## 📈 Próximos Passos

### Integração com IoT
- Substituir dados mockados por dados reais dos sensores
- Implementar coleta automática via API
- Adicionar timestamp de última atualização

### Melhorias
- Notificações push
- Email/SMS para alertas críticos
- Histórico de notificações
- Configuração de tolerância por usuário
- Gráficos de tendência

### Monitoramento
- Dashboard em tempo real
- Relatórios de alertas
- Métricas de performance
- Logs de sistema

---

**Desenvolvido para o Camarize - Sistema de Monitoramento de Cativeiros** 🦐 