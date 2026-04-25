export type TipoCuenta = 'AHORRO' | 'CORRIENTE';

export interface Cuenta {
  numeroCuenta: string;
  tipoCuenta: TipoCuenta;
  saldoInicial: number;
  saldoActual?: number;
  estado: boolean;
  clienteId: string;
  clienteNombre?: string;
}
