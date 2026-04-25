import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Cuenta } from '../../core/models/cuenta.model';
import { Movimiento } from '../../core/models/movimiento.model';
import { CuentaService } from '../../core/services/cuenta.service';
import { MovimientoService } from '../../core/services/movimiento.service';

@Component({
  selector: 'app-movimientos-list',
  imports: [RouterLink, FormsModule, DecimalPipe, DatePipe],
  template: `
    <section class="card">
      <div class="toolbar">
        <h2>Movimientos</h2>
        <a routerLink="/movimientos/nuevo"><button>Nuevo movimiento</button></a>
      </div>

      <div class="form-grid" style="grid-template-columns: 1fr auto;">
        <label>Filtrar por cuenta
          <select [(ngModel)]="numeroCuentaFiltro" (ngModelChange)="cargar()">
            <option value="">Todas</option>
            @for (c of cuentas(); track c.numeroCuenta) {
              <option [value]="c.numeroCuenta">{{ c.numeroCuenta }} - {{ c.clienteNombre }}</option>
            }
          </select>
        </label>
      </div>

      @if (loading()) {
        <p>Cargando...</p>
      } @else if (movimientos().length === 0) {
        <p>No hay movimientos.</p>
      } @else {
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Fecha</th>
              <th>Cuenta</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            @for (m of movimientos(); track m.id) {
              <tr>
                <td>{{ m.id }}</td>
                <td>{{ m.fecha | date:'short' }}</td>
                <td>{{ m.numeroCuenta }}</td>
                <td>{{ m.tipoMovimiento }}</td>
                <td>{{ m.valor | number:'1.2-2' }}</td>
                <td>{{ m.saldo | number:'1.2-2' }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  `
})
export class MovimientosListComponent implements OnInit {
  private readonly movimientoService = inject(MovimientoService);
  private readonly cuentaService = inject(CuentaService);

  protected readonly movimientos = signal<Movimiento[]>([]);
  protected readonly cuentas = signal<Cuenta[]>([]);
  protected readonly loading = signal(false);
  protected numeroCuentaFiltro = '';

  ngOnInit() {
    this.cuentaService.list().subscribe(list => this.cuentas.set(list));
    this.cargar();
  }

  cargar() {
    this.loading.set(true);
    this.movimientoService.list(this.numeroCuentaFiltro || undefined).subscribe({
      next: list => {
        this.movimientos.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
