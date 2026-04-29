import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { fetchAuthSession } from 'aws-amplify/auth';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Haetaan token Amplify-sessioista
  return from(fetchAuthSession()).pipe(
    switchMap((session) => {
      const token = session.tokens?.idToken?.toString();

      if (token) {
        // Kloonataan pyyntö ja lisätään header
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next(authReq);
      }

      return next(req); // Jos ei tokenia, jatketaan alkuperäisellä
    }),
  );
};
