import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonList, IonItem,
  IonAvatar, IonLabel, IonSpinner, IonToast, IonBreadcrumb, IonBreadcrumbs
} from '@ionic/angular/standalone';

import { PatientService, Patient } from '../servicios/patient.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
  standalone: true,
  imports: [
    CommonModule,      // ✅ Siempre primero
    FormsModule,       // ✅ Angular Forms
    RouterModule,      // ✅ Rutas
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonSpinner,
    IonToast,
    IonBreadcrumb,
    IonBreadcrumbs
  ]
})
export class TestPage implements OnInit {

  pacientes: Patient[] = [];
  filteredPacientes: Patient[] = [];
  isLoading = false;
  searchTerm = '';

  // Toast properties
  showToast = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' = 'danger';

  constructor(
    private router: Router,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  // 🔹 Cargar pacientes desde Firestore
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
        this.showToastMessage('Error de conexión al cargar los pacientes', 'danger');
      }
    });
  }

  // 🔹 Mostrar toast
  showToastMessage(message: string, color: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  // 🔹 Navegaciones
  irAHome() { this.router.navigate(['/test']); }
  irAMartin3() { this.router.navigate(['/test']); }

  verPaciente(paciente: Patient) {
    this.router.navigate(['/test'], { state: { patient: paciente } });
  }

  editarPaciente(paciente: Patient) {
    this.router.navigate(['/editar-paciente'], { state: { patient: paciente } });
  }

  // 🔹 Eliminar paciente
  async eliminarPaciente(idpaciente: string) {
  try {
    await this.patientService.deletePatient(idpaciente);
    this.showToastMessage('Paciente eliminado', 'success');
    this.loadPatients();
  } catch (error) {
    console.error('Error eliminando paciente:', error);
    this.showToastMessage('Error al eliminar paciente', 'danger');
  }
}

  // 🔹 Filtrado por búsqueda
  onBuscar(event: any) {
    this.searchTerm = event.detail.value.toLowerCase();
    this.filteredPacientes = this.pacientes.filter(p =>
      p.nombrePaciente.toLowerCase().includes(this.searchTerm) ||
      p.rut.toLowerCase().includes(this.searchTerm)
    );
  }

  onToastDismiss() {
    this.showToast = false;
  }
}
