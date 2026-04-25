export type Genero = 'MASCULINO' | 'FEMENINO' | 'OTRO';

export interface Cliente {
  id?: number;
  nombre: string;
  genero: Genero;
  edad: number;
  identificacion: string;
  direccion: string;
  telefono: string;
  clienteId: string;
  contrasena?: string;
  estado: boolean;
}
