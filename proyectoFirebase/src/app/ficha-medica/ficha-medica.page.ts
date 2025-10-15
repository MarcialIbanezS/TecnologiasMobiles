import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
   IonCardTitle, IonButton, IonSpinner, IonList, IonItem, IonLabel, IonChip, IonIcon } from '@ionic/angular/standalone';
import {IonBreadcrumb, IonBreadcrumbs} from  '@ionic/angular/standalone';
import {Router} from '@angular/router';
import {RouterModule} from '@angular/router';
import { MedicalRecordService, DetailedMedicalRecord, MedicalRecord } from '../servicios/medical-record.service';
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
    private medicalRecordService: MedicalRecordService
  ) { 
    // Add icons
    addIcons({ downloadOutline, refreshOutline, personCircleOutline, calendarOutline, medicalOutline, checkmarkCircleOutline });
    
    // Get patient from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['patient']) {
      this.selectedPatient = navigation.extras.state['patient'];
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
    // Build breadcrumbs for medical record page
    this.breadcrumbs = [
      { label: 'Inicio', path: '/inicio' },
      { label: 'Pacientes', path: '/listadoPacientes' },
      { label: this.selectedPatient?.nombrePaciente || 'Paciente', path: '/perfilPaciente' },
      { label: 'Ficha Médica', path: '/ficha-medica' }
    ];
    
    // Load medical records if patient is selected
    if (this.selectedPatient) {
      this.loadMedicalRecords();
    } else {
      this.error = 'No se ha seleccionado un paciente';
    }
  }

  // Execute breadcrumb navigation
  onBreadcrumbClick(breadcrumb: Breadcrumb) {
    // Don't navigate if clicking on current page
    if (breadcrumb.path === '/ficha-medica') {
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
    if (!this.selectedPatient) return;

    this.isLoading = true;
    this.error = null;

    const patientId = this.selectedPatient.idpaciente || this.selectedPatient.id;
    
    this.medicalRecordService.getMedicalRecordsByPatient(patientId).subscribe({
      next: (medicalRecords) => {
        this.isLoading = false;
        this.medicalRecords = medicalRecords;
        
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
    this.isLoading = true;
    
    try {
      const detailedRecord = await this.medicalRecordService.getMedicalRecordDetails(recordId);
      this.isLoading = false;
      
      if (detailedRecord) {
        this.selectedMedicalRecord = detailedRecord;
        this.medicalRecordService.setSelectedMedicalRecord(detailedRecord);
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





