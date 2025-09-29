import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonItem, IonLabel, IonInput, IonIcon,IonGrid,IonCol,IonRow, IonImg, IonToast, IonSpinner
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
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
export class LoginPage {

  correo: string = '';
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
    this.router.navigate(['/home']);       
  }
  
  irAMartin3() {
    this.router.navigate(['/martin3']);       
  }
  
  login() {
    if (!this.correo || !this.contrasena) {
      this.showToastMessage('Por favor ingrese usuario y contraseña', 'warning');
      return;
    }

    this.isLoading = true;
    console.log('Attempting login with:', this.correo);
    console.log('API URL:', this.authService.backendUrl);

    this.authService.login(this.correo, this.contrasena).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login response:', response);
        if (response.success) {
          this.showToastMessage(`Bienvenido ${response.user.name}`, 'success');
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error details:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error error:', error.error);
        this.showToastMessage(
          error.error?.error || 'Error de conexión. Verifique sus credenciales.',
          'danger'
        );
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
}