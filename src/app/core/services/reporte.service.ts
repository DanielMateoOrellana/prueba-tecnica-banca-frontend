import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Reporte } from '../models/reporte.model';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/reportes`;

  generar(clienteId: string, desde: string, hasta: string): Observable<Reporte> {
    const params = new HttpParams()
      .set('clienteId', clienteId)
      .set('desde', desde)
      .set('hasta', hasta);
    return this.http.get<Reporte>(this.baseUrl, { params });
  }
}
