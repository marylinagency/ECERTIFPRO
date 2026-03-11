import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  try {
    console.log('[CHECK] Checking database connection...');
    
    // Test connection
    const count = await db.certificate.count();
    console.log(`[CHECK] Database connected. Total certificates: ${count}`);
    
    // Get all certificates
    const certificates = await db.certificate.findMany({
      where: { isActive: true },
    });
    
    console.log(`[CHECK] Active certificates: ${certificates.length}`);
    certificates.forEach(cert => {
      console.log(`  - ${cert.title} (${cert.level}) - $${cert.price}`);
    });
    
    if (certificates.length === 0) {
      console.log('[CHECK] ⚠️ No certificates found. Running seed...');
      console.log('[CHECK] Please run: npm run db:seed');
    } else {
      console.log('[CHECK] ✅ Certificates are ready!');
    }
    
  } catch (error) {
    console.error('[ERROR] Database connection failed:', error.message);
    console.log('[ERROR] Make sure:');
    console.log('  1. DATABASE_URL is set in environment variables');
    console.log('  2. Database migrations have been run: npx prisma migrate deploy');
    console.log('  3. Seed has been run: npm run db:seed');
  } finally {
    await db.$disconnect();
  }
}

main();
