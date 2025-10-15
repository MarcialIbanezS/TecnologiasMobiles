import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBreadcrumb, IonBreadcrumbs
  , IonItem, IonAvatar, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
IonGrid, IonRow, IonCol, IonImg, IonList, IonButton, IonSpinner, IonToast} 
from '@ionic/angular/standalone';
import {Router} from '@angular/router';
import {RouterModule} from '@angular/router';
import { PatientService, Patient } from '../servicios/patient.service';

// Simple breadcrumb interface
interface Breadcrumb {
  label: string;
  path: string;
}


@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.page.html',
  styleUrls: ['./perfil-paciente.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, 
     RouterModule, IonBreadcrumb, IonBreadcrumbs, IonItem, IonAvatar, IonLabel,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonGrid, IonRow, IonCol
  , IonImg, IonList, IonButton, IonSpinner, IonToast]
})
export class PerfilPacientePage implements OnInit {

  patient: Patient | null = null;
  isLoading = false;
  breadcrumbs: Breadcrumb[] = [];
  
  // Toast properties
  showToast = false;
  toastMessage = '';
  toastColor = 'danger';

  constructor(
    private router: Router,
    private patientService: PatientService
  ) {
    // Get patient data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['patient']) {
      this.patient = navigation.extras.state['patient'];
    }
  }

    irAHome() {
    this.router.navigate(['/inicio']);    
  }   

  irAListadoPacientes() {
    this.router.navigate(['/listadoPacientes']);       
  }
  irAInicio() {
    this.router.navigate(['/inicio']);       
  }
  irAFichaMedica() {
    // Navigate to medical record with patient context
    if (this.patient) {
      this.router.navigate(['/ficha-medica'], { 
        state: { patient: this.patient } 
      });
    } else {
      this.router.navigate(['/ficha-medica']);
    }
  }


  ngOnInit() {
    // Build breadcrumbs for patient profile page
    this.breadcrumbs = [
      { label: 'Inicio', path: '/inicio' },
      { label: 'Pacientes', path: '/listadoPacientes' },
      { label: this.patient?.nombrePaciente || 'Paciente', path: '/perfilPaciente' }
    ];

    // If no patient data was passed via navigation, try to get it from storage or redirect
    if (!this.patient) {
      console.log('No patient data received');
      this.showError('No se encontraron datos del paciente');
      // Redirect back to patient list after a delay
      setTimeout(() => {
        this.router.navigate(['/listadoPacientes']);
      }, 2000);
    } else {
      this.loadPatientDetails();
    }
  }

  // Execute breadcrumb navigation
  onBreadcrumbClick(breadcrumb: Breadcrumb) {
    // Don't navigate if clicking on current page
    if (breadcrumb.path === '/perfilPaciente') {
      return;
    }
    
    // For patients breadcrumb, pass any patient context that might be needed
    if (breadcrumb.path === '/listadoPacientes') {
      this.router.navigate([breadcrumb.path]);
    } else {
      this.router.navigate([breadcrumb.path]);
    }
  }

  loadPatientDetails() {
    if (!this.patient?.idpaciente) return;
    
    this.isLoading = true;
    this.patientService.getPatientById(this.patient.idpaciente).subscribe({
      next: (patientData) => {
        this.isLoading = false;
        if (patientData) {
          // Update patient data with details from Firestore
          this.patient = patientData;
          console.log('Patient details loaded:', this.patient);
        } else {
          this.showError('No se encontraron datos del paciente');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading patient details:', error);
        this.showError('Error de conexión al cargar los detalles del paciente');
      }
    });
  }

  showError(message: string) {
    this.toastMessage = message;
    this.toastColor = 'danger';
    this.showToast = true;
  }

  onToastDismiss() {
    this.showToast = false;
  }

}


