import { TipoCuenta } from './cuenta.model';
import { TipoMovimiento } from './movimiento.model';

export interface ReporteEntry {
  fecha: string;
  cliente: string;
  numeroCuenta: string;
  tipo: TipoCuenta;
  saldoInicial: number;
  estado: boolean;
  movimiento: number;
  tipoMovimiento: TipoMovimiento;
  saldoDisponible: number;
}

export interface Reporte {
  clienteId: string;
  cliente: string;
  desde: string;
  hasta: string;
  movimientos: ReporteEntry[];
  totalDebitos: number;
  totalCreditos: number;
}
