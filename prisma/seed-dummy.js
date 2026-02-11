const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

  // Create a test user (upsert)
  const user = await prisma.user.upsert({
    where: { user_id: '11111111-1111-1111-1111-111111111111' },
    update: {},
    create: {
      user_id: '11111111-1111-1111-1111-111111111111',
      first_name: 'Test',
      last_name: 'User',
      email: 'test.user@orvio.com',
      password_hash: 'hashedpassword',
      active: true,
    },
  });


  // Create a test brand (upsert)
  const brand = await prisma.brand.upsert({
    where: { brand_id: '22222222-2222-2222-2222-222222222222' },
    update: {},
    create: {
      brand_id: '22222222-2222-2222-2222-222222222222',
      brand_name: 'TestBrand',
      description: 'A test brand',
    },
  });


  // Create a test product (upsert)
  const product = await prisma.product.upsert({
    where: { product_id: '33333333-3333-3333-3333-333333333333' },
    update: {},
    create: {
      product_id: '33333333-3333-3333-3333-333333333333',
      name: 'TestProduct',
      brand_id: brand.brand_id,
      unit_price: 10.00,
      is_active: true,
    },
  });


  // Create a test cooler (device) (upsert)
  const cooler = await prisma.cooler.upsert({
    where: { device_id: '44444444-4444-4444-4444-444444444444' },
    update: {},
    create: {
      device_id: '44444444-4444-4444-4444-444444444444',
      name: 'TestCooler',
      location_description: 'Test Location',
      status: 'ACTIVE',
      last_checkin_time: new Date(),
      door_status: false,
      shelf_count: 3,
      session_limit: 2,
    },
  });


  // Create a test inventory (upsert)
  await prisma.inventory.upsert({
    where: { device_id_product_id: { device_id: cooler.device_id, product_id: product.product_id } },
    update: {},
    create: {
      device_id: cooler.device_id,
      product_id: product.product_id,
      current_stock: 10,
      critic_stock: 2,
      last_stock_update: new Date(),
    },
  });


  // Create a test transaction (upsert)
  await prisma.transaction.upsert({
    where: { transaction_id: '55555555-5555-5555-5555-555555555555' },
    update: {},
    create: {
      transaction_id: '55555555-5555-5555-5555-555555555555',
      user_id: user.user_id,
      device_id: cooler.device_id,
      start_time: new Date(),
      is_active: false,
      status: 'COMPLETED',
    },
  });


  // Create a test telemetry (upsert)
  await prisma.telemetry.upsert({
    where: { telemetry_id: '66666666-6666-6666-6666-666666666666' },
    update: {},
    create: {
      telemetry_id: '66666666-6666-6666-6666-666666666666',
      device_id: cooler.device_id,
      timestamp: new Date(),
      internal_temperature: 4.2,
      door_sensor_status: false,
    },
  });

  console.log('Dummy data inserted!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
