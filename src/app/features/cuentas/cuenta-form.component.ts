import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Cliente } from '../../core/models/cliente.model';
import { TipoCuenta } from '../../core/models/cuenta.model';
import { ClienteService } from '../../core/services/cliente.service';
import { CuentaService } from '../../core/services/cuenta.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-cuenta-form',
  imports: [ReactiveFormsModule],
  template: `
    <section class="card">
      <h2>{{ numeroCuenta() ? 'Editar' : 'Nueva' }} cuenta</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-grid">
          <label>Numero de cuenta
            <input formControlName="numeroCuenta" [readonly]="!!numeroCuenta()" />
          </label>
          <label>Tipo
            <select formControlName="tipoCuenta">
              <option value="AHORRO">Ahorro</option>
              <option value="CORRIENTE">Corriente</option>
            </select>
          </label>
          <label>Saldo inicial
            <input type="number" step="0.01" formControlName="saldoInicial" [readonly]="!!numeroCuenta()" />
          </label>
          <label>Estado
            <select formControlName="estado">
              <option [ngValue]="true">Activa</option>
              <option [ngValue]="false">Inactiva</option>
            </select>
          </label>
          <label class="full">Cliente
            <select formControlName="clienteId">
              <option value="">-- Seleccione --</option>
              @for (c of clientes(); track c.id) {
                <option [value]="c.clienteId">{{ c.nombre }} ({{ c.clienteId }})</option>
              }
            </select>
          </label>
        </div>
        <div class="actions">
          <button type="submit" [disabled]="form.invalid || saving()">{{ saving() ? 'Guardando...' : 'Guardar' }}</button>
          <button type="button" class="secondary" (click)="cancelar()">Cancelar</button>
        </div>
      </form>
    </section>
  `
})
export class CuentaFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cuentaService = inject(CuentaService);
  private readonly clienteService = inject(ClienteService);
  private readonly notifications = inject(NotificationService);

  protected readonly numeroCuenta = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly clientes = signal<Cliente[]>([]);

  protected readonly form = this.fb.nonNullable.group({
    numeroCuenta: ['', Validators.required],
    tipoCuenta: ['AHORRO' as TipoCuenta, Validators.required],
    saldoInicial: [0, [Validators.required, Validators.min(0)]],
    estado: [true, Validators.required],
    clienteId: ['', Validators.required]
  });

  ngOnInit() {
    this.clienteService.list().subscribe(list => this.clientes.set(list));
    const param = this.route.snapshot.paramMap.get('numeroCuenta');
    if (param) {
      this.numeroCuenta.set(param);
      this.cuentaService.getByNumero(param).subscribe(cuenta => {
        this.form.patchValue({
          numeroCuenta: cuenta.numeroCuenta,
          tipoCuenta: cuenta.tipoCuenta,
          saldoInicial: cuenta.saldoInicial,
          estado: cuenta.estado,
          clienteId: cuenta.clienteId
        });
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const value = this.form.getRawValue();
    const numero = this.numeroCuenta();
    const obs = numero
      ? this.cuentaService.update(numero, value)
      : this.cuentaService.create(value);
    obs.subscribe({
      next: () => {
        this.notifications.success(numero ? 'Cuenta actualizada' : 'Cuenta creada');
        this.router.navigate(['/cuentas']);
      },
      error: () => this.saving.set(false)
    });
  }

  cancelar() {
    this.router.navigate(['/cuentas']);
  }
}
