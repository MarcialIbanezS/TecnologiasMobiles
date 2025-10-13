// Firebase configuration validation utility
export function validateFirebaseConfig(config: any): boolean {
  const requiredFields = [
    'apiKey',
    'authDomain', 
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  if (!config) {
    console.error('Firebase configuration is undefined or null');
    return false;
  }

  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    console.error('Firebase configuration is missing required fields:', missingFields);
    return false;
  }

  console.log('Firebase configuration is valid');
  return true;
}

// Log Firebase configuration (without sensitive data)
export function logFirebaseConfig(config: any): void {
  if (!config) {
    console.error('No Firebase configuration to log');
    return;
  }

  console.log('Firebase Configuration:');
  console.log('- Project ID:', config.projectId);
  console.log('- Auth Domain:', config.authDomain);
  console.log('- Storage Bucket:', config.storageBucket);
  console.log('- App ID:', config.appId);
  console.log('- API Key present:', !!config.apiKey);
  console.log('- Messaging Sender ID:', config.messagingSenderId);
  
  if (config.measurementId) {
    console.log('- Analytics Measurement ID:', config.measurementId);
  }
}