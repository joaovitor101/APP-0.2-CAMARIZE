#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Configuração do MongoDB Atlas para Camarize');
console.log('==============================================\n');

// Verifica se o arquivo .env já existe
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('⚠️  Arquivo .env já existe!');
  console.log('📝 Você pode editar manualmente ou sobrescrever.\n');
}

console.log('📋 Para configurar o MongoDB Atlas, siga estes passos:\n');

console.log('1️⃣  Acesse: https://www.mongodb.com/atlas');
console.log('2️⃣  Crie uma conta ou faça login');
console.log('3️⃣  Crie um novo cluster (M0 Free Tier)');
console.log('4️⃣  Configure Database Access:');
console.log('   - Vá em "Database Access"');
console.log('   - Clique em "Add New Database User"');
console.log('   - Crie um usuário com senha');
console.log('   - Selecione "Read and write to any database"');
console.log('5️⃣  Configure Network Access:');
console.log('   - Vá em "Network Access"');
console.log('   - Clique em "Add IP Address"');
console.log('   - Para desenvolvimento: "Allow Access from Anywhere"');
console.log('6️⃣  Obtenha a string de conexão:');
console.log('   - No cluster, clique em "Connect"');
console.log('   - Escolha "Connect your application"');
console.log('   - Copie a string de conexão\n');

console.log('🔧 Exemplo de arquivo .env:');
console.log('MONGO_URL=mongodb+srv://usuario:senha@cluster.mongodb.net/camarize?retryWrites=true&w=majority');
console.log('PORT=4000');
console.log('NODE_ENV=development\n');

console.log('📚 Para mais detalhes, consulte o arquivo MONGODB_ATLAS_SETUP.md');
console.log('🎯 Após configurar, execute: npm start'); 