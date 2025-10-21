/**
 * verifyDemoUser.js - utility script to verify the demo user was created
 * Usage: node backend/scripts/verifyDemoUser.js
 */
require('dotenv').config({ path: __dirname + '/../.env' });

// Also load production env if exists
require('dotenv').config({ path: __dirname + '/../.env.production', override: true });

const { createClient } = require('@supabase/supabase-js');

async function verifyDemoUser() {
  try {
    // Create Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false
        }
      }
    );
    
    // Check if user exists
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, display_name, created_at')
      .eq('display_name', 'Ritesh');
      
    if (error) {
      console.error('Error querying users:', error.message);
      return;
    }
    
    if (users.length === 0) {
      console.log('No user found with username Ritesh');
      return;
    }
    
    console.log('Found user:');
    console.log('- ID:', users[0].id);
    console.log('- Email:', users[0].email);
    console.log('- Display Name:', users[0].display_name);
    console.log('- Created At:', users[0].created_at);
    
    // Check if profile exists
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, display_name')
      .eq('id', users[0].id);
      
    if (profileError) {
      console.error('Error querying profiles:', profileError.message);
      return;
    }
    
    if (profiles.length === 0) {
      console.log('No profile found for user');
      return;
    }
    
    console.log('Profile found:');
    console.log('- ID:', profiles[0].id);
    console.log('- Display Name:', profiles[0].display_name);
    
    console.log('\n✅ Demo user verification successful!');

  } catch (error) {
    console.error('Error verifying demo user:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

if (require.main === module) {
  verifyDemoUser();
}