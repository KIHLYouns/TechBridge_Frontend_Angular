import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SignInRequest } from '../../models/sign-in.model';

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
        username: this.usernameCtrl.value,
        password: this.passwordCtrl.value
      };
      
      this.authService.login(loginRequest).subscribe({
        next: () => {
          this.loadingStateSubject.next(false);
          // Navigate to dashboard
          // this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loadingStateSubject.next(false);
          this.errorMessage = error.message || 'Login failed. Please check your credentials.';
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