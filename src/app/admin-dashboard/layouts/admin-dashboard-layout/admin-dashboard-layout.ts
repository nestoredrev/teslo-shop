import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@/auth/services/auth.service';

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard-layout.html',
})
export class AdminDashboardLayout {

  public authService = inject(AuthService);
  public readonly user = computed( () => this.authService.user() );

  // Controla la visibilidad del menú lateral en pantallas pequeñas
  public readonly isMenuOpen = signal(false);

  public toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  public closeMenu() {
    this.isMenuOpen.set(false);
  }

}
