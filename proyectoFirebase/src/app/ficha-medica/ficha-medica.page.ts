import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
   IonCardTitle, IonButton, IonSpinner, IonList, IonItem, IonLabel, IonChip, IonIcon } from '@ionic/angular/standalone';
import {IonBreadcrumb, IonBreadcrumbs} from  '@ionic/angular/standalone';
import {Router} from '@angular/router';
import {RouterModule} from '@angular/router';
import { NavigationService, Breadcrumb } from '../Services/navigation.service';
import { MedicalRecordService, DetailedMedicalRecord, MedicalRecord } from '../Services/medical-record.service';
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
    private medicalRecordService: MedicalRecordService
  ) { 
    // Add icons
    addIcons({ downloadOutline, refreshOutline, personCircleOutline, calendarOutline, medicalOutline, checkmarkCircleOutline });
    
    // Get patient from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['patient']) {
      this.selectedPatient = navigation.extras.state['patient'];
    } else {
      // Try to get from navigation service
      this.selectedPatient = this.navigationService.getSelectedPatient();
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
    // Build breadcrumbs for medical record page
    this.breadcrumbs = this.navigationService.getMedicalRecordBreadcrumbs(this.selectedPatient);
    
    // Load medical records if patient is selected
    if (this.selectedPatient) {
      this.loadMedicalRecords();
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

    const patientId = this.selectedPatient.idpaciente || this.selectedPatient.id;
    
    this.medicalRecordService.getMedicalRecordsByPatient(patientId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && Array.isArray(response.data)) {
          this.medicalRecords = response.data;
          
          // If there are records, load details for the first one
          if (this.medicalRecords.length > 0) {
            this.loadMedicalRecordDetails(this.medicalRecords[0].idfichamedica);
          }
        } else {
          this.error = 'No se encontraron fichas médicas para este paciente';
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
  loadMedicalRecordDetails(recordId: number) {
    this.isLoading = true;
    
    this.medicalRecordService.getMedicalRecordDetails(recordId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.selectedMedicalRecord = response.data;
          this.medicalRecordService.setSelectedMedicalRecord(response.data);
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





