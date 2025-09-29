import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonList, IonItem,
 IonAvatar, IonLabel, IonSpinner, IonToast } from '@ionic/angular/standalone';
import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { PatientService, Patient } from '../Services/patient.service';

@Component({
  selector: 'app-martin2',
  templateUrl: './martin2.page.html',
  styleUrls: ['./martin2.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonBreadcrumb, IonBreadcrumbs, RouterModule, IonSearchbar,
    IonList, IonItem, IonAvatar, IonLabel, IonSpinner, IonToast
  ]
})
export class Martin2Page implements OnInit {

  pacientes: Patient[] = [];
  filteredPacientes: Patient[] = [];
  isLoading = false;
  searchTerm = '';
  
  // Toast properties
  showToast = false;
  toastMessage = '';
  toastColor = 'danger';

  constructor(
    private router: Router,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.isLoading = true;
    this.patientService.getPatients().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.pacientes = response.patients;
          this.filteredPacientes = [...this.pacientes];
          console.log('Patients loaded:', this.pacientes);
        } else {
          this.showError('Error al cargar los pacientes');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading patients:', error);
        this.showError('Error de conexión al cargar los pacientes');
      }
    });
  }

  showError(message: string) {
    this.toastMessage = message;
    this.toastColor = 'danger';
    this.showToast = true;
  }

  irAHome() { this.router.navigate(['/login']); }
  irAMartin3() { this.router.navigate(['/martin3']); }

  verPaciente(paciente: Patient) {
    console.log("Paciente seleccionado:", paciente);
    // Navigate to patient detail page (martin1) passing patient data
    this.router.navigate(['/martin1'], { 
      state: { patient: paciente } 
    });
  }

  onBuscar(event: any) {
    this.searchTerm = event.detail.value.toLowerCase();
    this.filteredPacientes = this.pacientes.filter(p => {
      return p.nombre.toLowerCase().includes(this.searchTerm) ||
             p.rut.toLowerCase().includes(this.searchTerm);
    });
  }

  onToastDismiss() {
    this.showToast = false;
  }
}
