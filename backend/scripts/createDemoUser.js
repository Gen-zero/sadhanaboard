/**
 * createDemoUser.js - utility script to create a demo user
 * Usage: node backend/scripts/createDemoUser.js
 */
require('dotenv').config({ path: __dirname + '/../.env' });

// Also load production env if exists
require('dotenv').config({ path: __dirname + '/../.env.production', override: true });

const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

async function createDemoUser() {
  try {
    // Demo user credentials
    const username = 'Ritesh';
    const email = 'ritesh@example.com';
    const password = 'Ritesh@123';
    
    console.log('Creating demo user with credentials:');
    console.log('- Username:', username);
    console.log('- Email:', email);
    console.log('- Password:', password);
    
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
    
    // Check if user already exists
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},display_name.eq.${username}`);
      
    if (fetchError) {
      console.error('Error checking existing users:', fetchError.message);
      return;
    }
    
    if (existingUsers.length > 0) {
      console.log('User already exists with email or username');
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          email: email,
          password: hashedPassword,
          display_name: username
        }
      ])
      .select()
      .single();
      
    if (insertError) {
      console.error('Error creating user:', insertError.message);
      return;
    }
    
    console.log('User created successfully:', user);

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          display_name: username
        }
      ]);
      
    if (profileError) {
      console.error('Error creating profile:', profileError.message);
      return;
    }
    
    console.log('Profile created successfully for user:', user.display_name);

  } catch (error) {
    console.error('Error creating demo user:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

if (require.main === module) {
  createDemoUser();
}