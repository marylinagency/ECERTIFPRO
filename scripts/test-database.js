#!/usr/bin/env node

/**
 * Database Connection Test Script
 * ================================
 * Tests the database connection and verifies all setup is complete
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',      // cyan
    success: '\x1b[32m',   // green
    error: '\x1b[31m',     // red
    warn: '\x1b[33m',      // yellow
    reset: '\x1b[0m'
  };
  const prefix = {
    info: 'ℹ️  ',
    success: '✅ ',
    error: '❌ ',
    warn: '⚠️  '
  }[type];
  console.log(`${colors[type]}[${timestamp}] ${prefix} ${message}${colors.reset}`);
};

const testDatabase = async () => {
  try {
    log('Starting database connection test...', 'info');
    log('');

    // Test 1: Basic connection
    log('Test 1: Testing database connection...', 'info');
    try {
      await prisma.$queryRaw`SELECT 1`;
      log('Database connection successful', 'success');
    } catch (error) {
      log('Database connection failed: ' + error.message, 'error');
      throw error;
    }

    // Test 2: Check User table
    log('Test 2: Checking User table...', 'info');
    const userCount = await prisma.user.count();
    log(`Found ${userCount} users in database`, 'success');

    // Test 3: Check Admin user
    log('Test 3: Looking for admin user...', 'info');
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@ecertif.pro' },
      select: { id: true, email: true, name: true, role: true }
    });
    
    if (admin) {
      log(`Admin found: ${admin.email} (${admin.name})`, 'success');
    } else {
      log('Admin user not found - you may need to run: npm run db:seed', 'warn');
    }

    // Test 4: Check Certificates
    log('Test 4: Checking Certificate table...', 'info');
    const certCount = await prisma.certificate.count();
    if (certCount > 0) {
      log(`Found ${certCount} certificates`, 'success');
      const certs = await prisma.certificate.findMany({
        select: { id: true, title: true, level: true }
      });
      certs.forEach(cert => {
        log(`  • ${cert.title} (${cert.level})`, 'info');
      });
    } else {
      log('No certificates found - you may need to run: npm run db:seed', 'warn');
    }

    // Test 5: Check Badges
    log('Test 5: Checking Badge table...', 'info');
    const badgeCount = await prisma.badge.count();
    if (badgeCount > 0) {
      log(`Found ${badgeCount} badges`, 'success');
    } else {
      log('No badges found - you may need to run: npm run db:seed', 'warn');
    }

    // Test 6: Check Questions
    log('Test 6: Checking Question table...', 'info');
    const questionCount = await prisma.question.count();
    if (questionCount > 0) {
      log(`Found ${questionCount} questions`, 'success');
    } else {
      log('No questions found - you may need to run: npm run db:seed', 'warn');
    }

    log('');
    log('═══════════════════════════════════════════════════════', 'info');
    log('ALL TESTS COMPLETED SUCCESSFULLY! ✅', 'success');
    log('═══════════════════════════════════════════════════════', 'info');
    log('');
    log('Your database is properly configured.', 'success');
    log('You can now start the development server with: npm run dev', 'success');
    log('');

  } catch (error) {
    log('', 'error');
    log('═══════════════════════════════════════════════════════', 'error');
    log('DATABASE TEST FAILED', 'error');
    log('═══════════════════════════════════════════════════════', 'error');
    log('', 'error');
    log('Error: ' + error.message, 'error');
    log('', 'error');
    log('Please check:', 'warn');
    log('1. DATABASE_URL environment variable is set', 'info');
    log('2. Database connection string is correct', 'info');
    log('3. PostgreSQL server is running', 'info');
    log('4. Run: npm run db:setup', 'info');
    log('', 'error');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

testDatabase();
