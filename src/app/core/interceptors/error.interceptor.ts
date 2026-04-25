import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message = extractMessage(err);
      notifications.error(message);
      return throwError(() => err);
    })
  );
};

function extractMessage(err: HttpErrorResponse): string {
  const body = err.error;
  if (body && typeof body === 'object') {
    if (typeof body.message === 'string') {
      const errores = Array.isArray(body.errores) ? body.errores.join(', ') : '';
      return errores ? `${body.message}: ${errores}` : body.message;
    }
  }
  if (err.status === 0) {
    return 'No se pudo contactar el servidor';
  }
  return `Error ${err.status}: ${err.statusText || 'desconocido'}`;
}
