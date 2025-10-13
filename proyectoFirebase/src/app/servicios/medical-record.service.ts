import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';

export interface MedicalRecord {
  id: string;
  patientId: string;
  consultationId?: string;
  admissionDate: Date;
  patientName?: string;
  rut?: string;
  birthDate?: Date;
  gender?: string;
  address?: string;
  consultationDate?: Date;
  serviceType?: string;
  professionalName?: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DetailedMedicalRecord extends MedicalRecord {
  allergies: Allergy[];
  chronicConditions: ChronicCondition[];
  operations: Operation[];
}

export interface Allergy {
  id: string;
  name: string;
  description: string;
  medicalRecordId: string;
}

export interface ChronicCondition {
  id: string;
  name: string;
  description: string;
  medicalRecordId: string;
}

export interface Operation {
  id: string;
  name: string;
  description: string;
  date?: Date;
  medicalRecordId: string;
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
  private medicalRecordsCollection = collection(this.firestore, 'medicalRecords');
  private allergiesCollection = collection(this.firestore, 'allergies');
  private chronicConditionsCollection = collection(this.firestore, 'chronicConditions');
  private operationsCollection = collection(this.firestore, 'operations');
  
  private selectedMedicalRecordSubject = new BehaviorSubject<DetailedMedicalRecord | null>(null);
  public selectedMedicalRecord$ = this.selectedMedicalRecordSubject.asObservable();

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  getMedicalRecordsByPatient(patientId: string): Observable<MedicalRecordResponse> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of({ success: false, data: [], message: 'User not authenticated' });
    }

    const q = query(
      this.medicalRecordsCollection,
      where('patientId', '==', patientId),
      where('userId', '==', currentUser.id),
      orderBy('admissionDate', 'desc')
    );

    return from(getDocs(q)).pipe(
      map(querySnapshot => {
        const records: MedicalRecord[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          records.push({
            id: doc.id,
            patientId: data['patientId'],
            consultationId: data['consultationId'],
            admissionDate: data['admissionDate']?.toDate(),
            patientName: data['patientName'],
            rut: data['rut'],
            birthDate: data['birthDate']?.toDate(),
            gender: data['gender'],
            address: data['address'],
            consultationDate: data['consultationDate']?.toDate(),
            serviceType: data['serviceType'],
            professionalName: data['professionalName'],
            userId: data['userId'],
            createdAt: data['createdAt']?.toDate(),
            updatedAt: data['updatedAt']?.toDate()
          });
        });
        return { success: true, data: records, message: 'Records retrieved successfully' };
      }),
      catchError(error => {
        console.error('Error getting medical records:', error);
        return of({ success: false, data: [], message: error.message });
      })
    );
  }

  getMedicalRecordDetails(recordId: string): Observable<{ success: boolean; data: DetailedMedicalRecord | null; message: string }> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of({ success: false, data: null, message: 'User not authenticated' });
    }

    const recordDoc = doc(this.firestore, 'medicalRecords', recordId);
    
    return from(getDoc(recordDoc)).pipe(
      switchMap(recordSnap => {
        if (!recordSnap.exists()) {
          return of({ success: false, data: null, message: 'Medical record not found' });
        }

        const recordData = recordSnap.data();
        
        // Verify the record belongs to the current user
        if (recordData['userId'] !== currentUser.id) {
          return of({ success: false, data: null, message: 'Access denied' });
        }

        const baseRecord: MedicalRecord = {
          id: recordSnap.id,
          patientId: recordData['patientId'],
          consultationId: recordData['consultationId'],
          admissionDate: recordData['admissionDate']?.toDate(),
          patientName: recordData['patientName'],
          rut: recordData['rut'],
          birthDate: recordData['birthDate']?.toDate(),
          gender: recordData['gender'],
          address: recordData['address'],
          consultationDate: recordData['consultationDate']?.toDate(),
          serviceType: recordData['serviceType'],
          professionalName: recordData['professionalName'],
          userId: recordData['userId'],
          createdAt: recordData['createdAt']?.toDate(),
          updatedAt: recordData['updatedAt']?.toDate()
        };

        // Get related data
        return this.getRelatedData(recordId).pipe(
          map(({ allergies, chronicConditions, operations }) => {
            const detailedRecord: DetailedMedicalRecord = {
              ...baseRecord,
              allergies,
              chronicConditions,
              operations
            };
            return { success: true, data: detailedRecord, message: 'Record retrieved successfully' };
          })
        );
      }),
      catchError(error => {
        console.error('Error getting medical record details:', error);
        return of({ success: false, data: null, message: error.message });
      })
    );
  }

  createMedicalRecord(medicalRecord: Partial<MedicalRecord>): Observable<MedicalRecordResponse> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of({ success: false, data: null as any, message: 'User not authenticated' });
    }

    const newRecord = {
      ...medicalRecord,
      userId: currentUser.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    return from(addDoc(this.medicalRecordsCollection, newRecord)).pipe(
      map(docRef => ({ 
        success: true, 
        data: { ...medicalRecord, id: docRef.id } as MedicalRecord, 
        message: 'Medical record created successfully' 
      })),
      catchError(error => {
        console.error('Error creating medical record:', error);
        return of({ success: false, data: null as any, message: error.message });
      })
    );
  }

  updateMedicalRecord(recordId: string, medicalRecord: Partial<MedicalRecord>): Observable<{ success: boolean; message: string }> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of({ success: false, message: 'User not authenticated' });
    }

    const recordDoc = doc(this.firestore, 'medicalRecords', recordId);
    const updateData = {
      ...medicalRecord,
      updatedAt: serverTimestamp()
    };

    return from(updateDoc(recordDoc, updateData)).pipe(
      map(() => ({ success: true, message: 'Medical record updated successfully' })),
      catchError(error => {
        console.error('Error updating medical record:', error);
        return of({ success: false, message: error.message });
      })
    );
  }

  deleteMedicalRecord(recordId: string): Observable<{ success: boolean; message: string }> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of({ success: false, message: 'User not authenticated' });
    }

    const recordDoc = doc(this.firestore, 'medicalRecords', recordId);
    
    return from(deleteDoc(recordDoc)).pipe(
      map(() => ({ success: true, message: 'Medical record deleted successfully' })),
      catchError(error => {
        console.error('Error deleting medical record:', error);
        return of({ success: false, message: error.message });
      })
    );
  }

  private getRelatedData(medicalRecordId: string): Observable<{ allergies: Allergy[], chronicConditions: ChronicCondition[], operations: Operation[] }> {
    // Get allergies
    const allergiesQuery = query(this.allergiesCollection, where('medicalRecordId', '==', medicalRecordId));
    const allergiesObservable = from(getDocs(allergiesQuery)).pipe(
      map(querySnapshot => {
        const allergies: Allergy[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          allergies.push({
            id: doc.id,
            name: data['name'],
            description: data['description'],
            medicalRecordId: data['medicalRecordId']
          });
        });
        return allergies;
      }),
      catchError(() => of([]))
    );

    // Get chronic conditions
    const chronicQuery = query(this.chronicConditionsCollection, where('medicalRecordId', '==', medicalRecordId));
    const chronicObservable = from(getDocs(chronicQuery)).pipe(
      map(querySnapshot => {
        const conditions: ChronicCondition[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          conditions.push({
            id: doc.id,
            name: data['name'],
            description: data['description'],
            medicalRecordId: data['medicalRecordId']
          });
        });
        return conditions;
      }),
      catchError(() => of([]))
    );

    // Get operations
    const operationsQuery = query(this.operationsCollection, where('medicalRecordId', '==', medicalRecordId));
    const operationsObservable = from(getDocs(operationsQuery)).pipe(
      map(querySnapshot => {
        const operations: Operation[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          operations.push({
            id: doc.id,
            name: data['name'],
            description: data['description'],
            date: data['date']?.toDate(),
            medicalRecordId: data['medicalRecordId']
          });
        });
        return operations;
      }),
      catchError(() => of([]))
    );

    // Combine all queries
    return from(Promise.all([
      allergiesObservable.toPromise(),
      chronicObservable.toPromise(),
      operationsObservable.toPromise()
    ])).pipe(
      map(([allergies, chronicConditions, operations]) => ({
        allergies: allergies || [],
        chronicConditions: chronicConditions || [],
        operations: operations || []
      }))
    );
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

  formatDate(date: Date | string): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  calculateAge(birthDate: Date | string): number {
    if (!birthDate) return 0;
    
    const today = new Date();
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  generateMedicalRecordSummary(record: DetailedMedicalRecord): string {
    const summary = [];
    
    summary.push(`FICHA MÉDICA - ${record.patientName}`);
    summary.push('='.repeat(50));
    summary.push(`RUT: ${record.rut}`);
    
    if (record.birthDate) {
      const age = this.calculateAge(record.birthDate);
      summary.push(`Edad: ${age} años`);
    }
    
    summary.push(`Sexo: ${record.gender}`);
    summary.push(`Dirección: ${record.address}`);
    summary.push(`Fecha de Ingreso: ${this.formatDate(record.admissionDate)}`);
    
    if (record.serviceType) {
      summary.push(`Servicio: ${record.serviceType}`);
    }
    
    if (record.professionalName) {
      summary.push(`Profesional: ${record.professionalName}`);
    }

    if (record.consultationDate) {
      summary.push(`Fecha de Consulta: ${this.formatDate(record.consultationDate)}`);
    }

    // Add allergies if any
    if (record.allergies && record.allergies.length > 0) {
      summary.push('');
      summary.push('ALERGIAS:');
      summary.push('-'.repeat(20));
      record.allergies.forEach(allergy => {
        summary.push(`• ${allergy.name}: ${allergy.description}`);
      });
    }

    // Add chronic conditions if any
    if (record.chronicConditions && record.chronicConditions.length > 0) {
      summary.push('');
      summary.push('CONDICIONES CRÓNICAS:');
      summary.push('-'.repeat(30));
      record.chronicConditions.forEach(chronic => {
        summary.push(`• ${chronic.name}: ${chronic.description}`);
      });
    }

    // Add operations if any
    if (record.operations && record.operations.length > 0) {
      summary.push('');
      summary.push('OPERACIONES:');
      summary.push('-'.repeat(20));
      record.operations.forEach(operation => {
        summary.push(`• ${operation.name}: ${operation.description}`);
      });
    }
    
    summary.push('');
    summary.push(`Generado el: ${new Date().toLocaleDateString('es-CL')}`);
    
    return summary.join('\n');
  }
}