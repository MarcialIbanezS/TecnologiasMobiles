/*
FIREBASE: MEDICAL RECORD SERVICE
Service to manage CRUD operations for medical records in Firestore.
*/

import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, docData, addDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

export interface MedicalRecord {
  idfichamedica: string;    // Firestore ID (string)
  idpaciente: string;       // Patient ID (string)
  idconsulta?: string;      // Consultation ID (string)
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
  idalergia: string;        // Firestore ID (string)
  nombrealergia: string;
  descripcionAlergia: string;
}

export interface ChronicCondition {
  idcronico: string;        // Firestore ID (string)
  cronico: string;
  descripcionCronico: string;
}

export interface Operation {
  idoperacion: string;      // Firestore ID (string)
  nombreoperacion: string;
  descripcionOperacion: string;
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
  private allergiesCollectionName = 'alergias';
  private chronicConditionsCollectionName = 'condicionesCronicas';
  private operationsCollectionName = 'operaciones';
  
  private selectedMedicalRecordSubject = new BehaviorSubject<DetailedMedicalRecord | null>(null);
  public selectedMedicalRecord$ = this.selectedMedicalRecordSubject.asObservable();

  constructor(private firestore: Firestore) { }

  // 🔹 Obtener todas las fichas médicas de un paciente
  getMedicalRecordsByPatient(patientId: string): Observable<MedicalRecord[]> {
    const medicalRecordsRef = collection(this.firestore, this.collectionName);
    const queryRef = query(medicalRecordsRef, where('idpaciente', '==', patientId));
    return collectionData(queryRef, { idField: 'idfichamedica' }) as Observable<MedicalRecord[]>;
  }

  // 🔹 Obtener ficha médica por ID
  getMedicalRecordById(recordId: string): Observable<MedicalRecord | undefined> {
    const recordDoc = doc(this.firestore, `${this.collectionName}/${recordId}`);
    return docData(recordDoc, { idField: 'idfichamedica' }) as Observable<MedicalRecord | undefined>;
  }

  // 🔹 Obtener detalles completos de ficha médica (con alergias, condiciones crónicas y operaciones)
  async getMedicalRecordDetails(recordId: string): Promise<DetailedMedicalRecord | null> {
    try {
      // Get main medical record
      const recordDoc = doc(this.firestore, `${this.collectionName}/${recordId}`);
      const recordData = await new Promise<MedicalRecord | undefined>((resolve) => {
        const unsubscribe = docData(recordDoc, { idField: 'idfichamedica' }).subscribe((data) => {
          unsubscribe.unsubscribe();
          resolve(data as MedicalRecord | undefined);
        });
      });
      
      if (!recordData) {
        return null;
      }

      // Get related data
      const [allergies, chronicConditions, operations] = await Promise.all([
        this.getAllergiesByMedicalRecord(recordId),
        this.getChronicConditionsByMedicalRecord(recordId),
        this.getOperationsByMedicalRecord(recordId)
      ]);

      return {
        ...recordData,
        allergies,
        chronicConditions,
        operations
      };
    } catch (error) {
      console.error('Error getting medical record details:', error);
      return null;
    }
  }

  // 🔹 Crear nueva ficha médica
  async createMedicalRecord(medicalRecord: Omit<MedicalRecord, 'idfichamedica'>): Promise<void> {
    const medicalRecordsRef = collection(this.firestore, this.collectionName);
    await addDoc(medicalRecordsRef, medicalRecord);
  }

  // 🔹 Actualizar ficha médica existente
  async updateMedicalRecord(recordId: string, data: Partial<MedicalRecord>): Promise<void> {
    const recordDoc = doc(this.firestore, `${this.collectionName}/${recordId}`);
    await updateDoc(recordDoc, data);
  }

  // 🔹 Eliminar ficha médica
  async deleteMedicalRecord(recordId: string): Promise<void> {
    const recordDoc = doc(this.firestore, `${this.collectionName}/${recordId}`);
    await deleteDoc(recordDoc);
  }

  // 🔹 Obtener alergias por ficha médica
  private async getAllergiesByMedicalRecord(recordId: string): Promise<Allergy[]> {
    const allergiesRef = collection(this.firestore, this.allergiesCollectionName);
    const queryRef = query(allergiesRef, where('idfichamedica', '==', recordId));
    
    return new Promise<Allergy[]>((resolve) => {
      const unsubscribe = collectionData(queryRef, { idField: 'idalergia' }).subscribe((data) => {
        unsubscribe.unsubscribe();
        resolve(data as Allergy[]);
      });
    });
  }

  // 🔹 Obtener condiciones crónicas por ficha médica
  private async getChronicConditionsByMedicalRecord(recordId: string): Promise<ChronicCondition[]> {
    const chronicRef = collection(this.firestore, this.chronicConditionsCollectionName);
    const queryRef = query(chronicRef, where('idfichamedica', '==', recordId));
    
    return new Promise<ChronicCondition[]>((resolve) => {
      const unsubscribe = collectionData(queryRef, { idField: 'idcronico' }).subscribe((data) => {
        unsubscribe.unsubscribe();
        resolve(data as ChronicCondition[]);
      });
    });
  }

  // 🔹 Obtener operaciones por ficha médica
  private async getOperationsByMedicalRecord(recordId: string): Promise<Operation[]> {
    const operationsRef = collection(this.firestore, this.operationsCollectionName);
    const queryRef = query(operationsRef, where('idfichamedica', '==', recordId));
    
    return new Promise<Operation[]>((resolve) => {
      const unsubscribe = collectionData(queryRef, { idField: 'idoperacion' }).subscribe((data) => {
        unsubscribe.unsubscribe();
        resolve(data as Operation[]);
      });
    });
  }

  // 🔹 Agregar alergia a una ficha médica
  async addAllergy(recordId: string, allergy: Omit<Allergy, 'idalergia'>): Promise<void> {
    const allergiesRef = collection(this.firestore, this.allergiesCollectionName);
    await addDoc(allergiesRef, { ...allergy, idfichamedica: recordId });
  }

  // 🔹 Agregar condición crónica a una ficha médica
  async addChronicCondition(recordId: string, condition: Omit<ChronicCondition, 'idcronico'>): Promise<void> {
    const chronicRef = collection(this.firestore, this.chronicConditionsCollectionName);
    await addDoc(chronicRef, { ...condition, idfichamedica: recordId });
  }

  // 🔹 Agregar operación a una ficha médica
  async addOperation(recordId: string, operation: Omit<Operation, 'idoperacion'>): Promise<void> {
    const operationsRef = collection(this.firestore, this.operationsCollectionName);
    await addDoc(operationsRef, { ...operation, idfichamedica: recordId });
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