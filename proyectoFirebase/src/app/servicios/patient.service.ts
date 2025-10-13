import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collectionData, 
  collection, 
  doc, 
  docData, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

// Modelo de paciente
export interface Patient {
  id: string;
  clientId: string;
  nombre: string;
  apellidopaterno: string;
  apellidomaterno?: string;
  rut: string;
  genero: string;
  fechanacimiento: Date;
  direccion: string;
  telefono?: string;
  email?: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private collectionName = 'patients';

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  // 🔹 Obtener todos los pacientes del usuario actual
  getPatients(): Observable<Patient[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of([]);
    }

    const patientsRef = collection(this.firestore, this.collectionName);
    const q = query(
      patientsRef, 
      where('userId', '==', currentUser.id),
      orderBy('nombre')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(patients => {
        return patients.map((patient: any) => ({
          ...patient,
          fechanacimiento: patient.fechanacimiento?.toDate?.() || patient.fechanacimiento,
          createdAt: patient.createdAt?.toDate?.() || patient.createdAt,
          updatedAt: patient.updatedAt?.toDate?.() || patient.updatedAt
        })) as Patient[];
      }),
      catchError(error => {
        console.error('Error getting patients:', error);
        return of([]);
      })
    );
  }

  // 🔹 Obtener pacientes por cliente
  getPatientsByClient(clientId: string): Observable<Patient[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of([]);
    }

    const patientsRef = collection(this.firestore, this.collectionName);
    const q = query(
      patientsRef, 
      where('clientId', '==', clientId),
      where('userId', '==', currentUser.id),
      orderBy('nombre')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(patients => {
        return patients.map((patient: any) => ({
          ...patient,
          fechanacimiento: patient.fechanacimiento?.toDate?.() || patient.fechanacimiento,
          createdAt: patient.createdAt?.toDate?.() || patient.createdAt,
          updatedAt: patient.updatedAt?.toDate?.() || patient.updatedAt
        })) as Patient[];
      }),
      catchError(error => {
        console.error('Error getting patients by client:', error);
        return of([]);
      })
    );
  }

  // 🔹 Obtener paciente por ID
  getPatientById(id: string): Observable<Patient | undefined> {
    const patientDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(patientDoc, { idField: 'id' }).pipe(
      map((patient: any) => {
        if (patient) {
          return {
            ...patient,
            fechanacimiento: patient.fechanacimiento?.toDate?.() || patient.fechanacimiento,
            createdAt: patient.createdAt?.toDate?.() || patient.createdAt,
            updatedAt: patient.updatedAt?.toDate?.() || patient.updatedAt
          } as Patient;
        }
        return undefined;
      }),
      catchError(error => {
        console.error('Error getting patient by id:', error);
        return of(undefined);
      })
    );
  }

  // 🔹 Agregar paciente nuevo
  async addPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; id?: string; error?: string }> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const patientsRef = collection(this.firestore, this.collectionName);
      const newPatient = {
        ...patient,
        userId: currentUser.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(patientsRef, newPatient);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding patient:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  // 🔹 Actualizar paciente existente
  async updatePatient(id: string, data: Partial<Omit<Patient, 'id' | 'userId' | 'createdAt'>>): Promise<{ success: boolean; error?: string }> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const patientDoc = doc(this.firestore, `${this.collectionName}/${id}`);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(patientDoc, updateData);
      return { success: true };
    } catch (error) {
      console.error('Error updating patient:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  // 🔹 Eliminar paciente
  async deletePatient(id: string): Promise<{ success: boolean; error?: string }> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const patientDoc = doc(this.firestore, `${this.collectionName}/${id}`);
      await deleteDoc(patientDoc);
      return { success: true };
    } catch (error) {
      console.error('Error deleting patient:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  // 🔹 Buscar pacientes por RUT
  searchPatientsByRut(rut: string): Observable<Patient[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of([]);
    }

    const patientsRef = collection(this.firestore, this.collectionName);
    const q = query(
      patientsRef, 
      where('rut', '==', rut),
      where('userId', '==', currentUser.id)
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(patients => {
        return patients.map((patient: any) => ({
          ...patient,
          fechanacimiento: patient.fechanacimiento?.toDate?.() || patient.fechanacimiento,
          createdAt: patient.createdAt?.toDate?.() || patient.createdAt,
          updatedAt: patient.updatedAt?.toDate?.() || patient.updatedAt
        })) as Patient[];
      }),
      catchError(error => {
        console.error('Error searching patients by RUT:', error);
        return of([]);
      })
    );
  }
}