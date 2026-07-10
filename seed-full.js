// seed-full.js
let PrismaClient;
try {
  PrismaClient = require('./dist/src/generated/prisma/client').PrismaClient;
} catch (e) {
  try {
    PrismaClient = require('./dist/generated/prisma/client').PrismaClient;
  } catch (e2) {
    console.error("❌ Não achei o Prisma Client gerado!");
    process.exit(1);
  }
}

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Iniciando povoamento massivo do banco...');

  try {
    // 1. Criar Cliente
    console.log('👤 Criando Cliente...');
    const customer = await prisma.customer.upsert({
      where: { document: '12345678901' },
      update: {},
      create: {
        name: 'João Silva',
        documentType: 'CPF', // Enum DocumentType
        document: '12345678901',
        phone: '11999999999',
        email: 'joao@email.com',
      },
    });

    // 2. Criar Veículo para o Cliente
    console.log('🚗 Criando Veículo...');
    const vehicle = await prisma.vehicle.upsert({
      where: { plate: 'ABC1D23' },
      update: {},
      create: {
        customerId: customer.id,
        plate: 'ABC1D23',
        brand: 'Volkswagen',
        model: 'Gol',
        year: 2020,
        color: 'Branco',
      },
    });

    // 3. Criar Serviços Base no Catálogo
    console.log('🛠️ Criando Serviços...');
    await prisma.service.deleteMany(); // Limpa para evitar duplicados caso rode várias vezes
    
    const service1 = await prisma.service.create({
      data: {
        name: 'Troca de Óleo',
        description: 'Troca de óleo do motor e filtro',
        basePrice: 150.00,
        estimatedTimeMinutes: 60,
      },
    });

    const service2 = await prisma.service.create({
      data: {
        name: 'Alinhamento e Balanceamento',
        description: 'Alinhamento 3D e balanceamento das 4 rodas',
        basePrice: 120.00,
        estimatedTimeMinutes: 45,
      },
    });

    // 4. Criar Peças/Insumos no Estoque
    console.log('📦 Criando Itens de Estoque...');
    await prisma.inventoryItem.deleteMany();

    const item1 = await prisma.inventoryItem.create({
      data: {
        code: 'OLEO-5W40-001',
        name: 'Óleo Sintético 5W40',
        description: 'Óleo de motor',
        itemType: 'SUPPLY', // Enum InventoryItemType
        unitPrice: 50.00,
        quantityAvailable: 50, // Nome correto!
        minimumQuantity: 10,
      },
    });

    const item2 = await prisma.inventoryItem.create({
      data: {
        code: 'FILTRO-OLEO-001',
        name: 'Filtro de Óleo',
        description: 'Filtro padrão',
        itemType: 'PART', // Enum InventoryItemType
        unitPrice: 30.00,
        quantityAvailable: 20, // Nome correto!
        minimumQuantity: 5,
      },
    });

    // 5. Criar uma Ordem de Serviço inicial
    console.log('📋 Criando Ordem de Serviço...');
    await prisma.workOrder.deleteMany(); // Limpa work orders antigas para evitar conflitos de unique code
    
    await prisma.workOrder.create({
      data: {
        code: 'OS-0001', // Necessário pois é @unique
        vehicleId: vehicle.id,
        customerId: customer.id,
        status: 'RECEIVED', // Enum WorkOrderStatus
        initialNotes: 'Revisão básica de 10.000km',
      }
    });

    console.log('✅ Povoamento concluído com SUCESSO! Banco pronto para testes.');
  } catch (error) {
    console.error('❌ Erro durante o povoamento:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();