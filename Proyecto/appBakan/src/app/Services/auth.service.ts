import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';

  async login(email: string, password: string): Promise<boolean> {
    // 🔹 Aquí deberías hacer una petición HTTP a tu backend (ej: /api/login)
    // Por ahora, simulamos un login
    if (email === 'admin@demo.com' && password === '1234') {
      localStorage.setItem(this.TOKEN_KEY, 'fake-jwt-token');
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
