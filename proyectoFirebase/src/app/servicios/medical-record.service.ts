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
  private allergiesCollectionName = 'alergia';
  private chronicConditionsCollectionName = 'cronico';
  private operationsCollectionName = 'operaciones';
  
  private selectedMedicalRecordSubject = new BehaviorSubject<DetailedMedicalRecord | null>(null);
  public selectedMedicalRecord$ = this.selectedMedicalRecordSubject.asObservable();

  constructor(private firestore: Firestore) { }

  // 🔹 Obtener todas las fichas médicas de un paciente
  getMedicalRecordsByPatient(patientId: string): Observable<MedicalRecord[]> {
    console.log('Service - Consultando fichas médicas:', {
      collection: this.collectionName,
      patientId,
      query: `where('idpaciente', '==', '${patientId}')`
    });

    const medicalRecordsRef = collection(this.firestore, this.collectionName);
    const queryRef = query(medicalRecordsRef, where('idpaciente', '==', patientId));
    
    // Use inject(Firestore) to get the Firestore instance within the context
    return new Observable<MedicalRecord[]>(subscriber => {
      const unsubscribe = collectionData(queryRef, { idField: 'idfichamedica' }).subscribe(data => {
        console.log('Service - Resultados crudos de Firestore:', {
          patientId,
          recordsCount: data.length,
          records: data
        });
        subscriber.next(data as MedicalRecord[]);
      }, error => {
        console.error('Error al obtener fichas médicas:', error);
        subscriber.error(error);
      });
      
      return () => unsubscribe.unsubscribe();
    });
  }

  // 🔹 Obtener ficha médica por ID
  getMedicalRecordById(recordId: string): Observable<MedicalRecord | undefined> {
    const recordDoc = doc(this.firestore, `${this.collectionName}/${recordId}`);
    return docData(recordDoc, { idField: 'idfichamedica' }) as Observable<MedicalRecord | undefined>;
  }

  // 🔹 Obtener detalles completos de ficha médica (con alergias, condiciones crónicas y operaciones)
  async getMedicalRecordDetails(recordId: string): Promise<DetailedMedicalRecord | null> {
    try {
      console.log('Obteniendo detalles de ficha médica:', recordId);
      
      // Get main medical record
      const recordDoc = doc(this.firestore, `${this.collectionName}/${recordId}`);
      const recordData = await new Promise<MedicalRecord | undefined>((resolve) => {
        const subscription = docData(recordDoc, { idField: 'idfichamedica' })
          .subscribe({
            next: (data) => {
              console.log('Datos básicos de la ficha:', data);
              resolve(data as MedicalRecord | undefined);
            },
            error: (error) => {
              console.error('Error al obtener ficha médica:', error);
              resolve(undefined);
            },
            complete: () => subscription.unsubscribe()
          });
      });
      
      if (!recordData) {
        console.warn('No se encontró la ficha médica:', recordId);
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
      const subscription = collectionData(queryRef, { idField: 'idalergia' })
        .subscribe({
          next: (data) => {
            resolve(data as Allergy[]);
          },
          error: (error) => {
            console.error('Error al obtener alergias:', error);
            resolve([]);
          },
          complete: () => subscription.unsubscribe()
        });
    });
  }

  // 🔹 Obtener condiciones crónicas por ficha médica
  private async getChronicConditionsByMedicalRecord(recordId: string): Promise<ChronicCondition[]> {
    const chronicRef = collection(this.firestore, this.chronicConditionsCollectionName);
    const queryRef = query(chronicRef, where('idfichamedica', '==', recordId));
    
    return new Promise<ChronicCondition[]>((resolve) => {
      const subscription = collectionData(queryRef, { idField: 'idcronico' })
        .subscribe({
          next: (data) => {
            resolve(data as ChronicCondition[]);
          },
          error: (error) => {
            console.error('Error al obtener condiciones crónicas:', error);
            resolve([]);
          },
          complete: () => subscription.unsubscribe()
        });
    });
  }

  // 🔹 Obtener operaciones por ficha médica
  private async getOperationsByMedicalRecord(recordId: string): Promise<Operation[]> {
    const operationsRef = collection(this.firestore, this.operationsCollectionName);
    const queryRef = query(operationsRef, where('idfichamedica', '==', recordId));
    
    return new Promise<Operation[]>((resolve) => {
      const subscription = collectionData(queryRef, { idField: 'idoperacion' })
        .subscribe({
          next: (data) => {
            resolve(data as Operation[]);
          },
          error: (error) => {
            console.error('Error al obtener operaciones:', error);
            resolve([]);
          },
          complete: () => subscription.unsubscribe()
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