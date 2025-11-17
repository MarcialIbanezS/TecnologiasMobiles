import { Component } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonButton, IonInput, IonContent, IonTitle, IonToolbar, IonHeader } from '@ionic/angular/standalone';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, IonButton, IonInput, IonContent, IonTitle, IonToolbar, IonHeader]})
  
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
  next: () => {
    this.router.navigate(['/inicio']); 
  },
  error: (err) => {
    console.error(err);
    alert("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
  }
});

}}
