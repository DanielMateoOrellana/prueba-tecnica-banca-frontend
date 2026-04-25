import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Cliente } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/clientes`;

  list(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.baseUrl);
  }

  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.baseUrl, cliente);
  }

  update(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.baseUrl}/${id}`, cliente);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
