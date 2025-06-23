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

    for (const table of tables) {
      console.log(`🗑️  Dropping table: ${table}`);
      
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          },
          body: JSON.stringify({ 
            sql_query: `DROP TABLE IF EXISTS ${table} CASCADE;` 
          })
        });

        if (response.ok) {
          console.log(`✅ Dropped table: ${table}`);
        } else {
          console.warn(`⚠️  Could not drop table: ${table}`);
        }
      } catch (error) {
        console.warn(`⚠️  Could not drop table: ${table} - ${error.message}`);
      }
    }

    console.log('\n🎉 Database reset completed!');
    console.log('💡 Run "npm run db:migrate" to recreate the schema.');

  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  }
}

resetDatabase();