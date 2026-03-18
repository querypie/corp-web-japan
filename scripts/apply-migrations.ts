#!/usr/bin/env tsx
/**
 * Apply Supabase migrations
 *
 * This script reads migration files and applies them to the Supabase database
 * using the service role key for admin access.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSql(sql: string, description: string) {
  console.log(`\n📝 Executing: ${description}`);

  try {
    // Split SQL into individual statements (basic split on semicolons)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (!statement) continue;

      // Execute via Supabase REST API
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_string: statement + ';'
      });

      if (error) {
        // Try alternative: some statements might work better via direct query
        console.log(`⚠️  RPC failed, trying alternative method...`);
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sql_string: statement + ';' })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      }
    }

    console.log(`✅ Success: ${description}`);
    return true;
  } catch (error) {
    console.error(`❌ Error in ${description}:`, error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Supabase migration...\n');
  console.log(`📍 Target: ${supabaseUrl}\n`);

  // Read migration files
  const migrationsDir = join(process.cwd(), 'supabase', 'migrations');

  const migrations = [
    {
      file: '00001_initial_schema.sql',
      description: 'Initial database schema'
    },
    {
      file: '00002_instagram_oauth.sql',
      description: 'Instagram OAuth updates'
    }
  ];

  let successCount = 0;

  for (const migration of migrations) {
    const filePath = join(migrationsDir, migration.file);
    const sql = readFileSync(filePath, 'utf-8');

    const success = await executeSql(sql, migration.description);
    if (success) successCount++;
  }

  console.log(`\n\n📊 Migration Summary:`);
  console.log(`✅ ${successCount}/${migrations.length} migrations applied successfully`);

  if (successCount === migrations.length) {
    console.log('\n🎉 All migrations completed!');
  } else {
    console.log('\n⚠️  Some migrations failed. Please check errors above.');
    console.log('💡 Tip: You can also run these migrations manually in Supabase Dashboard > SQL Editor');
    process.exit(1);
  }
}

main();
