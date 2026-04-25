export type TipoMovimiento = 'DEPOSITO' | 'RETIRO';

export interface Movimiento {
  id?: number;
  fecha?: string;
  tipoMovimiento: TipoMovimiento;
  valor: number;
  saldo?: number;
  numeroCuenta: string;
}
