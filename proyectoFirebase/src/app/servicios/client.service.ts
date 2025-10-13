import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
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

export interface Client {
  id: string;
  name: string;
  patientCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
}

export interface ClientDetail extends Client {
  patients: Array<{
    id: string;
    nombre: string;
    apellidopaterno: string;
    apellidomaterno?: string;
    rut: string;
    fechanacimiento?: Date;
    genero?: string;
    telefono?: string;
    email?: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clientsCollection = collection(this.firestore, 'clients');

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  getClients(): Observable<{ success: boolean; clients: Client[] }> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of({ success: false, clients: [] });
    }

    const q = query(
      this.clientsCollection, 
      where('userId', '==', currentUser.id),
      orderBy('name')
    );

    return from(getDocs(q)).pipe(
      switchMap(querySnapshot => {
        const clients: Client[] = [];
        const patientCountPromises: Promise<number>[] = [];

        querySnapshot.forEach(doc => {
          const data = doc.data();
          const client: Client = {
            id: doc.id,
            name: data['name'],
            userId: data['userId'],
            createdAt: data['createdAt']?.toDate(),
            updatedAt: data['updatedAt']?.toDate()
          };
          clients.push(client);

          // Get patient count for each client
          const patientsQuery = query(
            collection(this.firestore, 'patients'),
            where('clientId', '==', doc.id),
            where('userId', '==', currentUser.id)
          );
          patientCountPromises.push(
            getDocs(patientsQuery).then(patientSnap => patientSnap.size)
          );
        });

        return from(Promise.all(patientCountPromises)).pipe(
          map(patientCounts => {
            clients.forEach((client, index) => {
              client.patientCount = patientCounts[index];
            });
            return { success: true, clients };
          })
        );
      }),
      catchError(error => {
        console.error('Error getting clients:', error);
        return of({ success: false, clients: [] });
      })
    );
  }

  getClient(id: string): Observable<{ success: boolean; client: ClientDetail | null }> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of({ success: false, client: null });
    }

    const clientDoc = doc(this.firestore, 'clients', id);
    
    return from(getDoc(clientDoc)).pipe(
      switchMap(clientSnap => {
        if (!clientSnap.exists()) {
          return of({ success: false, client: null });
        }

        const clientData = clientSnap.data();
        
        // Verify the client belongs to the current user
        if (clientData['userId'] !== currentUser.id) {
          return of({ success: false, client: null });
        }

        // Get patients for this client
        const patientsQuery = query(
          collection(this.firestore, 'patients'),
          where('clientId', '==', id),
          where('userId', '==', currentUser.id)
        );

        return from(getDocs(patientsQuery)).pipe(
          map(patientsSnap => {
            const patients: any[] = [];
            patientsSnap.forEach(patientDoc => {
              const patientData = patientDoc.data();
              patients.push({
                id: patientDoc.id,
                nombre: patientData['nombre'],
                apellidopaterno: patientData['apellidopaterno'],
                apellidomaterno: patientData['apellidomaterno'],
                rut: patientData['rut'],
                fechanacimiento: patientData['fechanacimiento']?.toDate(),
                genero: patientData['genero'],
                telefono: patientData['telefono'],
                email: patientData['email']
              });
            });

            const clientDetail: ClientDetail = {
              id: clientSnap.id,
              name: clientData['name'],
              userId: clientData['userId'],
              createdAt: clientData['createdAt']?.toDate(),
              updatedAt: clientData['updatedAt']?.toDate(),
              patients: patients
            };

            return { success: true, client: clientDetail };
          })
        );
      }),
      catchError(error => {
        console.error('Error getting client:', error);
        return of({ success: false, client: null });
      })
    );
  }

  createClient(clientData: { name: string }): Observable<{ success: boolean; id?: string; error?: string }> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of({ success: false, error: 'User not authenticated' });
    }

    const newClient = {
      name: clientData.name,
      userId: currentUser.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    return from(addDoc(this.clientsCollection, newClient)).pipe(
      map(docRef => ({ success: true, id: docRef.id })),
      catchError(error => {
        console.error('Error creating client:', error);
        return of({ success: false, error: error.message });
      })
    );
  }

  updateClient(id: string, clientData: { name: string }): Observable<{ success: boolean; error?: string }> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of({ success: false, error: 'User not authenticated' });
    }

    const clientDoc = doc(this.firestore, 'clients', id);
    
    const updateData = {
      name: clientData.name,
      updatedAt: serverTimestamp()
    };

    return from(updateDoc(clientDoc, updateData)).pipe(
      map(() => ({ success: true })),
      catchError(error => {
        console.error('Error updating client:', error);
        return of({ success: false, error: error.message });
      })
    );
  }

  deleteClient(id: string): Observable<{ success: boolean; error?: string }> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of({ success: false, error: 'User not authenticated' });
    }

    const clientDoc = doc(this.firestore, 'clients', id);
    
    return from(deleteDoc(clientDoc)).pipe(
      map(() => ({ success: true })),
      catchError(error => {
        console.error('Error deleting client:', error);
        return of({ success: false, error: error.message });
      })
    );
  }
}