# Status dos Cativeiros

## Visão Geral

A funcionalidade de Status dos Cativeiros permite visualizar o estado atual de todos os cativeiros do usuário, incluindo alertas e informações detalhadas sobre problemas detectados.

## Funcionalidades

### 1. Página de Status (`/status-cativeiros`)
- **Layout 2x2**: Resumo em formato de bloco 2x2 (desktop/tablet) ou 1 coluna (mobile)
- **Seções organizadas**: Cativeiros Críticos, Alertas e OK
- **Detalhes específicos**: Mostra exatamente o que está causando cada alerta
- **Informações completas**: Valores atuais, ideais e diferenças

### 2. Resumo 2x2
- **Total**: Número total de cativeiros
- **Críticos**: Cativeiros com alertas de severidade alta
- **Alertas**: Cativeiros com alertas de severidade média
- **OK**: Cativeiros sem alertas ativos

### 3. Detalhes dos Alertas
Para cada cativeiro com problemas, são exibidos:
- **Tipo de parâmetro**: Temperatura, pH ou Amônia
- **Severidade**: Alta ou Média
- **Mensagem**: Descrição do problema
- **Valores**: Atual, Ideal e Diferença
- **Ícones**: Emojis para identificação visual

## Endpoint da API

### GET `/cativeiros-status`
Retorna o status de todos os cativeiros do usuário logado.

**Headers necessários:**
```
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "success": true,
  "cativeiros": [
    {
      "id": "cativeiro_id",
      "nome": "Nome do Cativeiro",
      "tipo_camarao": "Tipo do Camarão",
      "status": "critico|alerta|ok",
      "statusText": "CRÍTICO|ALERTA|OK",
      "statusColor": "#ef4444|#f59e0b|#10b981",
      "alertas": ["alta", "media"],
      "alertasDetalhados": [
        {
          "tipo": "temperatura|ph|amonia",
          "severidade": "alta|media",
          "mensagem": "Descrição do problema",
          "valorAtual": 30.5,
          "valorIdeal": 26.0,
          "diferenca": 4.5,
          "datahora": "2024-01-01T10:00:00Z"
        }
      ],
      "totalAlertas": 2,
      "ultimaAtualizacao": "2024-01-01T10:00:00Z"
    }
  ],
  "resumo": {
    "total": 5,
    "ok": 2,
    "alerta": 1,
    "critico": 2
  }
}
```

## Navegação

### Botão na Home
- **Localização**: Header da página home
- **Ícone**: Checkmark em círculo
- **Ação**: Navega para `/status-cativeiros`

### Botão Voltar
- **Localização**: Header da página de status
- **Ação**: Retorna para a página anterior

## Responsividade

### Desktop/Tablet (≥768px)
- Resumo: Layout 2x2
- Cards: Layout horizontal
- Detalhes: Expandidos

### Mobile (<768px)
- Resumo: Layout 1 coluna
- Cards: Layout vertical
- Detalhes: Compactados

## Testes

### Script de Teste
Execute o script para verificar se a funcionalidade está funcionando:

```bash
cd api/tests
node test-status-detalhado.js
```

### Verificações
- ✅ Login e autenticação
- ✅ Endpoint `/cativeiros-status`
- ✅ Estrutura da resposta
- ✅ Detalhes dos alertas
- ✅ Contadores do resumo

## Integração com Notificações

A funcionalidade utiliza a mesma lógica de geração de alertas da tela de notificações:
- **Temperatura**: Desvio da temperatura ideal
- **pH**: Desvio do pH ideal  
- **Amônia**: Desvio da amônia ideal
- **Severidade**: Calculada com base na tolerância configurada

## Cores e Status

- **🟢 OK**: Verde (#10b981) - Sem alertas
- **🟡 ALERTA**: Amarelo (#f59e0b) - Alertas médios
- **🔴 CRÍTICO**: Vermelho (#ef4444) - Alertas altos

## Histórico de Mudanças

### v1.0 (Atual)
- ✅ Página dedicada (não modal)
- ✅ Layout 2x2 para resumo
- ✅ Detalhes específicos dos alertas
- ✅ Responsividade completa
- ✅ Integração com API existente 