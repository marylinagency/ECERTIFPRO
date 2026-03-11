#!/usr/bin/env node

/**
 * Database Setup Script
 * =====================
 * This script initializes the production database with:
 * 1. Prisma migrations
 * 2. Row-Level Security (RLS) policies
 * 3. Admin user seeding
 * 4. Test data
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '✓',
    error: '✗',
    warn: '⚠',
    success: '✅'
  }[type];
  console.log(`[${timestamp}] ${prefix} ${message}`);
};

const runCommand = (command, args, options = {}) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
};

const main = async () => {
  try {
    log('Starting database setup...', 'info');

    // Step 1: Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    log('Database URL configured', 'success');

    // Step 2: Run Prisma migrations
    log('Running Prisma migrations...', 'info');
    await runCommand('npx', ['prisma', 'migrate', 'deploy', '--skip-generate']);
    log('Prisma migrations completed', 'success');

    // Step 3: Generate Prisma client
    log('Generating Prisma client...', 'info');
    await runCommand('npx', ['prisma', 'generate']);
    log('Prisma client generated', 'success');

    // Step 4: Run RLS SQL script
    log('Setting up Row-Level Security policies...', 'info');
    const rlsScriptPath = path.join(process.cwd(), 'scripts', '01-init-rls.sql');
    if (fs.existsSync(rlsScriptPath)) {
      const rlsScript = fs.readFileSync(rlsScriptPath, 'utf8');
      await runCommand('psql', [process.env.DATABASE_URL, '-c', rlsScript]);
      log('RLS policies configured', 'success');
    } else {
      log('RLS script not found', 'warn');
    }

    // Step 5: Seed admin user
    log('Seeding admin user...', 'info');
    const seedScriptPath = path.join(process.cwd(), 'scripts', '02-seed-admin.sql');
    if (fs.existsSync(seedScriptPath)) {
      const seedScript = fs.readFileSync(seedScriptPath, 'utf8');
      await runCommand('psql', [process.env.DATABASE_URL, '-c', seedScript]);
      log('Admin user seeded', 'success');
    } else {
      log('Seed script not found', 'warn');
    }

    log('', 'info');
    log('===========================================', 'info');
    log('DATABASE SETUP COMPLETED SUCCESSFULLY!', 'success');
    log('===========================================', 'info');
    log('', 'info');
    log('Admin Credentials:', 'info');
    log('  Email: admin@ecertif.pro', 'info');
    log('  Password: AdminSecure@2024', 'info');
    log('', 'info');
    log('Test User:', 'info');
    log('  Email: user@test.com', 'info');
    log('  Password: TestUser123', 'info');
    log('', 'info');

  } catch (error) {
    log(`Setup failed: ${error.message}`, 'error');
    process.exit(1);
  }
};

main();
