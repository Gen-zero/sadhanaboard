/**
 * Demo Authentication System
 * Allows users to access the application without backend authentication
 * for testing and demonstration purposes
 */

export interface DemoUser {
  id: string;
  email: string;
  display_name: string;
  token: string;
}

/**
 * Generate a demo user with predefined credentials
 * This allows quick access for testing without needing backend services
 */
export const DEMO_CREDENTIALS = {
  email: 'demo@sadhanaboard.com',
  password: 'demo123456',
  displayName: 'Demo User',
};

/**
 * Check if the provided credentials match demo credentials
 */
export const isDemoLogin = (email: string, password: string): boolean => {
  return (
    email.toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase() &&
    password === DEMO_CREDENTIALS.password
  );
};

/**
 * Generate a demo JWT token
 * Note: This is a mock token for demonstration purposes only
 * In a real application, tokens should come from the backend
 */
export const generateDemoToken = (): string => {
  // Create a simple mock JWT token that follows the basic JWT structure
  // Header.Payload.Signature (though signature is not validated on client side)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: 'demo-user-001',
      email: DEMO_CREDENTIALS.email,
      display_name: DEMO_CREDENTIALS.displayName,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      iss: 'sadhanaboard-demo',
      mode: 'demo',
    })
  );
  const signature = btoa('demo-signature-not-validated');
  return `${header}.${payload}.${signature}`;
};

/**
 * Create a demo user object
 */
export const createDemoUser = (): DemoUser => {
  return {
    id: 'demo-user-001',
    email: DEMO_CREDENTIALS.email,
    display_name: DEMO_CREDENTIALS.displayName,
    token: generateDemoToken(),
  };
};

/**
 * Check if the current session is in demo mode
 */
export const isDemoMode = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Parse the JWT payload (second part)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload.mode === 'demo';
  } catch (error) {
    return false;
  }
};

/**
 * Get demo user info from token
 */
export const getDemoUserFromToken = (token: string): DemoUser | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    if (payload.mode !== 'demo') return null;
    
    return {
      id: payload.sub,
      email: payload.email,
      display_name: payload.display_name,
      token,
    };
  } catch (error) {
    return null;
  }
};
