const { supabase } = require('./config/supabaseDb');

async function checkTableStructure() {
  console.log('Checking table structures by testing data operations...\n');
  
  // Test users table
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, display_name, created_at')
      .limit(1);
    
    if (userError) {
      console.log('users table: ERROR -', userError.message);
    } else {
      console.log('users table: OK');
      if (userData && userData.length > 0) {
        console.log('  Sample columns:', Object.keys(userData[0]));
      }
    }
  } catch (err) {
    console.log('users table: EXCEPTION -', err.message);
  }
  
  console.log('');
  
  // Test profiles table
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, display_name, bio, experience_level')
      .limit(1);
    
    if (profileError) {
      console.log('profiles table: ERROR -', profileError.message);
    } else {
      console.log('profiles table: OK');
      if (profileData && profileData.length > 0) {
        console.log('  Sample columns:', Object.keys(profileData[0]));
      }
    }
  } catch (err) {
    console.log('profiles table: EXCEPTION -', err.message);
  }
  
  console.log('');
  
  // Test sadhanas table
  try {
    const { data: sadhanaData, error: sadhanaError } = await supabase
      .from('sadhanas')
      .select('id, user_id, title, description, completed')
      .limit(1);
    
    if (sadhanaError) {
      console.log('sadhanas table: ERROR -', sadhanaError.message);
    } else {
      console.log('sadhanas table: OK');
      if (sadhanaData && sadhanaData.length > 0) {
        console.log('  Sample columns:', Object.keys(sadhanaData[0]));
      }
    }
  } catch (err) {
    console.log('sadhanas table: EXCEPTION -', err.message);
  }
  
  console.log('');
  
  // Test spiritual_books table
  try {
    const { data: bookData, error: bookError } = await supabase
      .from('spiritual_books')
      .select('id, user_id, title, author, traditions')
      .limit(1);
    
    if (bookError) {
      console.log('spiritual_books table: ERROR -', bookError.message);
    } else {
      console.log('spiritual_books table: OK');
      if (bookData && bookData.length > 0) {
        console.log('  Sample columns:', Object.keys(bookData[0]));
      }
    }
  } catch (err) {
    console.log('spiritual_books table: EXCEPTION -', err.message);
  }
}

checkTableStructure();