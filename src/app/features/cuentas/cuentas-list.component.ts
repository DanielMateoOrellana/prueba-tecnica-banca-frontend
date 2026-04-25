import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Cuenta } from '../../core/models/cuenta.model';
import { CuentaService } from '../../core/services/cuenta.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-cuentas-list',
  imports: [RouterLink, DecimalPipe],
  template: `
    <section class="card">
      <div class="toolbar">
        <h2>Cuentas</h2>
        <a routerLink="/cuentas/nueva"><button>Nueva cuenta</button></a>
      </div>

      @if (loading()) {
        <p>Cargando...</p>
      } @else if (cuentas().length === 0) {
        <p>No hay cuentas registradas.</p>
      } @else {
        <table>
          <thead>
            <tr>
              <th>Numero</th>
              <th>Tipo</th>
              <th>Saldo inicial</th>
              <th>Saldo actual</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (c of cuentas(); track c.numeroCuenta) {
              <tr>
                <td>{{ c.numeroCuenta }}</td>
                <td>{{ c.tipoCuenta }}</td>
                <td>{{ c.saldoInicial | number:'1.2-2' }}</td>
                <td>{{ c.saldoActual | number:'1.2-2' }}</td>
                <td>{{ c.clienteNombre }} ({{ c.clienteId }})</td>
                <td>{{ c.estado ? 'Activa' : 'Inactiva' }}</td>
                <td class="row-actions">
                  <a [routerLink]="['/cuentas', c.numeroCuenta, 'editar']"><button class="secondary">Editar</button></a>
                  <button class="danger" (click)="eliminar(c)">Eliminar</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  `
})
export class CuentasListComponent implements OnInit {
  private readonly cuentaService = inject(CuentaService);
  private readonly notifications = inject(NotificationService);

  protected readonly cuentas = signal<Cuenta[]>([]);
  protected readonly loading = signal(false);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading.set(true);
    this.cuentaService.list().subscribe({
      next: list => {
        this.cuentas.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  eliminar(cuenta: Cuenta) {
    if (!confirm(`Eliminar cuenta ${cuenta.numeroCuenta}?`)) return;
    this.cuentaService.delete(cuenta.numeroCuenta).subscribe({
      next: () => {
        this.notifications.success('Cuenta eliminada');
        this.cargar();
      }
    });
  }
}
