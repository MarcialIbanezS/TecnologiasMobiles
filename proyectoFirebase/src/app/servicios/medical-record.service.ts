/*
FIREBASE: MEDICAL RECORD SERVICE (SIMPLIFICADO)
Servicio para gestionar las fichas médicas en Firestore sin tablas relacionales.
*/

import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, docData, addDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

// 🧾 Modelo base
export interface MedicalRecord {
  idfichamedica: number;     // ID numérico de ficha
  idpaciente: string;        // ID del paciente
  fechaingreso: string;
  idalergia?: string;        // Texto: nombre de alergia
  idcronico?: string;        // Texto: nombre de condición crónica
  idoperacion?: string;      // Texto: nombre de operación
  nombrePaciente?: string;
  rut?: string;
  fechaNacimiento?: string;
  sexo?: string;
  direccion?: string;
  fechaConsulta?: string;
  tipoServicio?: string;
  nombreProfesional?: string;
}

// 🧬 Interfaces para compatibilidad con vistas previas
export interface Allergy {
  idalergia: string;
  nombrealergia: string;
  descripcionAlergia: string;
}

export interface ChronicCondition {
  idcronico: string;
  enfermedadcronica: string;
}

export interface Operation {
  idoperacion: string;
  operacion: string;
}

export interface DetailedMedicalRecord extends MedicalRecord {
  allergies: Allergy[];
  chronicConditions: ChronicCondition[];
  operations: Operation[];
}

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private collectionName = 'fichamedica';

  private selectedMedicalRecordSubject = new BehaviorSubject<DetailedMedicalRecord | null>(null);
  public selectedMedicalRecord$ = this.selectedMedicalRecordSubject.asObservable();

  constructor(private firestore: Firestore) {}

  // 🔹 Obtener todas las fichas médicas de un paciente
  getMedicalRecordsByPatient(patientId: string): Observable<MedicalRecord[]> {
    const medicalRecordsRef = collection(this.firestore, this.collectionName);
    const queryRef = query(medicalRecordsRef, where('idpaciente', '==', patientId));

    return new Observable<MedicalRecord[]>(subscriber => {
      const unsubscribe = collectionData(queryRef, { idField: 'idfichamedica' }).subscribe({
        next: data => subscriber.next(data as MedicalRecord[]),
        error: error => {
          console.error('Error al obtener fichas médicas:', error);
          subscriber.error(error);
        }
      });
      return () => unsubscribe.unsubscribe();
    });
  }

  // 🔹 Obtener ficha médica por ID (básico)
  getMedicalRecordById(recordId: string): Observable<MedicalRecord | undefined> {
    const recordDoc = doc(this.firestore, `${this.collectionName}/${recordId}`);
    return docData(recordDoc, { idField: 'idfichamedica' }) as Observable<MedicalRecord | undefined>;
  }

  // 🔹 Obtener detalles completos (ya no hay relaciones)
  async getMedicalRecordDetails(recordId: string): Promise<DetailedMedicalRecord | null> {
    try {
      console.log('Obteniendo detalles de ficha médica:', recordId);

      const recordDoc = doc(this.firestore, `${this.collectionName}/${recordId}`);
      const recordSnap = await new Promise<any>((resolve) => {
        const sub = docData(recordDoc, { idField: 'idfichamedica' }).subscribe({
          next: (data) => { resolve(data); sub.unsubscribe(); },
          error: (err) => { console.error('Error al obtener ficha médica:', err); resolve(null); }
        });
      });

      if (!recordSnap) {
        console.warn('No se encontró la ficha médica:', recordId);
        return null;
      }

      // Adaptar al formato de DetailedMedicalRecord
      const details: DetailedMedicalRecord = {
        ...recordSnap,
        allergies: recordSnap.idalergia
          ? [{ idalergia: '1', nombrealergia: recordSnap.idalergia, descripcionAlergia: '' }]
          : [],
        chronicConditions: recordSnap.idcronico
          ? [{ idcronico: '1', enfermedadcronica: recordSnap.idcronico }]
          : [],
        operations: recordSnap.idoperacion
          ? [{ idoperacion: '1', operacion: recordSnap.idoperacion }]
          : []
      };

      return details;

    } catch (error) {
      console.error('Error obteniendo ficha médica con detalles:', error);
      return null;
    }
  }

  // 🔹 Crear ficha médica
  async createMedicalRecord(medicalRecord: Omit<MedicalRecord, 'idfichamedica'>): Promise<void> {
    const ref = collection(this.firestore, this.collectionName);
    await addDoc(ref, medicalRecord);
  }

  // 🔹 Actualizar ficha médica
  async updateMedicalRecord(recordId: string, data: Partial<MedicalRecord>): Promise<void> {
    const ref = doc(this.firestore, `${this.collectionName}/${recordId}`);
    await updateDoc(ref, data);
  }

  // 🔹 Eliminar ficha médica
  async deleteMedicalRecord(recordId: string): Promise<void> {
    const ref = doc(this.firestore, `${this.collectionName}/${recordId}`);
    await deleteDoc(ref);
  }

  // 🔹 Gestión del registro seleccionado
  setSelectedMedicalRecord(record: DetailedMedicalRecord | null): void {
    this.selectedMedicalRecordSubject.next(record);
  }

  getSelectedMedicalRecord(): DetailedMedicalRecord | null {
    return this.selectedMedicalRecordSubject.value;
  }

  clearSelectedMedicalRecord(): void {
    this.selectedMedicalRecordSubject.next(null);
  }

  // 🔹 Utilidades de formato
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
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  generateMedicalRecordSummary(record: DetailedMedicalRecord): string {
    const summary: string[] = [];
    summary.push(`FICHA MÉDICA - ${record.nombrePaciente || 'Paciente sin nombre'}`);
    summary.push('='.repeat(50));
    summary.push(`RUT: ${record.rut || 'N/A'}`);
    if (record.fechaNacimiento) {
      const age = this.calculateAge(record.fechaNacimiento);
      summary.push(`Edad: ${age} años`);
    }
    summary.push(`Sexo: ${record.sexo || 'N/A'}`);
    summary.push(`Dirección: ${record.direccion || 'N/A'}`);
    summary.push(`Fecha de Ingreso: ${this.formatDate(record.fechaingreso)}`);
    if (record.tipoServicio) summary.push(`Servicio: ${record.tipoServicio}`);
    if (record.nombreProfesional) summary.push(`Profesional: ${record.nombreProfesional}`);
    if (record.fechaConsulta) summary.push(`Fecha de Consulta: ${this.formatDate(record.fechaConsulta)}`);

    if (record.allergies?.length) {
      summary.push('\nALERGIAS:');
      record.allergies.forEach(a => summary.push(`• ${a.nombrealergia}`));
    }

    if (record.chronicConditions?.length) {
      summary.push('\nCONDICIONES CRÓNICAS:');
      record.chronicConditions.forEach(c => summary.push(`• ${c.enfermedadcronica}`));
    }

    if (record.operations?.length) {
      summary.push('\nOPERACIONES:');
      record.operations.forEach(o => summary.push(`• ${o.operacion}`));
    }

    summary.push(`\nGenerado el: ${new Date().toLocaleDateString('es-CL')}`);
    return summary.join('\n');
  }
}
