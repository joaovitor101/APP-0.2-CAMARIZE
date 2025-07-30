#!/bin/bash

echo "🚀 Iniciando deploy do Camarize no Vercel..."
echo "=============================================="

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

# Verificar se está logado no Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Faça login no Vercel..."
    vercel login
fi

echo "📦 Preparando deploy..."

# Deploy do Backend
echo "🔧 Deployando Backend..."
cd api
vercel --prod --yes
cd ..

# Deploy do Frontend
echo "🎨 Deployando Frontend..."
cd front-react
vercel --prod --yes
cd ..

echo "✅ Deploy concluído!"
echo "🌐 URLs disponíveis no painel do Vercel"
echo "📱 Acesse: https://vercel.com/dashboard" 