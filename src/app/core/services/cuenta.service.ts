import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Cuenta } from '../models/cuenta.model';

@Injectable({ providedIn: 'root' })
export class CuentaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/cuentas`;

  list(clienteId?: string): Observable<Cuenta[]> {
    let params = new HttpParams();
    if (clienteId) {
      params = params.set('clienteId', clienteId);
    }
    return this.http.get<Cuenta[]>(this.baseUrl, { params });
  }

  getByNumero(numeroCuenta: string): Observable<Cuenta> {
    return this.http.get<Cuenta>(`${this.baseUrl}/${numeroCuenta}`);
  }

  create(cuenta: Cuenta): Observable<Cuenta> {
    return this.http.post<Cuenta>(this.baseUrl, cuenta);
  }

  update(numeroCuenta: string, cuenta: Cuenta): Observable<Cuenta> {
    return this.http.put<Cuenta>(`${this.baseUrl}/${numeroCuenta}`, cuenta);
  }

  delete(numeroCuenta: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${numeroCuenta}`);
  }
}
