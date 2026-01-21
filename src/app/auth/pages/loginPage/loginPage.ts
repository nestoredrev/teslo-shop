import { Component, inject, signal, DestroyRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@/auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './loginPage.html',
})
export class LoginPage {

  private router = inject(Router)
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  public readonly hasError = signal(false);
  public readonly isPosting = signal(false);

  public loginForm = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    password: ['',[Validators.required, Validators.minLength(6)]]
  });

  loginSubmit(){
    if(this.loginForm.invalid) {
      this.hasError.set(true);
      this.loginForm.markAllAsTouched();
      return;
    }
    this.hasError.set(false); 
    const { email, password } = this.loginForm.value;
      this.isPosting.set(true);
  
    this.authService.login(email!, password!)
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe({
      next: (isAuthenticated) => {
        this.isPosting.set(false);
        if(isAuthenticated) {
          this.router.navigateByUrl('/');
          return;
        }
        this.hasError.set(true);

      },
      error: (error) => {
        this.isPosting.set(false);
        this.hasError.set(true);
      }
    });
  }

}
