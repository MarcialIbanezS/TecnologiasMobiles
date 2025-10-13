# Mock Authentication System

This application has been updated to use a mock authentication system instead of Firebase Auth.

## How It Works

### Authentication Method
- **Username**: Any valid Doctor's RUT from the pre-configured list
- **Password**: Any password (authentication always succeeds for valid RUTs)

### Available Doctors

The following RUTs are available for testing:

| RUT | Doctor Name | Specialty |
|-----|-------------|-----------|
| 12345678-9 | Dr. Juan Pérez | Cardiología |
| 87654321-0 | Dra. María González | Pediatría |
| 11111111-1 | Dr. Carlos Silva | Neurología |
| 22222222-2 | Dra. Ana López | Ginecología |
| 33333333-3 | Dr. Pedro Morales | Traumatología |
| 44444444-4 | Dra. Isabel Ruiz | Dermatología |
| 55555555-5 | Dr. Roberto Díaz | Oftalmología |
| 66666666-6 | Dra. Carmen Torres | Psiquiatría |

## Usage

### Login Process
1. Enter any of the RUTs listed above as the username
2. Enter any password (e.g., "123", "password", etc.)
3. Click "Iniciar sesión"

### RUT Format Validation
- The system validates Chilean RUT format: XXXXXXXX-X
- Example: 12345678-9

### UI Features
- Click "Ver doctores disponibles" to see the list of available doctors
- The login form shows helpful placeholder text

## Technical Implementation

### AuthService Changes
- Removed all Firebase dependencies
- Implemented mock authentication with pre-configured doctors
- Added RUT format validation
- Maintains the same interface for backward compatibility

### User Interface Updates
- Login form now uses RUT instead of email
- Added button to show available doctors
- Updated validation messages and placeholders

### Data Storage
- User sessions are stored in localStorage
- Authentication state is managed with RxJS BehaviorSubject
- No external database dependencies

## Development Benefits

1. **No Firebase Setup Required**: Works immediately without Firebase configuration
2. **Predictable Testing**: Always uses the same set of test doctors
3. **Offline Development**: No internet connection required
4. **Quick Iteration**: Instant login without network delays

## Backward Compatibility

The AuthService maintains the same public methods:
- `login(username, password)`
- `logout()`
- `isAuthenticated()`
- `getCurrentUser()`
- `currentUser$` observable

This ensures that all existing components continue to work without modification.

## Future Considerations

If you need to switch back to Firebase or implement real authentication:

1. Update the AuthService to use your preferred authentication method
2. Update the login form if needed (email vs RUT)
3. The rest of the application will continue to work unchanged due to the consistent interface

## Error Handling

- Invalid RUT format shows validation error
- Unknown RUTs show "RUT no encontrado" error  
- Network simulation with 500ms delay for realistic UX
- All errors are displayed via toast notifications