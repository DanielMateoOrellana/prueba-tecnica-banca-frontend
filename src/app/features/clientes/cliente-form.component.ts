import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Genero } from '../../core/models/cliente.model';
import { ClienteService } from '../../core/services/cliente.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-cliente-form',
  imports: [ReactiveFormsModule],
  template: `
    <section class="card">
      <h2>{{ id() ? 'Editar' : 'Nuevo' }} cliente</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-grid">
          <label>Nombre
            <input formControlName="nombre" />
            @if (showError('nombre')) { <span class="error-text">Nombre obligatorio</span> }
          </label>
          <label>Genero
            <select formControlName="genero">
              <option value="MASCULINO">Masculino</option>
              <option value="FEMENINO">Femenino</option>
              <option value="OTRO">Otro</option>
            </select>
          </label>
          <label>Edad
            <input type="number" formControlName="edad" />
          </label>
          <label>Identificacion
            <input formControlName="identificacion" />
          </label>
          <label class="full">Direccion
            <input formControlName="direccion" />
          </label>
          <label>Telefono
            <input formControlName="telefono" />
          </label>
          <label>ClienteId
            <input formControlName="clienteId" />
          </label>
          <label>Contrasena
            <input type="password" formControlName="contrasena" />
            @if (id()) { <small>Dejar en blanco para mantener actual</small> }
          </label>
          <label>Estado
            <select formControlName="estado">
              <option [ngValue]="true">Activo</option>
              <option [ngValue]="false">Inactivo</option>
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
export class ClienteFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clienteService = inject(ClienteService);
  private readonly notifications = inject(NotificationService);

  protected readonly id = signal<number | null>(null);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    genero: ['MASCULINO' as Genero, Validators.required],
    edad: [18, [Validators.required, Validators.min(0)]],
    identificacion: ['', Validators.required],
    direccion: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern(/^[+0-9\-\s]{6,30}$/)]],
    clienteId: ['', Validators.required],
    contrasena: ['', Validators.required],
    estado: [true, Validators.required]
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.id.set(id);
      this.form.controls.contrasena.removeValidators(Validators.required);
      this.form.controls.contrasena.updateValueAndValidity();
      this.clienteService.getById(id).subscribe(cliente => {
        this.form.patchValue({
          nombre: cliente.nombre,
          genero: cliente.genero,
          edad: cliente.edad,
          identificacion: cliente.identificacion,
          direccion: cliente.direccion,
          telefono: cliente.telefono,
          clienteId: cliente.clienteId,
          contrasena: '',
          estado: cliente.estado
        });
      });
    }
  }

  showError(name: keyof typeof this.form.controls): boolean {
    const ctrl = this.form.controls[name];
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const value = this.form.getRawValue();
    const payload = { ...value };
    if (this.id() && !payload.contrasena) {
      delete (payload as { contrasena?: string }).contrasena;
    }
    const id = this.id();
    const obs = id
      ? this.clienteService.update(id, payload as never)
      : this.clienteService.create(payload as never);
    obs.subscribe({
      next: () => {
        this.notifications.success(id ? 'Cliente actualizado' : 'Cliente creado');
        this.router.navigate(['/clientes']);
      },
      error: () => this.saving.set(false)
    });
  }

  cancelar() {
    this.router.navigate(['/clientes']);
  }
}
