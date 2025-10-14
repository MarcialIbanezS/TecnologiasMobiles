import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonList, IonItem,
  IonAvatar, IonLabel, IonSpinner, IonToast, IonBreadcrumb, IonBreadcrumbs,
  IonInfiniteScroll, IonInfiniteScrollContent, IonFab, IonFabButton, IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { arrowUpOutline } from 'ionicons/icons';
import { PatientService, Patient } from '../servicios/patient.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
  standalone: true,
  imports: [
    CommonModule,      
    FormsModule,       
    RouterModule,      
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
    IonBreadcrumbs,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonFab,
    IonFabButton,
    IonIcon
  ]
})
export class TestPage implements OnInit {

  @ViewChild(IonContent) content!: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  pacientes: Patient[] = [];           // Todos los pacientes desde Firestore
  filteredPacientes: Patient[] = [];   // Pacientes visibles
  isLoading = false;
  searchTerm = '';

  itemsPorPagina = 20;   // 🔹 Cuántos mostrar por bloque
  paginaActual = 0;
  showScrollTop = false; // 🔹 Mostrar botón de subir

  // Toast
  showToast = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' = 'danger';

  constructor(
    private router: Router,
    private patientService: PatientService
  ) {
    addIcons({ arrowUpOutline }); // Registrar ícono
  }

  ngOnInit() {
    this.loadPatients();
  }

  // 🔹 Cargar todos los pacientes una sola vez
  loadPatients() {
    this.isLoading = true;
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.isLoading = false;
        this.pacientes = patients;
        this.filteredPacientes = [];
        this.paginaActual = 0;
        this.cargarMasPacientesLocal(); // Cargar primeros n
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading patients:', error);
        this.showToastMessage('Error de conexión al cargar los pacientes', 'danger');
      }
    });
  }

  // 🔹 Cargar porciones locales (scroll)
  cargarMasPacientes(event?: any) {
    this.cargarMasPacientesLocal();

    if (event) {
      setTimeout(() => {
        event.target.complete();
        if (this.filteredPacientes.length >= this.pacientes.length) {
          event.target.disabled = true;
        }
      }, 400);
    }
  }

  private cargarMasPacientesLocal() {
    const inicio = this.paginaActual * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    const nuevos = this.pacientes.slice(inicio, fin);
    this.filteredPacientes = [...this.filteredPacientes, ...nuevos];
    this.paginaActual++;
  }

  // 🔹 Scroll para mostrar el botón "Subir"
  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    this.showScrollTop = scrollTop > 300;
  }

  // 🔹 Subir al tope y resetear paginación
  scrollToTop() {
    this.content.scrollToTop(400);
    
    // Reset pagination to initial state
    this.filteredPacientes = [];
    this.paginaActual = 0;
    this.cargarMasPacientesLocal(); // Load only the first page again
    
    // Re-enable infinite scroll in case it was disabled
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }
  }

  // 🔹 Búsqueda
  onBuscar(event: any) {
    this.searchTerm = event.detail.value.toLowerCase();

    if (this.searchTerm.trim() === '') {
      // Sin filtro, reinicia scroll
      this.filteredPacientes = [];
      this.paginaActual = 0;
      this.cargarMasPacientesLocal();
    } else {
      this.filteredPacientes = this.pacientes.filter(p =>
        p.nombrePaciente.toLowerCase().includes(this.searchTerm) ||
        p.rut.toLowerCase().includes(this.searchTerm)
      );
    }
  }

  // 🔹 Toasts
  showToastMessage(message: string, color: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  onToastDismiss() {
    this.showToast = false;
  }

  // 🔹 Navegación
  irAHome() { this.router.navigate(['/test']); }
  irAMartin3() { this.router.navigate(['/test']); }
  verPaciente(paciente: Patient) {
    this.router.navigate(['/test'], { state: { patient: paciente } });
  }

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
}
