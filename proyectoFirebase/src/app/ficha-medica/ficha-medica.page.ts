import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonButton, IonSpinner, IonList, IonItem, IonLabel, IonChip, IonIcon, IonNote } from '@ionic/angular/standalone';
import {IonBreadcrumb, IonBreadcrumbs} from  '@ionic/angular/standalone';
import {Router} from '@angular/router';
import {RouterModule} from '@angular/router';
import { MedicalRecordService, DetailedMedicalRecord, MedicalRecord } from '../servicios/medical-record.service';
import { NavigationService } from '../servicios/navigation.service';
import { addIcons } from 'ionicons';
import { downloadOutline, refreshOutline, personCircleOutline, calendarOutline, medicalOutline, checkmarkCircleOutline } from 'ionicons/icons';

// Simple breadcrumb interface
interface Breadcrumb {
  label: string;
  path: string;
}


@Component({
  selector: 'app-ficha-medica',
  templateUrl: './ficha-medica.page.html',
  styleUrls: ['./ficha-medica.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonBreadcrumb, IonBreadcrumbs, RouterModule, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonButton, IonSpinner, IonList, IonItem, IonLabel, IonChip, IonIcon, IonNote
  ]
})
export class FichaMedicaPage implements OnInit {
  breadcrumbs: Breadcrumb[] = [];
  selectedPatient: any = null;
  medicalRecords: MedicalRecord[] = [];
  selectedMedicalRecord: DetailedMedicalRecord | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  
  constructor(
    private router: Router,
    private medicalRecordService: MedicalRecordService,
    private navigationService: NavigationService
  ) { 
    // Add icons
    addIcons({ downloadOutline, refreshOutline, personCircleOutline, calendarOutline, medicalOutline, checkmarkCircleOutline });
    
    // Try to get patient data in this order:
    // 1. Current navigation state
    // 2. Browser history state
    // 3. NavigationService stored state
    const navigation = this.router.getCurrentNavigation();
    const navState = navigation?.extras?.state;
    const historyState = window.history.state;
    
    // Try to get patient from various sources
    const patient = navState?.['patient'] || // From current navigation
                   historyState?.['patient'] || // From history state
                   navState?.['navigationState']?.['selectedPatient'] || // From navigation state
                   historyState?.['navigationState']?.['selectedPatient'] || // From history navigation state
                   this.navigationService.getSelectedPatient(); // From service as last resort
    
    if (patient) {
      this.selectedPatient = patient;
      console.log('Patient data loaded:', this.selectedPatient);
      
      // Update navigation service if needed
      if (!this.navigationService.getSelectedPatient()) {
        this.navigationService.setSelectedPatient(patient, 'fichaMedica');
      }
    } else {
      console.warn('No patient data found in any source');
      this.error = 'No se ha seleccionado un paciente';
      
      // Redirect to patient list with message
      this.router.navigate(['/listadoPacientes'], { 
        state: { 
          message: 'Por favor, seleccione un paciente para ver su ficha médica',
          returnPath: '/fichaMedica'
        }
      });
    }
  }
 irAInicio() {
    this.router.navigate(['/inicio']);       
  }
  irAListadoPacientes() {
    this.router.navigate(['/listadoPacientes']);       
  }
  irAPerfilPaciente() {
    if (this.selectedPatient) {
      this.router.navigate(['/perfilPaciente'], { 
        state: { patient: this.selectedPatient } 
      });
    }       
  }

  ngOnInit() {
    // Set up breadcrumbs
    this.breadcrumbs = this.navigationService.getMedicalRecordBreadcrumbs(this.selectedPatient) || [
      { label: 'Inicio', path: '/inicio' },
      { label: 'Pacientes', path: '/listadoPacientes' },
      { 
        label: this.selectedPatient?.nombre || 
               this.selectedPatient?.nombrePaciente || 
               'Paciente', 
        path: '/perfilPaciente',
        params: { patient: this.selectedPatient }
      },
      { 
        label: 'Ficha Médica', 
        path: '/fichaMedica',
        params: { patient: this.selectedPatient }
      }
    ];
    
    // Load medical records if patient is selected
    if (this.selectedPatient && !this.error) {
      console.log('Loading medical records for patient:', this.selectedPatient);
      this.loadMedicalRecords();
    } else if (!this.error) {
      this.error = 'No se ha seleccionado un paciente';
    }
  }

  // Execute breadcrumb navigation
  onBreadcrumbClick(breadcrumb: Breadcrumb) {
    // Don't navigate if clicking on current page (accept both path styles)
    if (breadcrumb.path === '/fichaMedica' || breadcrumb.path === '/ficha-medica') {
      return;
    }
    
    if (breadcrumb.path === '/perfilPaciente' && this.selectedPatient) {
      this.router.navigate([breadcrumb.path], { 
        state: { patient: this.selectedPatient } 
      });
    } else {
      this.router.navigate([breadcrumb.path]);
    }
  }

  // Load medical records for the selected patient
  loadMedicalRecords() {
    if (!this.selectedPatient) {
      this.error = 'No se ha seleccionado un paciente';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.medicalRecords = [];
    this.selectedMedicalRecord = null;

    // Extraer el ID del paciente, considerando diferentes posibles propiedades
    const patientId = this.selectedPatient.idpaciente || 
                     this.selectedPatient.id ||
                     this.selectedPatient.uid;
    
    console.log('Datos del paciente:', {
      selectedPatient: this.selectedPatient,
      extractedId: patientId,
      availableProperties: Object.keys(this.selectedPatient)
    });
    
    if (!patientId) {
      this.error = 'ID de paciente no válido';
      this.isLoading = false;
      return;
    }

    console.log('Cargando fichas médicas para paciente:', {
      patientId,
      selectedPatient: this.selectedPatient
    });
    
    this.medicalRecordService.getMedicalRecordsByPatient(patientId).subscribe({
      next: (medicalRecords) => {
        this.isLoading = false;
        this.medicalRecords = medicalRecords;
        
        console.log('Fichas médicas obtenidas:', {
          patientId,
          records: this.medicalRecords,
          query: `where('idpaciente', '==', '${patientId}')`
        });
        
        // If there are records, load details for the first one
        if (this.medicalRecords.length > 0) {
          this.loadMedicalRecordDetails(this.medicalRecords[0].idfichamedica);
        } else {
          this.error = 'No se encontraron fichas médicas para este paciente';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Error al cargar las fichas médicas: ' + (error.message || error);
        console.error('Error loading medical records:', error);
      }
    });
  }

  // Load detailed medical record information
  async loadMedicalRecordDetails(recordId: string) {
    if (!recordId) {
      this.error = 'ID de ficha médica no válido';
      return;
    }

    this.isLoading = true;
    this.error = null;
    
    try {
      console.log('Cargando detalles de ficha médica:', recordId);
      const detailedRecord = await this.medicalRecordService.getMedicalRecordDetails(recordId);
      
      this.isLoading = false;
      
      if (detailedRecord) {
        this.selectedMedicalRecord = detailedRecord;
        this.medicalRecordService.setSelectedMedicalRecord(detailedRecord);
        console.log('Detalles de ficha médica cargados:', this.selectedMedicalRecord);
      } else {
        this.error = 'No se encontraron detalles para esta ficha médica';
      }
    } catch (error: any) {
      this.isLoading = false;
      this.error = 'Error al cargar detalles de la ficha médica: ' + (error.message || error);
      console.error('Error loading medical record details:', error);
    }
  }

  // Refresh medical records
  refreshMedicalRecords() {
    this.loadMedicalRecords();
  }

  // Download medical record (placeholder function)
  downloadMedicalRecord() {
    if (this.selectedMedicalRecord) {
      // For now, we'll create a simple text summary
      const summary = this.medicalRecordService.generateMedicalRecordSummary(this.selectedMedicalRecord);
      
      // Create and download a text file
      const blob = new Blob([summary], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ficha-medica-${this.selectedMedicalRecord?.nombrePaciente || 'paciente'}.txt`;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }

  // Format date for display
  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '';
    return this.medicalRecordService.formatDate(dateString);
  }

  // Calculate age
  calculateAge(birthDate: string | null | undefined): number {
    if (!birthDate) return 0;
    return this.medicalRecordService.calculateAge(birthDate);
  }

}





