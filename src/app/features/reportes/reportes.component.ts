import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Cliente } from '../../core/models/cliente.model';
import { Reporte } from '../../core/models/reporte.model';
import { ClienteService } from '../../core/services/cliente.service';
import { ReporteService } from '../../core/services/reporte.service';

@Component({
  selector: 'app-reportes',
  imports: [ReactiveFormsModule, DecimalPipe, DatePipe],
  template: `
    <section class="card">
      <h2>Reporte de estado de cuenta</h2>
      <form [formGroup]="form" (ngSubmit)="generar()">
        <div class="form-grid">
          <label>Cliente
            <select formControlName="clienteId">
              <option value="">-- Seleccione --</option>
              @for (c of clientes(); track c.id) {
                <option [value]="c.clienteId">{{ c.nombre }} ({{ c.clienteId }})</option>
              }
            </select>
          </label>
          <label>Desde
            <input type="date" formControlName="desde" />
          </label>
          <label>Hasta
            <input type="date" formControlName="hasta" />
          </label>
        </div>
        <div class="actions">
          <button type="submit" [disabled]="form.invalid || loading()">{{ loading() ? 'Cargando...' : 'Generar reporte' }}</button>
        </div>
      </form>
    </section>

    @if (reporte(); as r) {
      <section class="card" style="margin-top: 1rem;">
        <h3>Cliente: {{ r.cliente }}</h3>
        <p>Periodo: {{ r.desde }} al {{ r.hasta }}</p>

        @if (r.movimientos.length === 0) {
          <p>No hay movimientos en el rango.</p>
        } @else {
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cuenta</th>
                <th>Tipo</th>
                <th>Saldo inicial</th>
                <th>Estado</th>
                <th>Movimiento</th>
                <th>Saldo disponible</th>
              </tr>
            </thead>
            <tbody>
              @for (m of r.movimientos; track $index) {
                <tr>
                  <td>{{ m.fecha | date:'short' }}</td>
                  <td>{{ m.numeroCuenta }}</td>
                  <td>{{ m.tipo }}</td>
                  <td>{{ m.saldoInicial | number:'1.2-2' }}</td>
                  <td>{{ m.estado ? 'Activa' : 'Inactiva' }}</td>
                  <td>{{ m.movimiento | number:'1.2-2' }} ({{ m.tipoMovimiento }})</td>
                  <td>{{ m.saldoDisponible | number:'1.2-2' }}</td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr>
                <th colspan="5" style="text-align: right;">Total creditos:</th>
                <td colspan="2">{{ r.totalCreditos | number:'1.2-2' }}</td>
              </tr>
              <tr>
                <th colspan="5" style="text-align: right;">Total debitos:</th>
                <td colspan="2">{{ r.totalDebitos | number:'1.2-2' }}</td>
              </tr>
            </tfoot>
          </table>
        }
      </section>
    }
  `
})
export class ReportesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly clienteService = inject(ClienteService);
  private readonly reporteService = inject(ReporteService);

  protected readonly clientes = signal<Cliente[]>([]);
  protected readonly reporte = signal<Reporte | null>(null);
  protected readonly loading = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    clienteId: ['', Validators.required],
    desde: ['', Validators.required],
    hasta: ['', Validators.required]
  });

  ngOnInit() {
    this.clienteService.list().subscribe(list => this.clientes.set(list));
  }

  generar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const { clienteId, desde, hasta } = this.form.getRawValue();
    this.reporteService.generar(clienteId, desde, hasta).subscribe({
      next: r => {
        this.reporte.set(r);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
