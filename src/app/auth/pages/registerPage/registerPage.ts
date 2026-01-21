import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from "@angular/router";
import { AuthService } from '@/auth/services/auth.service';
import { FormUtils } from '@/utils/form-utils';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registerPage.html',
})
export class RegisterPage {

  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);
  public readonly hasSuccess = signal(false);
  public readonly hasError = signal(false);
  public readonly errorMessage = signal('');
  public formUtils = FormUtils;

  public registerForm = this.fb.group({
    email: ['',
      [
        Validators.required,
        Validators.pattern(this.formUtils.emailPattern)
      ]
    ],
    password: ['',[Validators.required, Validators.minLength(6)]],
    password2: ['',Validators.required],
    fullName: ['',
      [
        Validators.required, 
        Validators.pattern(this.formUtils.namePattern)
      ]
    ],
  },{
    validators: [this.formUtils.sameFields('password','password2')]
  });

  registerSubmit(){

    this.hasError.set(false);
    this.hasSuccess.set(false);
    this.errorMessage.set('');

    if(this.registerForm.invalid) {
        this.registerForm.markAllAsTouched();
        return;
    }

    const { email, password, fullName } = this.registerForm.value;
    this.authService.register(email!, password!, fullName!)
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe({
      next: (resp) => {
        this.hasSuccess.set(true);
      },
      error: (error) => {
        const errorMessage = error || 'Registration failed. Please try again.';
        this.errorMessage.set(errorMessage);
        this.hasError.set(true);
      }
    });



  }
}
