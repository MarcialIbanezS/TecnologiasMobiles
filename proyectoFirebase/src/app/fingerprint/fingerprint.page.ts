import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc, onSnapshot } from '@angular/fire/firestore';
import { QRCodeComponent} from 'angularx-qrcode'


@Component({
  selector: 'app-fingerprint',
  templateUrl: './fingerprint.page.html',
  styleUrls: ['./fingerprint.page.scss'],
    standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSpinner, QRCodeComponent]
})

export class FingerprintPage {

  state: 'scanner' | 'qr' | 'waiting' = 'scanner';
  qrUrl = '';

  constructor(private router: Router) {}

  startFakeScan() {
    // Cambia al estado de QR
    this.state = 'qr';

    // Generar un QR falso o real, como lo estés manejando
    this.qrUrl = 'https://tu-url-firebase-o-lo-que-sea';

    // Aquí tú decides cuándo pasar a waiting.  
    // Si quieres que sea automático después de mostrar el QR:
    setTimeout(() => {
      this.moveToWaiting();
    }, 2000); // 2 segundos mostrando el QR, ajusta si quieres
  }

  moveToWaiting() {
    this.state = 'waiting';

    // Aquí hacemos la espera de 5 segundos antes de redirigir
    setTimeout(() => {
      this.goToDummyPage();
    }, 5000);
  }

  goToDummyPage() {
    this.router.navigate(['/ficha-dummy']);
  }
}