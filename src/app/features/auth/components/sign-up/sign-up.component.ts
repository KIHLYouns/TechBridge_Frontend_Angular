import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { confirmEqualValidator } from '../../validators/confirm-equal.validator';
import { UserCoordinates } from '../../models/sign-up.model';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  // form groups
  mainForm!: FormGroup; // the entire form group

  // form controls
  firstnameCtrl!: FormControl;
  lastnameCtrl!: FormControl;
  usernameCtrl!: FormControl;
  emailCtrl!: FormControl;
  phoneCtrl!: FormControl;
  passwordCtrl!: FormControl;
  confirmPasswordCtrl!: FormControl;
  becomePartnerCtrl!: FormControl;
  termsGeneralCtrl!: FormControl;
  termsPartnerCtrl!: FormControl;

  // UI state
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  // Location data
  userCoordinates: UserCoordinates | null = null;
  locationStatus: 'pending' | 'granted' | 'denied' | 'error' = 'pending';
  locationErrorMessage = '';

  // Observables for UI state
  showConfirmPasswordError$!: Observable<boolean>;

  // BehaviorSubjects for button states
  private loadingStateSubject = new BehaviorSubject<boolean>(false);
  loadingState$ = this.loadingStateSubject.asObservable();

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.initObservables();
    this.setupPartnerToggle();

    // Check if geolocation is available in the browser
    if ('geolocation' in navigator) {
      this.locationStatus = 'pending';
    } else {
      this.locationStatus = 'error';
      this.locationErrorMessage =
        'Geolocation is not supported by your browser';
    }

    // Auto request location when component loads
    setTimeout(() => {
      this.requestLocationPermission();
    }, 1000);
  }

  private initFormControls(): void {
    this.firstnameCtrl = this.fb.control('', [
      Validators.required,
      Validators.minLength(2),
    ]);

    this.lastnameCtrl = this.fb.control('', [
      Validators.required,
      Validators.minLength(2),
    ]);

    this.usernameCtrl = this.fb.control('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z0-9_-]*$'),
    ]);

    this.emailCtrl = this.fb.control('', [
      Validators.required,
      Validators.email,
    ]);

    this.phoneCtrl = this.fb.control('', [
      Validators.required,
      Validators.pattern('^[0-9]{10}$'),
    ]);

    this.passwordCtrl = this.fb.control('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
      ),
    ]);

    this.confirmPasswordCtrl = this.fb.control('', [Validators.required]);

    this.becomePartnerCtrl = this.fb.control(false);

    this.termsGeneralCtrl = this.fb.control(false, [Validators.requiredTrue]);

    this.termsPartnerCtrl = this.fb.control(false);
  }

  private initMainForm(): void {
    this.mainForm = this.fb.group(
      {
        firstname: this.firstnameCtrl,
        lastname: this.lastnameCtrl,
        username: this.usernameCtrl,
        email: this.emailCtrl,
        phone: this.phoneCtrl,
        password: this.passwordCtrl,
        confirmPassword: this.confirmPasswordCtrl,
        becomePartner: this.becomePartnerCtrl,
        termsGeneral: this.termsGeneralCtrl,
        termsPartner: this.termsPartnerCtrl,
      },
      {
        validators: [confirmEqualValidator('password', 'confirmPassword')],
      }
    );
  }

  private initObservables(): void {
    // Show password mismatch error when both password fields have values but don't match
    this.showConfirmPasswordError$ = this.mainForm.statusChanges.pipe(
      map(
        (status) =>
          status === 'INVALID' &&
          this.passwordCtrl.value &&
          this.confirmPasswordCtrl.value &&
          this.mainForm.hasError('confirmEqual')
      )
    );

    // Update partner terms validation based on becomePartner selection
    this.becomePartnerCtrl.valueChanges.subscribe((isPartner) => {
      if (isPartner) {
        this.termsPartnerCtrl.setValidators([Validators.requiredTrue]);
      } else {
        this.termsPartnerCtrl.clearValidators();
      }
      this.termsPartnerCtrl.updateValueAndValidity();
    });
  }

  private setupPartnerToggle(): void {
    // Add listener to toggle partner details section visibility
    this.becomePartnerCtrl.valueChanges.subscribe((isPartner) => {
      const partnerDetails = document.getElementById('partner-details');
      const partnerTerms = document.getElementById('partner-terms');

      if (partnerDetails) {
        partnerDetails.style.display = isPartner ? 'block' : 'none';
      }

      if (partnerTerms) {
        partnerTerms.style.display = isPartner ? 'block' : 'none';
      }
    });
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Request permission and get the user's current location
   */
  public requestLocationPermission(): void {
    if (this.locationStatus === 'granted') {
      return; // Already have permission
    }

    if ('geolocation' in navigator) {
      this.locationStatus = 'pending';

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success callback
          this.userCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          this.locationStatus = 'granted';
          console.log('Location access granted', this.userCoordinates);
        },
        (error) => {
          // Error callback
          this.locationStatus = 'denied';
          console.warn('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }

  public isLocationValid(): boolean {
    return this.locationStatus === 'granted' && !!this.userCoordinates;
  }

  public onSignUp(): void {
    if (this.mainForm.valid) {
      // Near the beginning of onSignUp():
      if (this.locationStatus !== 'granted' || !this.userCoordinates) {
        this.errorMessage = 'Location permission is required';
        this.requestLocationPermission();
        return;
      }
      this.loadingStateSubject.next(true);
      this.errorMessage = '';

      const signUpRequest = {
        firstName: this.firstnameCtrl.value,
        lastName: this.lastnameCtrl.value,
        username: this.usernameCtrl.value,
        email: this.emailCtrl.value,
        phone: this.phoneCtrl.value,
        coordinates: this.userCoordinates,
        password: this.passwordCtrl.value,
        isPartner: this.becomePartnerCtrl.value,
      };
      console.log(signUpRequest);

      this.authService.signUp(signUpRequest).subscribe({
        next: (response) => {
          // Handle successful registration
          console.log('Registration successful', response);
          this.loadingStateSubject.next(false);

          // this.router.navigate(['/home']);
        },
        error: (error) => {
          // Handle registration error
          console.error('Registration failed', error);
          this.loadingStateSubject.next(false);
          this.errorMessage =
            error.message || 'Registration failed. Please try again.';
        },
      });
    } else {
      this.markFormGroupTouched(this.mainForm);
    }
  }

  public getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength']?.requiredLength} characters`;
    }
    if (control.hasError('maxlength')) {
      return `Maximum length is ${control.errors?.['maxlength']?.requiredLength} characters`;
    }
    if (control.hasError('pattern')) {
      if (control === this.passwordCtrl) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
      }
      if (control === this.phoneCtrl) {
        return 'Phone number must be 10 digits';
      }
      if (control === this.usernameCtrl) {
        return 'Username can only contain letters, numbers, underscores and hyphens';
      }
    }
    if (control.hasError('requiredTrue')) {
      return 'You must accept the terms and conditions';
    }
    return '';
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
