const { supabase } = require('./config/supabaseDb');

async function checkTables() {
  const tables = [
    'users', 
    'profiles', 
    'sadhanas', 
    'sadhana_progress', 
    'spiritual_books', 
    'book_progress',
    'cms_themes',
    'groups',
    'group_members',
    'community_posts',
    'community_comments',
    'achievements',
    'user_achievements'
  ];

  console.log('Checking tables in Supabase database...\n');
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`${table}: ERROR - ${error.message}`);
      } else {
        console.log(`${table}: OK`);
      }
    } catch (err) {
      console.log(`${table}: EXCEPTION - ${err.message}`);
    }
  }
}

checkTables();