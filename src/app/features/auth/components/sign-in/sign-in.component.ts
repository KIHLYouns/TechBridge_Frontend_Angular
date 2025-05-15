import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SignInRequest } from '../../models/sign-in.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: false,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {
  // Form group
  loginForm!: FormGroup;
  
  // Form controls
  usernameCtrl!: FormControl;
  passwordCtrl!: FormControl;
  
  // UI state
  showPassword = false;
  errorMessage = '';
  
  // Loading state
  private loadingStateSubject = new BehaviorSubject<boolean>(false);
  loadingState$ = this.loadingStateSubject.asObservable();
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.initFormControls();
    this.initForm();
  }
  
  private initFormControls(): void {
    this.usernameCtrl = this.fb.control('', [
      Validators.required
    ]);
    
    this.passwordCtrl = this.fb.control('', [
      Validators.required
    ]);
    
  }
  
  private initForm(): void {
    this.loginForm = this.fb.group({
      username: this.usernameCtrl,
      password: this.passwordCtrl
    });
  }
  
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  public onSubmit(): void {
    if (this.loginForm.valid) {
      this.loadingStateSubject.next(true);
      this.errorMessage = '';
      
      const loginRequest: SignInRequest = {
        email: this.usernameCtrl.value,
        password: this.passwordCtrl.value
      };
      
      this.authService.login(loginRequest).subscribe({
        next: () => {
          this.loadingStateSubject.next(false);
        },
        error: (error) => {
          this.loadingStateSubject.next(false);
          
          // Amélioration de la gestion des erreurs
          if (error.error && error.error.message) {
            // Format d'erreur Laravel/API
            this.errorMessage = error.error.message;
          } else if (error.error && typeof error.error === 'string') {
            // Erreur sous forme de texte simple
            this.errorMessage = error.error;
          } else if (error.message) {
            // Message d'erreur standard
            this.errorMessage = error.message;
          } else {
            // Message par défaut
            this.errorMessage = 'Échec de connexion. Veuillez vérifier vos identifiants.';
          }
          
          console.log('Error details:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }
  
  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}