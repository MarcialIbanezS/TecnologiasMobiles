import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Item {
  id?: string;
  titulo: string;
  detalle?: string;
  creadoEn: string; // ISO date string instead of Firebase Timestamp
}

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.baseUrl}${environment.api.endpoints.items}`;

  listar(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

  agregar(d: { titulo: string; detalle?: string }): Observable<Item> {
    const item = {
      ...d,
      creadoEn: new Date().toISOString()
    };
    return this.http.post<Item>(this.apiUrl, item);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerPorId(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: string, d: { titulo: string; detalle?: string }): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/${id}`, d);
  }
}
