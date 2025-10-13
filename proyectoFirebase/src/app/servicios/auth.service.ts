import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';

export interface User {
  id: string;
  rut: string;
  name: string;
  specialty?: string;
  createdAt: Date;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'medical_app_user';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  // Mock doctors database with their RUTs
  private readonly mockDoctors: { [rut: string]: Omit<User, 'id' | 'createdAt'> } = {
    '12345678-9': { rut: '12345678-9', name: 'Dr. Juan Pérez', specialty: 'Cardiología' },
    '87654321-0': { rut: '87654321-0', name: 'Dra. María González', specialty: 'Pediatría' },
    '11111111-1': { rut: '11111111-1', name: 'Dr. Carlos Silva', specialty: 'Neurología' },
    '22222222-2': { rut: '22222222-2', name: 'Dra. Ana López', specialty: 'Ginecología' },
    '33333333-3': { rut: '33333333-3', name: 'Dr. Pedro Morales', specialty: 'Traumatología' },
    '44444444-4': { rut: '44444444-4', name: 'Dra. Isabel Ruiz', specialty: 'Dermatología' },
    '55555555-5': { rut: '55555555-5', name: 'Dr. Roberto Díaz', specialty: 'Oftalmología' },
    '66666666-6': { rut: '66666666-6', name: 'Dra. Carmen Torres', specialty: 'Psiquiatría' }
  };

  constructor() {
    console.log('AuthService initialized with mock authentication');
    console.log('Available doctors:', Object.keys(this.mockDoctors));
  }

  login(username: string, password: string): Observable<LoginResponse> {
    console.log('Mock login attempt for RUT:', username);
    
    // Simulate network delay
    return of(null).pipe(
      delay(500),
      map(() => {
        // Check if the RUT exists in our mock doctors database
        const doctorData = this.mockDoctors[username];
        
        if (doctorData) {
          // Any password is accepted for valid RUTs
          const user: User = {
            id: username, // Use RUT as ID
            rut: username,
            name: doctorData.name,
            specialty: doctorData.specialty,
            createdAt: new Date()
          };

          // Store user in localStorage and update subject
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);

          console.log('Login successful for:', user.name);
          return { success: true, user };
        } else {
          console.log('Login failed: RUT not found in doctors database');
          return { 
            success: false, 
            user: null as any, 
            error: 'RUT no encontrado en la base de datos de doctores' 
          };
        }
      })
    );
  }

  logout(): Observable<void> {
    return of(null).pipe(
      delay(200),
      map(() => {
        this.currentUserSubject.next(null);
        localStorage.removeItem(this.USER_KEY);
        console.log('User logged out successfully');
      })
    );
  }

  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return user !== null;
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Validate that the user still exists in our mock database
        if (this.mockDoctors[user.rut]) {
          return user;
        } else {
          // Clean up invalid user
          localStorage.removeItem(this.USER_KEY);
          this.currentUserSubject.next(null);
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem(this.USER_KEY);
      }
    }
    return null;
  }

  // Method to get available doctors (for UI purposes)
  getAvailableDoctors(): { rut: string; name: string; specialty?: string }[] {
    return Object.entries(this.mockDoctors).map(([rut, doctor]) => ({
      rut,
      name: doctor.name,
      specialty: doctor.specialty
    }));
  }

  // Method to validate RUT format (Chilean RUT validation)
  validateRutFormat(rut: string): boolean {
    // Basic Chilean RUT format validation: XXXXXXXX-X
    const rutPattern = /^[0-9]+-[0-9kK]$/;
    return rutPattern.test(rut);
  }

  // Legacy method for backward compatibility (returns the same as getCurrentUser)
  getCurrentFirebaseUser(): User | null {
    return this.getCurrentUser();
  }

  // Legacy method for backward compatibility
  register(rut: string, password: string, name: string, specialty?: string): Observable<LoginResponse> {
    // For this mock implementation, registration is not supported
    // All doctors are pre-configured
    return of({ 
      success: false, 
      user: null as any, 
      error: 'El registro no está disponible. Use un RUT de doctor existente.' 
    });
  }
}
