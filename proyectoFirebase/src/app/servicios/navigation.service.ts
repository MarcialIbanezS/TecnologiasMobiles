/*
BREADCRUMBS NAVIGATION
Service to manage navigation state and breadcrumbs across the app.
Allows setting selected patient context and building dynamic breadcrumbs.
Enables navigation with context preservation.

*/

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface Breadcrumb {
  label: string;
  path: string;
  params?: any;
}

export interface NavigationState {
  selectedPatient?: any;
  fromPage?: string;
  breadcrumbs: Breadcrumb[];
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private navigationState = new BehaviorSubject<NavigationState>({
    breadcrumbs: []
  });

  public navigationState$ = this.navigationState.asObservable();

  constructor(private router: Router) {}

  // Set the selected patient and update breadcrumbs
  setSelectedPatient(patient: any, fromPage?: string) {
    const currentState = this.navigationState.value;
    const newState: NavigationState = {
      ...currentState,
      selectedPatient: patient,
      fromPage: fromPage,
      breadcrumbs: this.buildBreadcrumbs(patient, fromPage)
    };
    
    this.navigationState.next(newState);
  }

  // Get current navigation state
  getCurrentState(): NavigationState {
    return this.navigationState.value;
  }

  // Get selected patient
  getSelectedPatient() {
    return this.navigationState.value.selectedPatient;
  }

  // Build breadcrumbs based on current context
  private buildBreadcrumbs(patient?: any, fromPage?: string): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Inicio', path: '/inicio' },
      { label: 'Pacientes', path: '/listadoPacientes' }
    ];

    if (patient) {
      breadcrumbs.push({
        label: patient.nombre || patient.patient_name || 'Paciente',
        path: '/perfilPaciente',
        params: { patient }
      });
    }

    return breadcrumbs;
  }

  // Navigate with breadcrumb context
  navigateWithBreadcrumb(path: string, patient?: any) {
    if (patient) {
      this.setSelectedPatient(patient, path);
    }
    
    this.router.navigate([path], {
      state: { 
        patient: patient,
        navigationState: this.getCurrentState()
      }
    });
  }

  // Execute breadcrumb navigation
  executeBreadcrumbNavigation(breadcrumb: Breadcrumb) {
    if (breadcrumb.params?.patient) {
      this.navigateWithBreadcrumb(breadcrumb.path, breadcrumb.params.patient);
    } else {
      this.router.navigate([breadcrumb.path]);
    }
  }

  // Clear navigation state
  clearNavigationState() {
    this.navigationState.next({ breadcrumbs: [] });
  }

  // Get breadcrumbs for medical record page
  getMedicalRecordBreadcrumbs(patient?: any): Breadcrumb[] {
    const breadcrumbs = this.buildBreadcrumbs(patient);
    breadcrumbs.push({
      label: 'Ficha Médica',
      path: '/fichaMedica',
      params: { patient }
    });
    return breadcrumbs;
  }
}