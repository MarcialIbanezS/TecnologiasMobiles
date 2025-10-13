import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
<<<<<<< HEAD:Proyecto/appBakan/src/app/perfil-paciente/perfil-paciente.page.ts
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBreadcrumb, IonBreadcrumbs
  , IonItem, IonAvatar, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
IonGrid, IonRow, IonCol, IonImg, IonList, IonButton, IonSpinner, IonToast} 
from '@ionic/angular/standalone';
import {Router} from '@angular/router';
import {RouterModule} from '@angular/router';
import { PatientService, Patient } from '../Services/patient.service';
import { NavigationService, Breadcrumb } from '../Services/navigation.service';
=======
import { Router, RouterModule } from '@angular/router';
>>>>>>> firebase:Proyecto/appBakan/src/app/martin1/martin1.page.ts

import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonBreadcrumb, IonBreadcrumbs,
  IonItem, IonAvatar, IonLabel, IonCard, IonCardContent, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonGrid, IonRow, IonCol, IonList,
  IonButton, IonSpinner, IonToast
} from '@ionic/angular/standalone';

import { PatientService, Patient } from '../Services/patient.service';

@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.page.html',
  styleUrls: ['./perfil-paciente.page.scss'],
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
export class PerfilPacientePage implements OnInit {

  patient: Patient | null = null;
  isLoading = false;
<<<<<<< HEAD:Proyecto/appBakan/src/app/perfil-paciente/perfil-paciente.page.ts
  breadcrumbs: Breadcrumb[] = [];
  
=======

>>>>>>> firebase:Proyecto/appBakan/src/app/martin1/martin1.page.ts
  // Toast properties
  showToast = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' = 'danger';

  constructor(
    private router: Router,
    private patientService: PatientService,
    private navigationService: NavigationService
  ) {
    // Obtener datos del paciente desde el estado de navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['patient']) {
      this.patient = navigation.extras.state['patient'];
    } else {
      // Try to get from navigation service
      this.patient = this.navigationService.getSelectedPatient();
    }
  }

<<<<<<< HEAD:Proyecto/appBakan/src/app/perfil-paciente/perfil-paciente.page.ts
    irAHome() {
    this.router.navigate(['/login']);       
  }
  irAMartin0() {
    this.router.navigate(['/pagina2']);       
  }
  irAListadoPacientes() {
    this.navigationService.navigateWithBreadcrumb('/listadoPacientes');       
  }
  irAInicio() {
    this.navigationService.navigateWithBreadcrumb('/inicio');       
  }
  irAFichaMedica() {
    // Navigate to medical record with patient context
    if (this.patient) {
      this.navigationService.navigateWithBreadcrumb('/fichaMedica', this.patient);
    } else {
      this.router.navigate(['/fichaMedica']);
    }
  }


  ngOnInit() {
    // Build breadcrumbs for patient profile page
    this.breadcrumbs = [
      { label: 'Inicio', path: '/inicio' },
      { label: 'Pacientes', path: '/listadoPacientes' },
      { label: this.patient?.nombre || 'Paciente', path: '/perfilPaciente' }
    ];

    // If no patient data was passed via navigation, try to get it from storage or redirect
=======
  ngOnInit() {
>>>>>>> firebase:Proyecto/appBakan/src/app/martin1/martin1.page.ts
    if (!this.patient) {
      console.log('No patient data received');
      this.showError('No se encontraron datos del paciente');
    } else {
      this.loadPatientDetails();
    }
  }

<<<<<<< HEAD:Proyecto/appBakan/src/app/perfil-paciente/perfil-paciente.page.ts
  // Execute breadcrumb navigation
  onBreadcrumbClick(breadcrumb: Breadcrumb) {
    this.navigationService.executeBreadcrumbNavigation(breadcrumb);
  }

=======
  // 🔹 Cargar detalles del paciente
>>>>>>> firebase:Proyecto/appBakan/src/app/martin1/martin1.page.ts
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

<<<<<<< HEAD:Proyecto/appBakan/src/app/perfil-paciente/perfil-paciente.page.ts

=======
}
>>>>>>> firebase:Proyecto/appBakan/src/app/martin1/martin1.page.ts
