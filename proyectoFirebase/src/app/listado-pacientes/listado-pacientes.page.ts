import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonList, IonItem,
 IonAvatar, IonLabel, IonSpinner, IonToast, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { PatientService, Patient } from '../servicios/patient.service';
import { NavigationService, Breadcrumb } from '../servicios/navigation.service';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-listado-pacientes',
  templateUrl: './listado-pacientes.page.html',
  styleUrls: ['./listado-pacientes.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonBreadcrumb, IonBreadcrumbs, RouterModule, IonSearchbar,
    IonList, IonItem, IonAvatar, IonLabel, IonSpinner, IonToast,
    IonRefresher, IonRefresherContent
  ]
})
export class ListadoPacientesPage implements OnInit {

  pacientes: Patient[] = [];
  filteredPacientes: Patient[] = [];
  isLoading = false;
  searchTerm = '';
  breadcrumbs: Breadcrumb[] = [];
  
  // Toast properties
  showToast = false;
  toastMessage = '';
  toastColor = 'danger';

  constructor(
    private router: Router,
    private patientService: PatientService,
    private navigationService: NavigationService,
    private authService: AuthService
  ) { 
    // Set breadcrumbs for patients page
    this.breadcrumbs = [
      { label: 'Inicio', path: '/inicio' },
      { label: 'Pacientes', path: '/listadoPacientes' }
    ];
  }

  ngOnInit() {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadPatients();
  }

  loadPatients() {
    this.isLoading = true;
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.isLoading = false;
        this.pacientes = patients;
        this.filteredPacientes = [...this.pacientes];
        console.log('Patients loaded:', this.pacientes);
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
  irAInicio() { this.router.navigate(['/inicio']); }

  verPaciente(paciente: Patient) {
    console.log("Paciente seleccionado:", paciente);
    // Set selected patient in navigation service and navigate
    this.navigationService.setSelectedPatient(paciente, 'listadoPacientes');
    this.navigationService.navigateWithBreadcrumb('/perfilPaciente', paciente);
  }

  // Execute breadcrumb navigation
  onBreadcrumbClick(breadcrumb: Breadcrumb) {
    this.navigationService.executeBreadcrumbNavigation(breadcrumb);
  }

  onBuscar(event: any) {
    this.searchTerm = event.detail.value.toLowerCase();
    this.filteredPacientes = this.pacientes.filter(p => {
      const fullName = `${p.nombre} ${p.apellidopaterno} ${p.apellidomaterno || ''}`.toLowerCase();
      return fullName.includes(this.searchTerm) ||
             p.rut.toLowerCase().includes(this.searchTerm) ||
             p.nombre.toLowerCase().includes(this.searchTerm);
    });
  }

  onToastDismiss() {
    this.showToast = false;
  }

  // Pull-to-refresh functionality
  onRefresh(event: any) {
    this.loadPatients();
    // Complete the refresh
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  // Helper method to get display name for a patient
  getPatientDisplayName(patient: Patient): string {
    return `${patient.nombre} ${patient.apellidopaterno} ${patient.apellidomaterno || ''}`.trim();
  }
}

