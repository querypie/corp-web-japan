#!/usr/bin/env tsx
/**
 * Check Supabase database status
 */

import { config } from 'dotenv';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
config({ path: join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  console.log('🔍 Checking Supabase database status...\n');

  const tables = ['users', 'workspaces', 'projects', 'sns_accounts', 'posts', 'card_news', 'content_ideas'];

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true });

    if (error) {
      console.log(`❌ Table '${table}': NOT EXISTS or NO ACCESS`);
      console.log(`   Error: ${error.message}`);
    } else {
      console.log(`✅ Table '${table}': EXISTS`);
    }
  }

  console.log('\n💡 If tables don\'t exist, please run the migrations in Supabase Dashboard:');
  console.log('   1. Go to https://supabase.com/dashboard');
  console.log('   2. Select your project');
  console.log('   3. Go to SQL Editor');
  console.log('   4. Copy and paste content from:');
  console.log('      - supabase/migrations/00001_initial_schema.sql');
  console.log('      - supabase/migrations/00002_instagram_oauth.sql');
}

main();
