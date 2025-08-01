#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Criando arquivo .env...\n');

const envContent = `# MongoDB Atlas Configuration
MONGO_URL=mongodb+srv://joaokusaka27:Oi2cWcwnYEzBXL7X@joaocluster.t5exvmz.mongodb.net/camarize?retryWrites=true&w=majority&appName=JoaoCluster

# Alternative local MongoDB (fallback)
MONGO_URL_LOCAL=mongodb://localhost:27017/camarize

# Server Configuration
PORT=4000
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Arquivo .env criado com sucesso!');
  console.log('📝 String de conexão configurada para: joaocluster.t5exvmz.mongodb.net');
  console.log('🎯 Agora execute: npm start');
  console.log('\n🔍 Para verificar a conexão:');
  console.log('- A API deve mostrar: "✅ MongoDB Atlas conectado com sucesso!"');
  console.log('- Depois acesse: https://cloud.mongodb.com para ver as coleções');
} catch (error) {
  console.error('❌ Erro ao criar arquivo .env:', error.message);
} 