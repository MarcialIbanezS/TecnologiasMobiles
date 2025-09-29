import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonList, IonItem, IonInput, IonButton, IonText,IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';
import { Router } from '@angular/router'; // opcional: solo para navegar de demo

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    ReactiveFormsModule, NgIf,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonList, IonItem, IonInput, IonButton, IonText,IonCard, IonCardHeader, IonCardTitle, IonCardContent
  ],
})
export class LoginPage {
  form = this.fb.group({
    user: ['', Validators.required],
    pass: ['', Validators.required],
  });
  error = ''; // solo para mostrar mensajes en la UI

  constructor(private fb: FormBuilder, private router: Router) {}

  submit() {
    if (this.form.invalid) return;
    // 👇 Solo demo de navegación. No hay login real.
    this.router.navigate(['/matias2']);
    // Si quieres que NO navegue (solo vista), comenta la línea de arriba.
  }
}
