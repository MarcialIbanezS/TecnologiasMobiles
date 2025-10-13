import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MedicalRecord {
  idfichamedica: number;
  idpaciente: number;
  idconsulta?: number;
  fechaingreso: string;
  nombrePaciente?: string;
  rut?: string;
  fechaNacimiento?: string;
  sexo?: string;
  direccion?: string;
  fechaConsulta?: string;
  tipoServicio?: string;
  nombreProfesional?: string;
}

export interface DetailedMedicalRecord extends MedicalRecord {
  allergies: Allergy[];
  chronicConditions: ChronicCondition[];
  operations: Operation[];
}

export interface Allergy {
  idalergia: number;
  nombrealergia: string;
  descripcionAlergia: string;
}

export interface ChronicCondition {
  idcronico: number;
  cronico: string;
  descripcionCronico: string;
}

export interface Operation {
  idoperacion: number;
  nombreoperacion: string;
  descripcionOperacion: string;
}

export interface MedicalRecordResponse {
  success: boolean;
  data: MedicalRecord[] | DetailedMedicalRecord | MedicalRecord;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private apiUrl = `${environment.apiUrl}/medical-records`;
  
  private selectedMedicalRecordSubject = new BehaviorSubject<DetailedMedicalRecord | null>(null);
  public selectedMedicalRecord$ = this.selectedMedicalRecordSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getMedicalRecordsByPatient(patientId: number): Observable<MedicalRecordResponse> {
    return this.http.get<MedicalRecordResponse>(`${this.apiUrl}/patient/${patientId}`);
  }

  getMedicalRecordDetails(recordId: number): Observable<{ success: boolean; data: DetailedMedicalRecord; message: string }> {
    return this.http.get<{ success: boolean; data: DetailedMedicalRecord; message: string }>(`${this.apiUrl}/${recordId}/details`);
  }

  createMedicalRecord(medicalRecord: Partial<MedicalRecord>): Observable<MedicalRecordResponse> {
    return this.http.post<MedicalRecordResponse>(this.apiUrl, medicalRecord, this.httpOptions);
  }

  updateMedicalRecord(recordId: number, medicalRecord: Partial<MedicalRecord>): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(`${this.apiUrl}/${recordId}`, medicalRecord, this.httpOptions);
  }

  deleteMedicalRecord(recordId: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${recordId}`);
  }

  setSelectedMedicalRecord(medicalRecord: DetailedMedicalRecord | null): void {
    this.selectedMedicalRecordSubject.next(medicalRecord);
  }

  getSelectedMedicalRecord(): DetailedMedicalRecord | null {
    return this.selectedMedicalRecordSubject.value;
  }

  clearSelectedMedicalRecord(): void {
    this.selectedMedicalRecordSubject.next(null);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  calculateAge(birthDate: string): number {
    if (!birthDate) return 0;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  generateMedicalRecordSummary(record: DetailedMedicalRecord): string {
    const summary = [];
    
    summary.push(`FICHA MÉDICA - ${record.nombrePaciente}`);
    summary.push('='.repeat(50));
    summary.push(`RUT: ${record.rut}`);
    
    if (record.fechaNacimiento) {
      const age = this.calculateAge(record.fechaNacimiento);
      summary.push(`Edad: ${age} años`);
    }
    
    summary.push(`Sexo: ${record.sexo}`);
    summary.push(`Dirección: ${record.direccion}`);
    summary.push(`Fecha de Ingreso: ${this.formatDate(record.fechaingreso)}`);
    
    if (record.tipoServicio) {
      summary.push(`Servicio: ${record.tipoServicio}`);
    }
    
    if (record.nombreProfesional) {
      summary.push(`Profesional: ${record.nombreProfesional}`);
    }

    if (record.fechaConsulta) {
      summary.push(`Fecha de Consulta: ${this.formatDate(record.fechaConsulta)}`);
    }

    // Add allergies if any
    if (record.allergies && record.allergies.length > 0) {
      summary.push('');
      summary.push('ALERGIAS:');
      summary.push('-'.repeat(20));
      record.allergies.forEach(allergy => {
        summary.push(`• ${allergy.nombrealergia}: ${allergy.descripcionAlergia}`);
      });
    }

    // Add chronic conditions if any
    if (record.chronicConditions && record.chronicConditions.length > 0) {
      summary.push('');
      summary.push('CONDICIONES CRÓNICAS:');
      summary.push('-'.repeat(30));
      record.chronicConditions.forEach(chronic => {
        summary.push(`• ${chronic.cronico}: ${chronic.descripcionCronico}`);
      });
    }

    // Add operations if any
    if (record.operations && record.operations.length > 0) {
      summary.push('');
      summary.push('OPERACIONES:');
      summary.push('-'.repeat(20));
      record.operations.forEach(operation => {
        summary.push(`• ${operation.nombreoperacion}: ${operation.descripcionOperacion}`);
      });
    }
    
    summary.push('');
    summary.push(`Generado el: ${new Date().toLocaleDateString('es-CL')}`);
    
    return summary.join('\n');
  }
}