import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent,
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonSpinner,
  IonLabel, IonIcon, IonChip, IonCol, IonRow, IonGrid,
  IonSegment, IonSegmentButton, IonButtons
} from '@ionic/angular/standalone';

import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

import { addIcons } from 'ionicons';
import {
  downloadOutline,
  refreshOutline,
  personCircleOutline,
  warningOutline,
  bandageOutline,
  medkitOutline,
  locationOutline,
  briefcaseOutline,
  medicalOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-ficha-medica',
  standalone: true,
  templateUrl: './ficha-dummy.page.html',
  styleUrls: ['./ficha-dummy.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonBreadcrumb, IonBreadcrumbs,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonButton, IonSpinner, IonChip, IonLabel, IonIcon,
    IonCol, IonRow, IonGrid,
    IonSegment, IonSegmentButton, IonButtons,
    RouterModule
  ]
})
export class FichaDummyPage implements OnInit {

  // ⭐ Breadcrumbs dummy
  breadcrumbs = [
    { label: 'Inicio', path: '/inicio', active: false },
    { label: 'Paciente Dummy', path: '/paciente', active: false },
    { label: 'Ficha Médica', path: '/ficha-medica', active: true }
  ];

  // ⭐ Dummy segment (fichas)
  medicalRecords = [
    { id: 1, fecha: '01-01-2024' },
    { id: 2, fecha: '15-03-2024' }
  ];

  // ⭐ Dummy registro seleccionado
  selectedMedicalRecord: any = {
    nombrePaciente: 'Juan Pérez Dummy',
    rut: '11.111.111-1',
    direccion: 'Calle Falsa 123',
    fechaingreso: '01-01-2024',
    tipoServicio: 'Kinesiología Dummy',
    nombreProfesional: 'Dra. Dummy Tester',
    idalergia: 'Alergia Dummy',
    idcronico: 'Condición Crónica Dummy',
    idoperacion: 'Operación Dummy'
  };

  isLoading = false;
  error: string | null = null;

  constructor() {
    addIcons({
      downloadOutline,
      refreshOutline,
      personCircleOutline,
      warningOutline,
      bandageOutline,
      medkitOutline,
      locationOutline,
      briefcaseOutline,
      medicalOutline
    });
  }

  ngOnInit() {}

  // ⭐ Breadcrumbs dummy funcionales
  onBreadcrumbClick(breadcrumb: any) {
    this.breadcrumbs.forEach(b => b.active = false);
    breadcrumb.active = true;
    console.log('Breadcrumb seleccionado (dummy):', breadcrumb.label);
  }

  // ⭐ Métodos dummy usados por el HTML
  goToProfile() { console.log('Perfil dummy'); }
  downloadMedicalRecord() { console.log('Descargar dummy'); }
  refreshMedicalRecords() { console.log('Refresh dummy'); }
  loadMedicalRecordDetails(id: string) { console.log('Cambiar ficha dummy', id); }
  formatDate(dateString: string) { return dateString; }

}
