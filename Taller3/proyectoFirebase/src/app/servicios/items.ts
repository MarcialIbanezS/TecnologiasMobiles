import { Injectable } from '@angular/core';
import {
  Firestore, collection, collectionData, addDoc,
  doc, deleteDoc, Timestamp, query, orderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Item {
  id?: string;
  titulo: string;
  detalle?: string;
  creadoEn: Timestamp;
}

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private ref = collection(this.firestore, 'items');
  constructor(private firestore: Firestore) {}

  listar(): Observable<Item[]> {
    const q = query(this.ref, orderBy('creadoEn', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Item[]>;
  }

  agregar(d: { titulo: string; detalle?: string }) {
    return addDoc(this.ref, { ...d, creadoEn: Timestamp.now() } as Item);
  }

  eliminar(id: string) {
    return deleteDoc(doc(this.firestore, `items/${id}`));
  }
}
