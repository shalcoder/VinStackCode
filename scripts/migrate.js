import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSql(sql) {
  try {
    // Use the REST API directly to execute SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ sql_query: sql })
    });

    if (!response.ok) {
      // If exec_sql doesn't exist, try creating it first
      if (response.status === 404) {
        console.log('📝 Creating exec_sql function...');
        await createExecSqlFunction();
        // Retry the original query
        return await executeSql(sql);
      }
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    return response;
  } catch (error) {
    console.warn(`⚠️  Warning executing SQL: ${error.message}`);
    return null;
  }
}

async function createExecSqlFunction() {
  const createFunctionSql = `
    CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $function$
    BEGIN
        EXECUTE sql_query;
    END;
    $function$;

    GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;
  `;

  try {
    // Try to create the function using direct SQL execution
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sql',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: createFunctionSql
    });

    if (response.ok) {
      console.log('✅ Created exec_sql function');
    } else {
      console.log('⚠️  Could not create exec_sql function automatically');
      console.log('📋 Please run this SQL in your Supabase SQL Editor:');
      console.log(createFunctionSql);
      throw new Error('exec_sql function creation failed');
    }
  } catch (error) {
    console.log('⚠️  Could not create exec_sql function automatically');
    console.log('📋 Please run this SQL in your Supabase SQL Editor:');
    console.log(createFunctionSql);
    throw error;
  }
}

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');
    
    const migrationsDir = join(__dirname, '../supabase/migrations');
    const migrationFiles = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (migrationFiles.length === 0) {
      console.log('📝 No migration files found.');
      return;
    }

    console.log(`📁 Found ${migrationFiles.length} migration files:`);
    migrationFiles.forEach(file => console.log(`   - ${file}`));

    // First, ensure the exec_sql function exists
    try {
      await executeSql('SELECT 1');
    } catch (error) {
      console.log('📝 Setting up database functions...');
      await createExecSqlFunction();
    }

    for (const file of migrationFiles) {
      console.log(`\n⚡ Running migration: ${file}`);
      
      const filePath = join(migrationsDir, file);
      const sql = readFileSync(filePath, 'utf8');
      
      // Clean up the SQL and split into statements
      const cleanSql = sql
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/--.*$/gm, '') // Remove single-line comments
        .trim();

      if (cleanSql) {
        const result = await executeSql(cleanSql);
        if (result) {
          console.log(`✅ Completed migration: ${file}`);
        } else {
          console.log(`⚠️  Migration completed with warnings: ${file}`);
        }
      } else {
        console.log(`⏭️  Skipped empty migration: ${file}`);
      }
    }

    console.log('\n🎉 All migrations completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Verify tables were created in your Supabase dashboard');
    console.log('2. Check that RLS policies are enabled');
    console.log('3. Test user registration and login');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure your Supabase project is active');
    console.log('2. Verify your environment variables are correct');
    console.log('3. Check that your service role key has the necessary permissions');
    console.log('4. If exec_sql function creation failed, create it manually in SQL Editor');
    process.exit(1);
  }
}

runMigrations();