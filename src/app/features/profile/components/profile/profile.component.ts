import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ReviewService } from '../../../../core/services/review.service';
import { Review, User } from '../../../../shared/database.model';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  // Inside the class, add these properties
  isPartner$!: Observable<boolean>;
  isTogglingPartner: boolean = false;

  user: User | null = null;
  reviews: Review[] = [];
  outgoingReviews: Review[] = [];
  activeTab: string = 'info';
  activeReviewSubTab: 'incoming' | 'outgoing' = 'incoming';
  profileForm: FormGroup;
  isLoadingUser: boolean = false;
  isLoadingReviews: boolean = false;
  isLoadingOutgoingReviews: boolean = false;
  isSaving: boolean = false;
  isUpdatingLocation: boolean = false;

  locationStatus: 'idle' | 'pending' | 'granted' | 'denied' | 'error' = 'idle';
  locationErrorMessage: string | null = null;

  defaultAvatar = 'assets/images/default-avatar.png';

  constructor(
    private userService: UserService,
    private reviewService: ReviewService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
    });
  }

  ngOnInit(): void {
    this.isPartner$ = this.userService.isPartner$;
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoadingUser = true;
    this.userService
      .getCurrentUserProfile()
      .pipe(finalize(() => (this.isLoadingUser = false)))
      .subscribe({
        next: (userData) => {
          this.user = userData;
          if (this.user) {
            this.profileForm.patchValue({
              firstname: this.user.firstname,
              lastname: this.user.lastname,
              username: this.user.username,
              email: this.user.email,
              phone: this.user.phone_number,
              address: this.user.address,
            });
            this.loadUserReviews();
            this.loadOutgoingReviews();
          } else {
            console.error('Received null or undefined user data.');
          }
        },
        error: (err) => {
          console.error('Failed to load user profile:', err);
        },
      });
  }

  loadUserReviews(): void {
    const userId = this.user?.id;
    if (!userId) {
      console.warn('User ID not available for loading incoming reviews.');
      return;
    }
    this.isLoadingReviews = true;
    this.reviewService
      .getReviewsForUser(userId)
      .pipe(finalize(() => (this.isLoadingReviews = false)))
      .subscribe((reviewData) => {
        this.reviews = reviewData;
      });
  }

  loadOutgoingReviews(): void {
    const userId = this.user?.id;
    if (!userId) {
      console.warn('User ID not available for loading outgoing reviews.');
      return;
    }
    this.isLoadingOutgoingReviews = true;
    this.reviewService
      .getReviewsGivenByUser(userId)
      .pipe(finalize(() => (this.isLoadingOutgoingReviews = false)))
      .subscribe((reviewData) => {
        this.outgoingReviews = reviewData;
      });
  }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
    if (tabName === 'reviews') {
      this.activeReviewSubTab = 'incoming';
    }
  }

  setActiveReviewSubTab(subTab: 'incoming' | 'outgoing'): void {
    this.activeReviewSubTab = subTab;
  }

  saveProfileChanges(): void {
    if (this.profileForm.invalid || !this.user?.id || this.isSaving) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValues = this.profileForm.value;

    const updatedUserData: Partial<User> = {
      firstname: formValues.firstname,
      lastname: formValues.lastname,
      username: formValues.username,
      email: formValues.email,
      phone_number: formValues.phone || null,
      address: formValues.address || null,
      latitude: this.user?.latitude,
      longitude: this.user?.longitude,
    };

    this.userService
      .updateUserProfile(this.user.id, updatedUserData)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.profileForm.patchValue({
            firstname: this.user.firstname,
            lastname: this.user.lastname,
            username: this.user.username,
            email: this.user.email,
            phone: this.user.phone_number,
            address: this.user.address,
          });
          this.profileForm.markAsPristine();
          console.log('Profile updated successfully!');
        },
        error: (err) => {
          console.error('Error updating profile:', err);
        },
      });
  }

  updateLocation(): void {
    if (!('geolocation' in navigator)) {
      this.locationStatus = 'error';
      this.locationErrorMessage =
        'Geolocation is not supported by your browser.';
      return;
    }

    if (!this.user?.id) {
      this.locationStatus = 'error';
      this.locationErrorMessage = 'User not loaded. Cannot update location.';
      return;
    }

    this.isUpdatingLocation = true;
    this.locationStatus = 'pending';
    this.locationErrorMessage = null;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log('Location acquired:', coords);
        this.locationStatus = 'granted';

        const locationUpdate: Partial<User> = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        this.userService
          .updateUserProfile(this.user?.id!, locationUpdate)
          .pipe(finalize(() => (this.isUpdatingLocation = false)))
          .subscribe({
            next: (updatedUser) => {
              this.user = updatedUser;
              console.log('Location updated successfully in backend.');
            },
            error: (err) => {
              console.error('Error saving location:', err);
              this.locationStatus = 'error';
              this.locationErrorMessage =
                'Failed to save location. Please try again.';
            },
          });
      },
      (error) => {
        this.isUpdatingLocation = false;
        this.locationStatus = 'denied';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.locationErrorMessage =
              'Location access denied. Please enable it in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            this.locationErrorMessage = 'Location information is unavailable.';
            this.locationStatus = 'error';
            break;
          case error.TIMEOUT:
            this.locationErrorMessage =
              'The request to get user location timed out.';
            this.locationStatus = 'error';
            break;
          default:
            this.locationErrorMessage =
              'An unknown error occurred while getting location.';
            this.locationStatus = 'error';
            break;
        }
        console.warn('Geolocation error:', error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  editAvatar(): void {
    console.log('Edit avatar clicked - implement file upload logic.');
    alert('Avatar editing not implemented yet.');
  }

  get f() {
    return this.profileForm.controls;
  }

  togglePartnerStatus(event: any): void {
    const isChecked = event.target.checked;
    this.isTogglingPartner = true;
    
    if (isChecked) {
      this.userService.switchToPartner().pipe(
        finalize(() => this.isTogglingPartner = false)
      ).subscribe({
        next: () => console.log('Switched to partner'),
        error: (err) => console.error('Error switching to partner:', err)
      });
    } else {
      this.userService.switchToClient().pipe(
        finalize(() => this.isTogglingPartner = false)
      ).subscribe({
        next: () => console.log('Switched to client'),
        error: (err) => console.error('Error switching to client:', err)
      });
    }
  }
}
