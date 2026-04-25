import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Movimiento } from '../models/movimiento.model';

@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/movimientos`;

  list(numeroCuenta?: string): Observable<Movimiento[]> {
    let params = new HttpParams();
    if (numeroCuenta) {
      params = params.set('numeroCuenta', numeroCuenta);
    }
    return this.http.get<Movimiento[]>(this.baseUrl, { params });
  }

  registrar(movimiento: Movimiento): Observable<Movimiento> {
    return this.http.post<Movimiento>(this.baseUrl, movimiento);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
