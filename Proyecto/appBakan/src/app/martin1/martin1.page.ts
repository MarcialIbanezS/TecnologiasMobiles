import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonBreadcrumb, IonBreadcrumbs,
  IonItem, IonAvatar, IonLabel, IonCard, IonCardContent, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonGrid, IonRow, IonCol, IonList,
  IonButton, IonSpinner, IonToast
} from '@ionic/angular/standalone';

import { PatientService, Patient } from '../Services/patient.service';

@Component({
  selector: 'app-martin1',
  templateUrl: './martin1.page.html',
  styleUrls: ['./martin1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,    // ✅ Angular essentials first
    FormsModule,
    RouterModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonBreadcrumb,
    IonBreadcrumbs,
    IonItem,
    IonAvatar,
    IonLabel,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonButton,
    IonSpinner,
    IonToast
  ]
})
export class Martin1Page implements OnInit {

  patient: Patient | null = null;
  isLoading = false;

  // Toast properties
  showToast = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' = 'danger';

  constructor(
    private router: Router,
    private patientService: PatientService
  ) {
    // Obtener datos del paciente desde el estado de navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['patient']) {
      this.patient = navigation.extras.state['patient'];
    }
  }

  ngOnInit() {
    if (!this.patient) {
      console.log('No patient data received');
      this.showError('No se encontraron datos del paciente');
    } else {
      this.loadPatientDetails();
    }
  }

  // 🔹 Cargar detalles del paciente
  loadPatientDetails() {
    if (!this.patient?.idpaciente) return;

    this.isLoading = true;
    this.patientService.getPatientById(this.patient.idpaciente).subscribe({
      next: (patientDetail) => {
        this.isLoading = false;
        if (patientDetail) {
          this.patient = { ...this.patient, ...patientDetail };
          console.log('Patient details loaded:', this.patient);
        } else {
          this.showError('Error al cargar los detalles del paciente');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading patient details:', error);
        this.showError('Error de conexión al cargar los detalles del paciente');
      }
    });
  }

  // 🔹 Mostrar error
  showError(message: string) {
    this.toastMessage = message;
    this.toastColor = 'danger';
    this.showToast = true;
  }

  onToastDismiss() {
    this.showToast = false;
  }

  // 🔹 Navegación
  irAHome() { this.router.navigate(['/login']); }
  irAMartin0() { this.router.navigate(['/pagina2']); }
  irAMartin1() { this.router.navigate(['/martin1']); }
  irAMartin2() { this.router.navigate(['/martin2']); }
  irAMartin3() { this.router.navigate(['/martin3']); }
  irAMartin4() { this.router.navigate(['/martin4']); }
  irAMartin5() { this.router.navigate(['/martin5']); }
  irAMartin6() { this.router.navigate(['/martin6']); }

}
