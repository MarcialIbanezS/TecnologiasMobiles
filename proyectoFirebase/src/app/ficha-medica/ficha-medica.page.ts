import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonButton, IonSpinner, IonList, IonItem, IonLabel, IonIcon, IonNote
} from '@ionic/angular/standalone';
import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { MedicalRecordService, DetailedMedicalRecord, MedicalRecord } from '../servicios/medical-record.service';
import { NavigationService } from '../servicios/navigation.service';
import { addIcons } from 'ionicons';
import { downloadOutline, refreshOutline, personCircleOutline, calendarOutline, medicalOutline, checkmarkCircleOutline } from 'ionicons/icons';

interface Breadcrumb {
  label: string;
  path: string;
}

@Component({
  selector: 'app-ficha-medica',
  templateUrl: './ficha-medica.page.html',
  styleUrls: ['./ficha-medica.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonBreadcrumb, IonBreadcrumbs, RouterModule, IonCard, IonCardContent, IonCardHeader,
    IonCardSubtitle, IonCardTitle, IonButton, IonSpinner, IonList, IonItem,
    IonLabel,  IonIcon, IonNote
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
    addIcons({ downloadOutline, refreshOutline, personCircleOutline, calendarOutline, medicalOutline, checkmarkCircleOutline });

    const navigation = this.router.getCurrentNavigation();
    const navState = navigation?.extras?.state;
    const historyState = window.history.state;

    const patient = navState?.['patient'] ||
      historyState?.['patient'] ||
      navState?.['navigationState']?.['selectedPatient'] ||
      historyState?.['navigationState']?.['selectedPatient'] ||
      this.navigationService.getSelectedPatient();

    if (patient) {
      this.selectedPatient = patient;
      console.log('Paciente cargado:', this.selectedPatient);
      if (!this.navigationService.getSelectedPatient()) {
        this.navigationService.setSelectedPatient(patient, 'fichaMedica');
      }
    } else {
      this.error = 'No se ha seleccionado un paciente';
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
    this.breadcrumbs = this.navigationService.getMedicalRecordBreadcrumbs(this.selectedPatient) || [
      { label: 'Inicio', path: '/inicio' },
      { label: 'Pacientes', path: '/listadoPacientes' },
      {
        label: this.selectedPatient?.nombre || this.selectedPatient?.nombrePaciente || 'Paciente',
        path: '/perfilPaciente',
        params: { patient: this.selectedPatient }
      },
      {
        label: 'Ficha Médica',
        path: '/fichaMedica',
        params: { patient: this.selectedPatient }
      }
    ];

    if (this.selectedPatient && !this.error) {
      this.loadMedicalRecords();
    }
  }

  onBreadcrumbClick(breadcrumb: Breadcrumb) {
    if (breadcrumb.path === '/fichaMedica' || breadcrumb.path === '/ficha-medica') return;
    if (breadcrumb.path === '/perfilPaciente' && this.selectedPatient) {
      this.router.navigate([breadcrumb.path], {
        state: { patient: this.selectedPatient }
      });
    } else {
      this.router.navigate([breadcrumb.path]);
    }
  }

  loadMedicalRecords() {
    if (!this.selectedPatient) {
      this.error = 'No se ha seleccionado un paciente';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.medicalRecords = [];
    this.selectedMedicalRecord = null;

    const patientId = this.selectedPatient.idpaciente || this.selectedPatient.id || this.selectedPatient.uid;

    if (!patientId) {
      this.error = 'ID de paciente no válido';
      this.isLoading = false;
      return;
    }

    console.log('Cargando fichas médicas para paciente:', patientId);

    this.medicalRecordService.getMedicalRecordsByPatient(patientId).subscribe({
      next: (medicalRecords) => {
        this.isLoading = false;
        this.medicalRecords = medicalRecords;
        console.log('Fichas médicas obtenidas:', this.medicalRecords);

        if (this.medicalRecords.length > 0) {
          this.loadMedicalRecordDetails(String(this.medicalRecords[0].idfichamedica));
        } else {
          this.error = 'No se encontraron fichas médicas para este paciente';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Error al cargar las fichas médicas: ' + (error.message || error);
        console.error(error);
      }
    });
  }

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
        // No hay más relaciones; los campos ya vienen listos
        this.selectedMedicalRecord = detailedRecord;
        this.medicalRecordService.setSelectedMedicalRecord(detailedRecord);
        console.log('Ficha médica cargada:', this.selectedMedicalRecord);
      } else {
        this.error = 'No se encontraron detalles para esta ficha médica';
      }
    } catch (error: any) {
      this.isLoading = false;
      this.error = 'Error al cargar detalles de la ficha médica: ' + (error.message || error);
      console.error(error);
    }
  }

  refreshMedicalRecords() {
    this.loadMedicalRecords();
  }

  downloadMedicalRecord() {
    if (this.selectedMedicalRecord) {
      const summary = this.medicalRecordService.generateMedicalRecordSummary(this.selectedMedicalRecord);
      const blob = new Blob([summary], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ficha-medica-${this.selectedMedicalRecord?.nombrePaciente || 'paciente'}.txt`;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '';
    return this.medicalRecordService.formatDate(dateString);
  }

  calculateAge(birthDate: string | null | undefined): number {
    if (!birthDate) return 0;
    return this.medicalRecordService.calculateAge(birthDate);
  }
}
