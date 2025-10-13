import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
   IonCardTitle, IonButton } from '@ionic/angular/standalone';
import {IonBreadcrumb, IonBreadcrumbs} from  '@ionic/angular/standalone';
import {Router} from '@angular/router';
import {RouterModule} from '@angular/router';
import { NavigationService, Breadcrumb } from '../Services/navigation.service';


@Component({
  selector: 'app-ficha-medica',
  templateUrl: './ficha-medica.page.html',
  styleUrls: ['./ficha-medica.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonBreadcrumb, IonBreadcrumbs, RouterModule, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonButton
  ]
})
export class FichaMedicaPage implements OnInit {
  breadcrumbs: Breadcrumb[] = [];
  selectedPatient: any = null;

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) { 
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
  }

  // Execute breadcrumb navigation
  onBreadcrumbClick(breadcrumb: Breadcrumb) {
    this.navigationService.executeBreadcrumbNavigation(breadcrumb);
  }

}





