import { Routes } from '@angular/router';
import { notAuthenticatedGuard } from './auth/guards/not-authenticated.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes'),
        canMatch: [
            // canMatch: mens match with the path for the route
            notAuthenticatedGuard,
            // () => {
            //     console.log('auth route canMatch');
            // }
        ]
    },
    {
        path: '',
        loadChildren: () => import('./store-front/store-front.routes')
    }
];
