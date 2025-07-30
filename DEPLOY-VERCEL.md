# 🚀 Deploy no Vercel - Camarize

## 📋 Pré-requisitos

- ✅ Conta no Vercel (gratuita)
- ✅ Conta no MongoDB Atlas (já configurada)
- ✅ Projeto no GitHub/GitLab

## 🔧 Configuração

### 1. **Preparar o Repositório**

Certifique-se de que seu projeto está no GitHub com a seguinte estrutura:
```
APP-0.2-CAMARIZE/
├── api/                    # Backend Node.js
├── front-react/           # Frontend Next.js
├── vercel.json           # Configuração principal
└── README.md
```

### 2. **Deploy no Vercel**

#### **Opção A: Deploy Separado (Recomendado)**

**Backend (API):**
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe o repositório
4. Configure:
   - **Framework Preset**: Node.js
   - **Root Directory**: `api`
   - **Build Command**: `npm install`
   - **Output Directory**: `.`
   - **Install Command**: `npm install`

**Frontend:**
1. Crie outro projeto no Vercel
2. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `front-react`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### **Opção B: Deploy Unificado**

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe o repositório
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `.`
   - **Build Command**: `cd front-react && npm run build`
   - **Output Directory**: `front-react/.next`

### 3. **Variáveis de Ambiente**

No painel do Vercel, vá em **Settings > Environment Variables**:

#### **Para o Backend:**
```bash
MONGO_URL=mongodb+srv://joaokusaka27:Oi2cWcwnYEzBXL7X@joaocluster.t5exvmz.mongodb.net/camarize?retryWrites=true&w=majority
```

#### **Para o Frontend:**
```bash
NEXT_PUBLIC_API_URL=https://seu-backend.vercel.app
```

### 4. **Domínios**

Após o deploy, você terá URLs como:
- **Backend**: `https://seu-projeto-api.vercel.app`
- **Frontend**: `https://seu-projeto-frontend.vercel.app`

## 🔄 **Deploy Automático**

O Vercel faz deploy automático sempre que você fizer push para o GitHub!

## 📱 **Testando**

1. Acesse a URL do frontend
2. Teste o login/registro
3. Verifique se as APIs estão funcionando
4. Teste o sistema de notificações

## 🛠️ **Comandos Úteis**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login no Vercel
vercel login

# Deploy manual
vercel

# Deploy para produção
vercel --prod
```

## 🔧 **Troubleshooting**

### **Erro de CORS:**
Adicione no backend:
```javascript
app.use(cors({
  origin: ['https://seu-frontend.vercel.app'],
  credentials: true
}));
```

### **Erro de Conexão MongoDB:**
Verifique se a URL do MongoDB Atlas está correta e se o IP está liberado.

### **Erro de Build:**
Verifique se todas as dependências estão no `package.json`.

## 📞 **Suporte**

Se tiver problemas:
1. Verifique os logs no Vercel
2. Teste localmente primeiro
3. Verifique as variáveis de ambiente

---

**🎯 Seu projeto estará online e funcionando!** ✨ 