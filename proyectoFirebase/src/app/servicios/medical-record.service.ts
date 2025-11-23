/*
FIREBASE: MEDICAL RECORD SERVICE (SIMPLIFICADO)
Servicio para gestionar las fichas médicas en Firestore sin tablas relacionales.
*/

import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, docData, addDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

// 🧾 Modelo base
export interface MedicalRecord {
  idfichamedica: number;
  idpaciente: string;
  fechaingreso: string;
  idalergia?: string;
  idcronico?: string;
  idoperacion?: string;
  nombrePaciente?: string;
  rut?: string;
  fechaNacimiento?: string;
  sexo?: string;
  direccion?: string;
  fechaConsulta?: string;
  tipoServicio?: string;
  nombreProfesional?: string;
}

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

  getMedicalRecordsByPatient(patientId: string): Observable<MedicalRecord[]> {
    const medicalRecordsRef = collection(this.firestore, this.collectionName);
    const queryRef = query(medicalRecordsRef, where('idpaciente', '==', patientId));

    return new Observable<MedicalRecord[]>(subscriber => {
      const unsubscribe = collectionData(queryRef, { idField: 'idfichamedica' }).subscribe({
        next: data => subscriber.next(data as MedicalRecord[]),
        error: error => subscriber.error(error)
      });
      return () => unsubscribe.unsubscribe();
    });
  }

  getMedicalRecordById(recordId: string): Observable<MedicalRecord | undefined> {
    const recordDoc = doc(this.firestore, `${this.collectionName}/${recordId}`);
    return docData(recordDoc, { idField: 'idfichamedica' }) as Observable<MedicalRecord | undefined>;
  }

  // ⚠️ CORREGIDO → NO FABRICAMOS ARRAYS FALSOS
  async getMedicalRecordDetails(recordId: string): Promise<DetailedMedicalRecord | null> {
    try {
      const recordDoc = doc(this.firestore, `${this.collectionName}/${recordId}`);

      const recordSnap = await new Promise<any>((resolve) => {
        const sub = docData(recordDoc, { idField: 'idfichamedica' }).subscribe({
          next: data => { resolve(data); sub.unsubscribe(); },
          error: () => resolve(null)
        });
      });

      if (!recordSnap) return null;

      const details: DetailedMedicalRecord = {
        ...recordSnap,
        allergies: [],
        chronicConditions: [],
        operations: []
      };

      return details;

    } catch (error) {
      console.error('Error obteniendo ficha médica:', error);
      return null;
    }
  }

  async createMedicalRecord(medicalRecord: Omit<MedicalRecord, 'idfichamedica'>): Promise<void> {
    const ref = collection(this.firestore, this.collectionName);
    await addDoc(ref, medicalRecord);
  }

  async updateMedicalRecord(recordId: string, data: Partial<MedicalRecord>): Promise<void> {
    const ref = doc(this.firestore, `${this.collectionName}/${recordId}`);
    await updateDoc(ref, data);
  }

  async deleteMedicalRecord(recordId: string): Promise<void> {
    const ref = doc(this.firestore, `${this.collectionName}/${recordId}`);
    await deleteDoc(ref);
  }

  setSelectedMedicalRecord(record: DetailedMedicalRecord | null): void {
    this.selectedMedicalRecordSubject.next(record);
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

    if (record.idalergia) summary.push(`\nAlergia: ${record.idalergia}`);
    if (record.idcronico) summary.push(`Condición Crónica: ${record.idcronico}`);
    if (record.idoperacion) summary.push(`Operación: ${record.idoperacion}`);

    summary.push(`\nGenerado el: ${new Date().toLocaleDateString('es-CL')}`);
    return summary.join('\n');
  }
}
