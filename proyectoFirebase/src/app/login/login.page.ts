import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonItem, IonLabel, IonInput, IonIcon,IonGrid,IonCol,IonRow, IonImg, IonToast, IonSpinner
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
//import { addIcons } from 'ionicons';
//import { medkitOutline,bandageOutline,flaskOutline,fitnessOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    CommonModule, FormsModule, IonButton, IonLabel, IonItem, IonInput, IonIcon,IonGrid,IonRow,IonCol,IonImg, IonToast, IonSpinner
  ]
})
export class LoginPage implements OnInit {

  rut: string = '';
  contrasena: string = '';
  isLoading: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'danger';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    //addIcons({ medkitOutline,bandageOutline,flaskOutline,fitnessOutline });
  }
  
  irAHome() {
    this.router.navigate(['/inicio']);       
  }
  
  irAInicio() {
    this.router.navigate(['/inicio']);       
  }
  
  login() {
    if (!this.rut || !this.contrasena) {
      this.showToastMessage('Por favor ingrese RUT y contraseña', 'warning');
      return;
    }

    // Basic RUT format validation
    if (!this.authService.validateRutFormat(this.rut)) {
      this.showToastMessage('Por favor ingrese un RUT válido (formato: 12345678-9)', 'warning');
      return;
    }

    this.isLoading = true;
    console.log('Attempting login with RUT:', this.rut);

    this.authService.login(this.rut, this.contrasena).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login response:', response);
        if (response.success && response.user) {
          this.showToastMessage(`Bienvenido ${response.user.name}`, 'success');
          setTimeout(() => {
            this.router.navigate(['/inicio']);
          }, 1000);
        } else {
          this.showToastMessage(
            response.error || 'Error de autenticación. Verifique sus credenciales.',
            'danger'
          );
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error details:', error);
        let errorMessage = error?.message || 'Error de autenticación. Intente nuevamente.';
        this.showToastMessage(errorMessage, 'danger');
      }
    });
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  onToastDismiss() {
    this.showToast = false;
  }

  // Show available doctors for user reference
  showAvailableDoctors() {
    const doctors = this.authService.getAvailableDoctors();
    const doctorList = doctors.map(d => `${d.rut} - ${d.name} (${d.specialty || 'General'})`).join('\n');
    this.showToastMessage(`Doctores disponibles:\n${doctorList}`, 'primary');
  }

  // Register method - not available in this mock implementation
  goToRegister() {
    this.showToastMessage('El registro no está disponible. Use un RUT de doctor existente.', 'warning');
  }

  // Method to check if user is already authenticated on page load
  ngOnInit() {
    // If user is already authenticated, redirect to inicio
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/inicio']);
    }
  }
}