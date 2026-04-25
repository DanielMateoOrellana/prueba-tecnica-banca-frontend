import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'clientes' },
  {
    path: 'clientes',
    loadComponent: () =>
      import('./features/clientes/clientes-list.component').then(m => m.ClientesListComponent)
  },
  {
    path: 'clientes/nuevo',
    loadComponent: () =>
      import('./features/clientes/cliente-form.component').then(m => m.ClienteFormComponent)
  },
  {
    path: 'clientes/:id/editar',
    loadComponent: () =>
      import('./features/clientes/cliente-form.component').then(m => m.ClienteFormComponent)
  },
  {
    path: 'cuentas',
    loadComponent: () =>
      import('./features/cuentas/cuentas-list.component').then(m => m.CuentasListComponent)
  },
  {
    path: 'cuentas/nueva',
    loadComponent: () =>
      import('./features/cuentas/cuenta-form.component').then(m => m.CuentaFormComponent)
  },
  {
    path: 'cuentas/:numeroCuenta/editar',
    loadComponent: () =>
      import('./features/cuentas/cuenta-form.component').then(m => m.CuentaFormComponent)
  },
  {
    path: 'movimientos',
    loadComponent: () =>
      import('./features/movimientos/movimientos-list.component').then(m => m.MovimientosListComponent)
  },
  {
    path: 'movimientos/nuevo',
    loadComponent: () =>
      import('./features/movimientos/movimiento-form.component').then(m => m.MovimientoFormComponent)
  },
  {
    path: 'reportes',
    loadComponent: () =>
      import('./features/reportes/reportes.component').then(m => m.ReportesComponent)
  },
  { path: '**', redirectTo: 'clientes' }
];
