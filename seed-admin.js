let PrismaClient;
try {
  PrismaClient = require('./dist/src/generated/prisma/client').PrismaClient;
} catch (e) {
  PrismaClient = require('./dist/generated/prisma/client').PrismaClient;
}

let bcrypt;
try { bcrypt = require('bcrypt'); } catch(e) { bcrypt = require('bcryptjs'); }

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// Aqui está o segredo: Instanciando o Prisma igualzinho ao seu prisma.service.ts
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("⏳ Gerando hash da senha...");
    const hash = bcrypt.hashSync('123456', 10);
    
    console.log("⏳ Inserindo usuário no banco...");
    await prisma.adminUser.upsert({
      where: { email: 'admin@oficina.com' },
      update: {},
      create: {
        name: 'Administrador',
        email: 'admin@oficina.com',
        passwordHash: hash,
        role: 'ADMIN', // Role que está no seu schema
      },
    });
    console.log('✅ SUCESSO! Usuário criado: admin@oficina.com | Senha: 123456');
  } catch (err) {
    console.error('❌ Erro no banco de dados:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();