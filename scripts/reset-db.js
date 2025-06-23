import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

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
      if (response.status === 404) {
        console.log('⚠️  exec_sql function not found. Please run migrations first.');
        return false;
      }
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    return true;
  } catch (error) {
    console.warn(`⚠️  Warning executing SQL: ${error.message}`);
    return false;
  }
}

async function resetDatabase() {
  try {
    console.log('🔄 Resetting database...');
    
    // List of tables to drop in correct order (respecting foreign keys)
    const tables = [
      'snippet_views',
      'snippet_likes', 
      'snippet_comments',
      'snippet_collaborators',
      'snippet_versions',
      'snippets',
      'activities',
      'notifications',
      'integrations',
      'subscriptions',
      'team_members',
      'teams',
      'folders',
      'profiles'
    ];

    // Also drop any functions we might have created
    const functions = [
      'update_snippet_search_vector()',
      'update_updated_at_column()',
      'handle_new_user()'
    ];

    // Drop tables
    for (const table of tables) {
      console.log(`🗑️  Dropping table: ${table}`);
      
      const success = await executeSql(`DROP TABLE IF EXISTS ${table} CASCADE;`);
      if (success) {
        console.log(`✅ Dropped table: ${table}`);
      } else {
        console.warn(`⚠️  Could not drop table: ${table}`);
      }
    }

    // Drop functions
    for (const func of functions) {
      console.log(`🗑️  Dropping function: ${func}`);
      
      const success = await executeSql(`DROP FUNCTION IF EXISTS ${func} CASCADE;`);
      if (success) {
        console.log(`✅ Dropped function: ${func}`);
      } else {
        console.warn(`⚠️  Could not drop function: ${func}`);
      }
    }

    // Drop any custom types
    const types = ['user_role', 'snippet_visibility', 'notification_type'];
    for (const type of types) {
      console.log(`🗑️  Dropping type: ${type}`);
      
      const success = await executeSql(`DROP TYPE IF EXISTS ${type} CASCADE;`);
      if (success) {
        console.log(`✅ Dropped type: ${type}`);
      } else {
        console.warn(`⚠️  Could not drop type: ${type}`);
      }
    }

    console.log('\n🎉 Database reset completed!');
    console.log('💡 Run "npm run db:migrate" to recreate the schema.');

  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure your Supabase project is active');
    console.log('2. Verify your environment variables are correct');
    console.log('3. Check that your service role key has the necessary permissions');
    process.exit(1);
  }
}

resetDatabase();