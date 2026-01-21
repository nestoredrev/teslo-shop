import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import storeFrontRoutes from '../../store-front.routes';
import { AuthService } from '@/auth/services/auth.service';


@Component({
  selector: 'front-store-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-store-navbar.html',
})
export class FrontStoreNavbar {

  public router = inject(Router);
  public authService = inject(AuthService);
  public routes = storeFrontRoutes
  .flatMap(route => route.children || [])
  .filter(route => route.path !== '**')
  .map(route => ({
    path: route.path,
    title: route.title
  }));


}
