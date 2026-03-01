import { randomBytes, scryptSync } from 'node:crypto';
import { PrismaClient, Role, ListingStatus } from '@prisma/client';

const prisma = new PrismaClient();

const required = ['ADMIN_EMAIL', 'ADMIN_PASSWORD'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Missing required env for seed: ${missing.join(', ')}`);
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${key}`;
}

const adminEmail = process.env.ADMIN_EMAIL;
const adminPasswordHash = hashPassword(process.env.ADMIN_PASSWORD);
const hostEmail = process.env.HOST_EMAIL ?? 'host@example.com';
const hostPasswordHash = hashPassword(process.env.HOST_PASSWORD ?? 'host123456');

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN, passwordHash: adminPasswordHash },
    create: {
      email: adminEmail,
      name: 'Admin',
      role: Role.ADMIN,
      passwordHash: adminPasswordHash
    }
  });

  const host = await prisma.user.upsert({
    where: { email: hostEmail },
    update: { role: Role.HOST, passwordHash: hostPasswordHash },
    create: {
      email: hostEmail,
      name: 'Demo Host',
      role: Role.HOST,
      passwordHash: hostPasswordHash,
      telegramChatId: process.env.HOST_TELEGRAM_CHAT_ID
    }
  });

  const listing = await prisma.listing.upsert({
    where: { id: 'seed-listing-1' },
    update: {},
    create: {
      id: 'seed-listing-1',
      title: 'Уютная квартира у набережной',
      address: 'ул. Ленина, 10, Судак',
      district: 'Центр',
      description: 'Тестовый объект для MVP',
      guests: 4,
      rooms: 2,
      beds: 3,
      amenities: ['Wi-Fi', 'Кухня', 'Кондиционер'],
      rules: 'Без вечеринок',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      status: ListingStatus.PUBLISHED,
      ownerId: host.id,
      photos: {
        create: [
          { url: 'https://placehold.co/1200x800?text=Sudak+1', sortOrder: 0 },
          { url: 'https://placehold.co/1200x800?text=Sudak+2', sortOrder: 1 }
        ]
      },
      pricePeriods: {
        create: [
          {
            dateFrom: new Date('2026-06-01T00:00:00.000Z'),
            dateTo: new Date('2026-07-01T00:00:00.000Z'),
            pricePerNight: 4500
          },
          {
            dateFrom: new Date('2026-07-01T00:00:00.000Z'),
            dateTo: new Date('2026-09-01T00:00:00.000Z'),
            pricePerNight: 6200
          }
        ]
      }
    }
  });

  await prisma.listing.upsert({
    where: { id: 'seed-listing-2' },
    update: {},
    create: {
      id: 'seed-listing-2',
      title: 'Дом с видом на крепость',
      address: 'ул. Морская, 3, Судак',
      district: 'Морской',
      description: 'Тестовый объект 2 для MVP',
      guests: 6,
      rooms: 3,
      beds: 4,
      amenities: ['Парковка', 'Мангал', 'Wi-Fi'],
      rules: 'Можно с детьми',
      checkInTime: '15:00',
      checkOutTime: '11:00',
      status: ListingStatus.PENDING_REVIEW,
      ownerId: host.id,
      photos: {
        create: [{ url: 'https://placehold.co/1200x800?text=Sudak+3', sortOrder: 0 }]
      },
      pricePeriods: {
        create: [
          {
            dateFrom: new Date('2026-06-01T00:00:00.000Z'),
            dateTo: new Date('2026-09-01T00:00:00.000Z'),
            pricePerNight: 7800
          }
        ]
      }
    }
  });

  console.log('Seed complete:', { adminId: admin.id, hostId: host.id, listingId: listing.id });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
