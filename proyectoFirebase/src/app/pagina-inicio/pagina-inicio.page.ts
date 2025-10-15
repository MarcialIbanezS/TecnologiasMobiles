import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader,
  IonCardSubtitle, IonCardTitle, IonGrid, IonCol, IonRow, IonButton
  
} from '@ionic/angular/standalone';
import {IonBreadcrumb, IonBreadcrumbs} from  '@ionic/angular/standalone';
import {Router} from '@angular/router';
import {RouterModule} from '@angular/router';
import { Patient } from '../servicios/patient.service';
import { NavigationService, Breadcrumb } from '../servicios/navigation.service';

@Component({
  selector: 'app-pagina-inicio',
  templateUrl: './pagina-inicio.page.html',
  styleUrls: ['./pagina-inicio.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule
    , IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, 
    IonGrid, IonCol, IonRow, IonButton, IonBreadcrumb, IonBreadcrumbs, RouterModule]})
    
export class PaginaInicioPage implements OnInit {

  selectedPatient: Patient | null = null;
  breadcrumbs: Breadcrumb[] = [];

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {
    // Get patient data from navigation state if it exists
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['patient']) {
      this.selectedPatient = navigation.extras.state['patient'];
    } else {
      // Try to get from navigation service
      this.selectedPatient = this.navigationService.getSelectedPatient();
    }
  }
 irAHome() {
    this.router.navigate(['/login']);       
  }
  irAMartin0() {
    this.router.navigate(['/pagina2']);       
  }
  irAPerfilPaciente() {
    // Pass patient data to patient profile if available
    if (this.selectedPatient) {
      this.router.navigate(['/perfilPaciente'], { 
        state: { patient: this.selectedPatient } 
      });
    } else {
      this.router.navigate(['/perfilPaciente']);
    }
  }
  irAListadoPacientes() {
    this.router.navigate(['/listadoPacientes']);       
  }
  irAInicio() {
    this.router.navigate(['/inicio']);       
  }
  irAFichaMedica() {
    this.router.navigate(['/fichaMedica']);       
  }

  ngOnInit() {
    // Build breadcrumbs for patient menu/inicio page
    this.breadcrumbs = [
      { label: 'Inicio', path: '/inicio' }
    ];
  }

  // Execute breadcrumb navigation
  onBreadcrumbClick(breadcrumb: Breadcrumb) {
    this.navigationService.executeBreadcrumbNavigation(breadcrumb);
  }

  // Navigate to medical record with patient context
  verFichaMedica() {
    if (this.selectedPatient) {
      this.navigationService.navigateWithBreadcrumb('/fichaMedica', this.selectedPatient);
    }
  }

}

