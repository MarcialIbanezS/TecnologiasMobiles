import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Client {
  idcliente: number;
  cliente: string;
  patientCount?: number;
}

export interface ClientDetail extends Client {
  patients: Array<{
    idpaciente: number;
    nombre: string;
    apellidopaterno: string;
    apellidomaterno?: string;
    rut: string;
    fechanacimiento?: string;
    genero?: string;
    telefono?: string;
    email?: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getClients(): Observable<{ success: boolean; clients: Client[] }> {
    return this.http.get<{ success: boolean; clients: Client[] }>(
      this.apiUrl,
      this.authService.getHttpOptions()
    );
  }

  getClient(id: number): Observable<{ success: boolean; client: ClientDetail }> {
    return this.http.get<{ success: boolean; client: ClientDetail }>(
      `${this.apiUrl}/${id}`,
      this.authService.getHttpOptions()
    );
  }

  createClient(client: { cliente: string }): Observable<any> {
    return this.http.post(
      this.apiUrl,
      client,
      this.authService.getHttpOptions()
    );
  }

  updateClient(id: number, client: { cliente: string }): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      client,
      this.authService.getHttpOptions()
    );
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      this.authService.getHttpOptions()
    );
  }
}