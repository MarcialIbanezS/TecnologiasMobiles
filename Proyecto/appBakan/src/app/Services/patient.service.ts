import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Patient {
  idpaciente: number;
  nombre: string;
  apellidopaterno: string;
  apellidomaterno?: string;
  rut: string;
  fechanacimiento?: string;
  genero?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  idcliente?: number;
  clienteName?: string;
  allergies?: string;
  chronicDiseases?: string;
}

export interface PatientDetail {
  idpaciente: number;
  nombre: string;
  apellidopaterno: string;
  apellidomaterno?: string;
  rut: string;
  fechanacimiento?: string;
  genero?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  idcliente?: number;
  clienteName?: string;
  allergies: Array<{
    idalergia: number;
    nombrealergia: string;
    descripcionAlergia: string;
  }>;
  chronicDiseases: Array<{
    idcronico: number;
    enfermedadcronica: string;
  }>;
  recentConsultations: Array<any>;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patients`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getPatients(): Observable<{ success: boolean; patients: Patient[] }> {
    return this.http.get<{ success: boolean; patients: Patient[] }>(
      this.apiUrl,
      this.authService.getHttpOptions()
    );
  }

  getPatient(id: number): Observable<{ success: boolean; patient: PatientDetail }> {
    return this.http.get<{ success: boolean; patient: PatientDetail }>(
      `${this.apiUrl}/${id}`,
      this.authService.getHttpOptions()
    );
  }

  createPatient(patient: Partial<Patient>): Observable<any> {
    return this.http.post(
      this.apiUrl,
      patient,
      this.authService.getHttpOptions()
    );
  }

  updatePatient(id: number, patient: Partial<Patient>): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      patient,
      this.authService.getHttpOptions()
    );
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      this.authService.getHttpOptions()
    );
  }
}