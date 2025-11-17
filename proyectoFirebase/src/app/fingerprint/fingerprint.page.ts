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

    this.state = 'qr';

    
    this.qrUrl = 'https://tu-url-firebase-o-lo-que-sea';

    setTimeout(() => {
      this.moveToWaiting();
    }, 2000); 
  }

  moveToWaiting() {
    this.state = 'waiting';


    setTimeout(() => {
      this.goToDummyPage();
    }, 5000);
  }

  goToDummyPage() {
    this.router.navigate(['/ficha-dummy']);
  }
}