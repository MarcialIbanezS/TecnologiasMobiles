# Firebase Configuration Troubleshooting Guide

## Error: auth/configuration-not-found

This error indicates that Firebase is not properly configured. Here are the steps to resolve it:

### 1. Fixed Configuration Issues

#### Environment Configuration
- ✅ Fixed missing comma in `environment.ts` Firebase config
- ✅ Added Firebase configuration to `environment.prod.ts`
- ✅ Removed unused imports from environment files

#### Firebase Initialization
- ✅ Added configuration validation in `main.ts`
- ✅ Added debugging logs for Firebase initialization
- ✅ Created Firebase config validator utility

### 2. Current Firebase Configuration

```typescript
// environment.ts & environment.prod.ts
export const environment = {
  production: false, // true for prod
  firebase: {
    apiKey: "AIzaSyBko6PFIC3QOZ3CXtsyN-4vrFJR2ooAeas",
    authDomain: "appmoviles-b5003.firebaseapp.com",
    projectId: "appmoviles-b5003",
    storageBucket: "appmoviles-b5003.firebasestorage.app",
    messagingSenderId: "264276022273",
    appId: "1:264276022373:web:66db567fd6ee7d225b628c",
    measurementId: "G-RXGREWNXX8"
  }
};
```

### 3. Debugging Steps Added

#### Main.ts Validation
```typescript
// Added Firebase config validation
if (!validateFirebaseConfig(environment.firebase)) {
  console.error('Firebase configuration validation failed');
} else {
  logFirebaseConfig(environment.firebase);
}
```

#### AuthService Debugging
```typescript
constructor(private auth: Auth, private firestore: Firestore) {
  console.log('AuthService constructor - Auth instance:', this.auth);
  console.log('AuthService constructor - Firestore instance:', this.firestore);
  
  if (!this.auth) {
    console.error('Firebase Auth is not properly initialized');
    return;
  }
}
```

### 4. Common Causes and Solutions

#### Problem 1: Malformed Configuration
- **Cause**: Missing commas, incorrect formatting in environment files
- **Solution**: ✅ Fixed formatting in environment.ts

#### Problem 2: Missing Production Config
- **Cause**: Firebase config missing from environment.prod.ts
- **Solution**: ✅ Added complete config to production environment

#### Problem 3: Network/Project Issues
- **Potential Cause**: Firebase project not properly set up
- **Check**: Verify project exists in Firebase Console

#### Problem 4: Dependencies Issues
- **Check**: Ensure proper versions are installed
```json
{
  "@angular/fire": "^20.0.1",
  "firebase": "^11.10.0"
}
```

### 5. Testing Steps

1. **Clear Browser Cache and Storage**
   ```
   - Clear all site data for localhost
   - Clear browser cache
   - Close all browser tabs
   ```

2. **Check Console Logs**
   Look for these debug messages:
   ```
   - "Firebase Configuration:"
   - "Initializing Firebase with config:"
   - "Firebase Auth initialized"
   - "Firestore initialized"
   ```

3. **Test Firebase Connection**
   Try logging in and check console for:
   ```
   - "AuthService constructor - Auth instance:"
   - "AuthService login attempt for:"
   - Any Firebase error codes
   ```

### 6. Additional Troubleshooting

#### If Error Persists:

1. **Verify Firebase Project Setup**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Verify project "appmoviles-b5003" exists and is active
   - Check if Authentication is enabled
   - Verify Firestore is set up

2. **Check Network Connectivity**
   - Ensure you can access firebase.google.com
   - Check if corporate firewall blocks Firebase

3. **Restart Development Server**
   ```bash
   # Stop current server
   Ctrl+C
   
   # Clear node modules (if needed)
   npm ci
   
   # Restart
   ionic serve
   ```

4. **Check Browser Network Tab**
   - Look for failed requests to Firebase APIs
   - Check for CORS errors
   - Verify API calls are reaching Firebase

### 7. Emergency Fallback

If Firebase continues to fail, you can temporarily:

1. **Add Error Handling in AuthService**
   ```typescript
   if (!this.auth) {
     console.error('Firebase not available, using mock auth');
     // Return mock successful login for development
   }
   ```

2. **Check Firebase Status**
   - Visit [Firebase Status](https://status.firebase.google.com/)
   - Check for ongoing outages

### 8. Final Validation

After implementing these fixes:

1. ✅ Configuration validated and formatted correctly
2. ✅ Production environment updated
3. ✅ Debugging added to track initialization
4. ✅ Error handling improved
5. ✅ Validation utility created

The application should now properly initialize Firebase and provide clear error messages if issues persist.