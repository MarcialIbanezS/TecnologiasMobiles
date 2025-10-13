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
import { NavigationService, Breadcrumb } from '../servicios/navigation.service';


@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.page.html',
  styleUrls: ['./perfil-paciente.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, 
     RouterModule, IonBreadcrumb, IonBreadcrumbs, IonItem, IonAvatar, IonLabel,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonGrid, IonRow, IonCol
  , IonList, IonButton, IonSpinner, IonToast]
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
    private patientService: PatientService,
    private navigationService: NavigationService
  ) {
    // Get patient data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['patient']) {
      this.patient = this.normalizePatientData(navigation.extras.state['patient']);
    } else {
      // Try to get from navigation service
      const selectedPatient = this.navigationService.getSelectedPatient();
      this.patient = selectedPatient ? this.normalizePatientData(selectedPatient) : null;
    }
  }

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
    if (!this.patient) {
      // Could implement a fallback mechanism here if needed
      console.log('No patient data received');
      this.showError('No se encontraron datos del paciente');
    } else {
      this.loadPatientDetails();
    }
  }

  // Execute breadcrumb navigation
  onBreadcrumbClick(breadcrumb: Breadcrumb) {
    this.navigationService.executeBreadcrumbNavigation(breadcrumb);
  }

  loadPatientDetails() {
    if (!this.patient?.id) {
      console.log('No patient ID available');
      return;
    }

    // If we already have complete patient data, no need to fetch again
    if (this.patient.rut && this.patient.direccion) {
      console.log('Patient data already complete');
      return;
    }
    
    this.isLoading = true;
    this.patientService.getPatientById(this.patient.id).subscribe({
      next: (patientData) => {
        this.isLoading = false;
        if (patientData) {
          // Update patient with detailed data from Firebase
          this.patient = patientData;
          console.log('Patient details loaded:', this.patient);
        } else {
          this.showError('No se encontraron detalles del paciente');
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

  // Helper method to normalize patient data between old and new formats
  private normalizePatientData(patientData: any): Patient | null {
    if (!patientData) return null;

    // Handle both old (idpaciente) and new (id) formats
    return {
      id: patientData.id || patientData.idpaciente || '',
      clientId: patientData.clientId || '',
      nombre: patientData.nombre || patientData.nombrePaciente || '',
      apellidopaterno: patientData.apellidopaterno || '',
      apellidomaterno: patientData.apellidomaterno || '',
      rut: patientData.rut || '',
      genero: patientData.genero || patientData.sexo || '',
      fechanacimiento: patientData.fechanacimiento || patientData.fechaNacimiento || new Date(),
      direccion: patientData.direccion || '',
      telefono: patientData.telefono || '',
      email: patientData.email || '',
      userId: patientData.userId || '',
      createdAt: patientData.createdAt,
      updatedAt: patientData.updatedAt
    };
  }

}


