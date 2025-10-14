import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// Modelo de paciente
export interface Patient {
  idpaciente: string;       // ID de Firestore (string)
  nombrePaciente: string;
  rut: string;
  sexo: string;
  fechaNacimiento: string;
  direccion: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private collectionName = 'paciente';

  constructor(private firestore: Firestore) {}

  // 🔹 Obtener todos los pacientes
  getPatients(): Observable<Patient[]> {
    const patientsRef = collection(this.firestore, this.collectionName);
    return collectionData(patientsRef, { idField: 'idpaciente' }) as Observable<Patient[]>;
  }

  // 🔹 Obtener paciente por ID
  getPatientById(id: string): Observable<Patient | undefined> {
    const patientDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(patientDoc, { idField: 'idpaciente' }) as Observable<Patient | undefined>;
  }

  // 🔹 Agregar paciente nuevo
  async addPatient(patient: Omit<Patient, 'idpaciente'>): Promise<void> {
    const patientsRef = collection(this.firestore, this.collectionName);
    await addDoc(patientsRef, patient);
  }

  // 🔹 Actualizar paciente existente
  async updatePatient(id: string, data: Partial<Patient>): Promise<void> {
    const patientDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    await updateDoc(patientDoc, data);
  }

  // 🔹 Eliminar paciente
  async deletePatient(id: string): Promise<void> {
    const patientDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    await deleteDoc(patientDoc);
  }
}