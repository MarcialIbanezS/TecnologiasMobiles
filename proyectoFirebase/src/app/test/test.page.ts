import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonList, IonItem,
  IonAvatar, IonLabel, IonSpinner, IonToast, IonBreadcrumb, IonBreadcrumbs,
  IonInfiniteScroll, IonInfiniteScrollContent, IonFab, IonFabButton, IonIcon, IonButtons, IonButton
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { arrowUpOutline } from 'ionicons/icons';
import { PatientService, Patient } from '../servicios/patient.service';
import { NavigationService, Breadcrumb } from '../servicios/navigation.service';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
  standalone: true,
  imports: [
    CommonModule,      
    FormsModule,       
    RouterModule,
    IonButtons,
    IonButton,      
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

  pacientes: (Patient & { nombrePacienteLower?: string; rutClean?: string })[] = [];
  filteredPacientes: Patient[] = [];
  isLoading = false;
  searchTerm = '';
  isSearching = false;
  breadcrumbs: Breadcrumb[] = [];

  itemsPorPagina = 20;
  paginaActual = 0;
  showScrollTop = false;

  // Toast
  showToast = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' = 'danger';

  // 🔹 Subject para debounce
  private searchSubject = new Subject<string>();

  constructor(
    private router: Router,
    private patientService: PatientService,
    private navigationService: NavigationService
  ) { 
    addIcons({ arrowUpOutline });

    this.breadcrumbs = [
      { label: 'Inicio', path: '/inicio' },
      { label: 'Pacientes', path: '/listadoPacientes' }
    ];
  }

  ngOnInit() {
    this.loadPatients();

    // 🔹 Configurar debounceTime para la búsqueda
    this.searchSubject.pipe(
      debounceTime(400)
    ).subscribe(term => {
      this.realizarBusqueda(term);
    });
  }

  // 🔹 Cargar pacientes una sola vez
  loadPatients() {
    this.isLoading = true;
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.isLoading = false;
        // Preprocesar datos para acelerar las búsquedas
        this.pacientes = patients.map(p => ({
          ...p,
          nombrePacienteLower: p.nombrePaciente?.toLowerCase() || '',
          rutClean: p.rut?.toLowerCase().replace(/[.-]/g, '') || ''
        }));
        this.filteredPacientes = [];
        this.paginaActual = 0;
        this.cargarMasPacientesLocal();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading patients:', error);
        this.showToastMessage('Error de conexión al cargar los pacientes', 'danger');
      }
    });
  }

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

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    this.showScrollTop = scrollTop > 300;
  }

  scrollToTop() {
    this.content.scrollToTop(400);
    this.filteredPacientes = [];
    this.paginaActual = 0;
    this.cargarMasPacientesLocal();
    if (this.infiniteScroll) this.infiniteScroll.disabled = false;
  }

  // 🔹 Nueva función de búsqueda con debounce
  onBuscar(event: any) {
    const term = event.detail.value.toLowerCase().trim();
    this.searchSubject.next(term); // dispara el debounce
  }

  private realizarBusqueda(term: string) {
    this.searchTerm = term;

    if (term === '') {
      this.isSearching = false;
      this.filteredPacientes = [];
      this.paginaActual = 0;
      this.cargarMasPacientesLocal();
      if (this.infiniteScroll) this.infiniteScroll.disabled = false;
      return;
    }

    this.isSearching = true;
    const termNormalized = term.replace(/[.-]/g, '');

    const resultados = this.pacientes.filter(p => {
  const nombre = p.nombrePacienteLower ?? '';
  const rut = p.rutClean ?? '';
  return nombre.includes(term) || rut.includes(termNormalized);
  });

    // 🔹 Mostrar solo primeros 300 resultados por rendimiento
    this.filteredPacientes = resultados.slice(0, 300);

    if (this.infiniteScroll) this.infiniteScroll.disabled = true;
  }

  clearSearch() {
    this.searchTerm = '';
    this.isSearching = false;
    this.filteredPacientes = [];
    this.paginaActual = 0;
    this.cargarMasPacientesLocal();
    if (this.infiniteScroll) this.infiniteScroll.disabled = false;
  }

  showToastMessage(message: string, color: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  onToastDismiss() {
    this.showToast = false;
  }

  irAHome() { this.router.navigate(['/inicio']); } 
  irAMartin3() { this.router.navigate(['/inicio']); }
  goToProfile() {this.router.navigate(['/perfil-usuario']); }

  verPaciente(paciente: Patient) {
    console.log("Paciente seleccionado:", paciente);
    this.router.navigate(['/perfilPaciente'], { 
      state: { patient: paciente } 
    });
  }

  onBreadcrumbClick(breadcrumb: Breadcrumb) {
    this.router.navigate([breadcrumb.path]);
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
