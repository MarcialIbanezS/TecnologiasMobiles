import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonItem, IonLabel, IonInput, IonIcon,IonGrid,IonCol,IonRow, IonImg
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
//import { addIcons } from 'ionicons';
//import { medkitOutline,bandageOutline,flaskOutline,fitnessOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    CommonModule, FormsModule, IonButton, IonLabel, IonItem, IonInput, IonIcon,IonGrid,IonRow,IonCol,IonImg
  ]
})
export class LoginPage {

  correo: string = '';
  contrasena: string = '';

  constructor(private router: Router) {
    //addIcons({ medkitOutline,bandageOutline,flaskOutline,fitnessOutline });
  }
  
  irAHome() {
    this.router.navigate(['/home']);       
  }
  login() {
    console.log('Correo:', this.correo);
    console.log('Contraseña:', this.contrasena);
    
  }
  
}