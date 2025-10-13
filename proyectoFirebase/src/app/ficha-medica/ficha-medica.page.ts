import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
   IonCardTitle, IonButton, IonSpinner, IonList, IonItem, IonLabel, IonChip, IonIcon } from '@ionic/angular/standalone';
import {IonBreadcrumb, IonBreadcrumbs} from  '@ionic/angular/standalone';
import {Router} from '@angular/router';
import {RouterModule} from '@angular/router';
import { NavigationService, Breadcrumb } from '../servicios/navigation.service';
import { MedicalRecordService, DetailedMedicalRecord, MedicalRecord } from '../servicios/medical-record.service';
import { AuthService } from '../servicios/auth.service';
import { addIcons } from 'ionicons';
import { downloadOutline, refreshOutline, personCircleOutline, calendarOutline, medicalOutline, checkmarkCircleOutline } from 'ionicons/icons';


@Component({
  selector: 'app-ficha-medica',
  templateUrl: './ficha-medica.page.html',
  styleUrls: ['./ficha-medica.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonBreadcrumb, IonBreadcrumbs, RouterModule, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonButton, IonSpinner, IonList, IonItem, IonLabel, IonChip, IonIcon
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
    private navigationService: NavigationService,
    private medicalRecordService: MedicalRecordService,
    private authService: AuthService
  ) { 
    // Add icons
    addIcons({ downloadOutline, refreshOutline, personCircleOutline, calendarOutline, medicalOutline, checkmarkCircleOutline });
    
    // Get patient from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['patient']) {
      this.selectedPatient = this.normalizePatientData(navigation.extras.state['patient']);
    } else {
      // Try to get from navigation service
      const navPatient = this.navigationService.getSelectedPatient();
      this.selectedPatient = navPatient ? this.normalizePatientData(navPatient) : null;
    }
  }
 irAInicio() {
    this.navigationService.navigateWithBreadcrumb('/inicio');       
  }
  irAListadoPacientes() {
    this.navigationService.navigateWithBreadcrumb('/listadoPacientes');       
  }
  irAPerfilPaciente() {
    if (this.selectedPatient) {
      this.navigationService.navigateWithBreadcrumb('/perfilPaciente', this.selectedPatient);
    }       
  }

  ngOnInit() {
    // Check authentication
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Build breadcrumbs for medical record page
    this.breadcrumbs = this.navigationService.getMedicalRecordBreadcrumbs(this.selectedPatient);
    
    // Load medical records if patient is selected
    if (this.selectedPatient) {
      this.loadMedicalRecords();
    } else {
      this.error = 'No se ha seleccionado ningún paciente';
    }
  }

  // Execute breadcrumb navigation
  onBreadcrumbClick(breadcrumb: Breadcrumb) {
    this.navigationService.executeBreadcrumbNavigation(breadcrumb);
  }

  // Load medical records for the selected patient
  loadMedicalRecords() {
    if (!this.selectedPatient) return;

    this.isLoading = true;
    this.error = null;

    // Handle both old and new patient object formats
    const patientId = this.selectedPatient.id || this.selectedPatient.idpaciente;
    
    if (!patientId) {
      this.error = 'ID de paciente no válido';
      this.isLoading = false;
      return;
    }
    
    this.medicalRecordService.getMedicalRecordsByPatient(patientId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && Array.isArray(response.data)) {
          this.medicalRecords = response.data;
          
          // If there are records, load details for the first one
          if (this.medicalRecords.length > 0) {
            this.loadMedicalRecordDetails(this.medicalRecords[0].id);
          }
        } else {
          this.error = response.message || 'No se encontraron fichas médicas para este paciente';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Error al cargar las fichas médicas: ' + (error.error?.message || error.message);
        console.error('Error loading medical records:', error);
      }
    });
  }

  // Load detailed medical record information
  loadMedicalRecordDetails(recordId: string) {
    this.isLoading = true;
    
    this.medicalRecordService.getMedicalRecordDetails(recordId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.selectedMedicalRecord = response.data;
          this.medicalRecordService.setSelectedMedicalRecord(response.data);
        } else {
          this.error = response.message || 'No se encontraron detalles de la ficha médica';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Error al cargar detalles de la ficha médica: ' + (error.error?.message || error.message);
        console.error('Error loading medical record details:', error);
      }
    });
  }

  // Refresh medical records
  refreshMedicalRecords() {
    this.loadMedicalRecords();
  }

  // Select a specific medical record
  selectMedicalRecord(record: MedicalRecord) {
    this.loadMedicalRecordDetails(record.id);
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
      link.download = `ficha-medica-${this.selectedMedicalRecord?.patientName || 'paciente'}.txt`;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }

  // Format date for display
  formatDate(date: Date | string | null | undefined): string {
    if (!date) return '';
    return this.medicalRecordService.formatDate(date);
  }

  // Calculate age
  calculateAge(birthDate: Date | string | null | undefined): number {
    if (!birthDate) return 0;
    return this.medicalRecordService.calculateAge(birthDate);
  }

  // Helper method to normalize patient data between old and new formats
  private normalizePatientData(patientData: any): any {
    if (!patientData) return null;

    return {
      ...patientData,
      id: patientData.id || patientData.idpaciente,
      idpaciente: patientData.idpaciente || patientData.id, // Keep both for backward compatibility
      nombre: patientData.nombre || patientData.nombrePaciente || '',
      nombrePaciente: patientData.nombrePaciente || patientData.nombre || '' // Keep both for backward compatibility
    };
  }

}





