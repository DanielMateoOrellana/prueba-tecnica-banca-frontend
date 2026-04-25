import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Cuenta } from '../../core/models/cuenta.model';
import { CuentaService } from '../../core/services/cuenta.service';
import { MovimientoService } from '../../core/services/movimiento.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-movimiento-form',
  imports: [ReactiveFormsModule],
  template: `
    <section class="card">
      <h2>Nuevo movimiento</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-grid">
          <label class="full">Cuenta
            <select formControlName="numeroCuenta">
              <option value="">-- Seleccione --</option>
              @for (c of cuentas(); track c.numeroCuenta) {
                <option [value]="c.numeroCuenta">
                  {{ c.numeroCuenta }} - {{ c.clienteNombre }} (saldo {{ c.saldoActual }})
                </option>
              }
            </select>
          </label>
          <label>Tipo
            <select formControlName="tipoMovimiento">
              <option value="DEPOSITO">Deposito</option>
              <option value="RETIRO">Retiro</option>
            </select>
          </label>
          <label>Valor
            <input type="number" step="0.01" min="0.01" formControlName="valor" />
            @if (form.controls.valor.invalid && form.controls.valor.touched) {
              <span class="error-text">Ingrese un valor positivo</span>
            }
          </label>
        </div>
        <div class="actions">
          <button type="submit" [disabled]="form.invalid || saving()">{{ saving() ? 'Procesando...' : 'Registrar' }}</button>
          <button type="button" class="secondary" (click)="cancelar()">Cancelar</button>
        </div>
      </form>
    </section>
  `
})
export class MovimientoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly cuentaService = inject(CuentaService);
  private readonly movimientoService = inject(MovimientoService);
  private readonly notifications = inject(NotificationService);

  protected readonly cuentas = signal<Cuenta[]>([]);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    numeroCuenta: ['', Validators.required],
    tipoMovimiento: ['DEPOSITO' as 'DEPOSITO' | 'RETIRO', Validators.required],
    valor: [0, [Validators.required, Validators.min(0.01)]]
  });

  ngOnInit() {
    this.cuentaService.list().subscribe(list => this.cuentas.set(list));
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.movimientoService.registrar(this.form.getRawValue()).subscribe({
      next: () => {
        this.notifications.success('Movimiento registrado');
        this.router.navigate(['/movimientos']);
      },
      error: () => this.saving.set(false)
    });
  }

  cancelar() {
    this.router.navigate(['/movimientos']);
  }
}
