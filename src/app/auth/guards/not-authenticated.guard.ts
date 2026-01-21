import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const notAuthenticatedGuard: CanMatchFn = async (route, segments) => {
  
  const authService = inject( AuthService );
  const router = inject( Router );

  // FirstValueFrom espera a que el observable emita su primer valor y luego se completa
  const isAuthenticated = await firstValueFrom( authService.checkAuthStatus() );
  if( isAuthenticated ) {
    // Si está autenticado, redirigir al usuario a la página principal
    await router.navigateByUrl('/');
    return false;
  }
  
  return true;
};
