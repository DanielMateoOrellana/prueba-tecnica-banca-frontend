import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Cliente } from '../../core/models/cliente.model';
import { ClienteService } from '../../core/services/cliente.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-clientes-list',
  imports: [RouterLink],
  template: `
    <section class="card">
      <div class="toolbar">
        <h2>Clientes</h2>
        <a routerLink="/clientes/nuevo"><button>Nuevo cliente</button></a>
      </div>

      @if (loading()) {
        <p>Cargando...</p>
      } @else if (clientes().length === 0) {
        <p>No hay clientes registrados.</p>
      } @else {
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Identificacion</th>
              <th>ClienteId</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (c of clientes(); track c.id) {
              <tr>
                <td>{{ c.id }}</td>
                <td>{{ c.nombre }}</td>
                <td>{{ c.identificacion }}</td>
                <td>{{ c.clienteId }}</td>
                <td>{{ c.estado ? 'Activo' : 'Inactivo' }}</td>
                <td class="row-actions">
                  <a [routerLink]="['/clientes', c.id, 'editar']"><button class="secondary">Editar</button></a>
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
export class ClientesListComponent implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly notifications = inject(NotificationService);

  protected readonly clientes = signal<Cliente[]>([]);
  protected readonly loading = signal<boolean>(false);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading.set(true);
    this.clienteService.list().subscribe({
      next: list => {
        this.clientes.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  eliminar(cliente: Cliente) {
    if (!cliente.id) return;
    if (!confirm(`Eliminar al cliente ${cliente.nombre}?`)) return;
    this.clienteService.delete(cliente.id).subscribe({
      next: () => {
        this.notifications.success('Cliente eliminado');
        this.cargar();
      }
    });
  }
}
