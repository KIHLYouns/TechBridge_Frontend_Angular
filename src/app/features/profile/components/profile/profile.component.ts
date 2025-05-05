import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ReviewService } from '../../../../core/services/review.service';
import { Review, User } from '../../../../shared/database.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  isPartnerInterface: boolean = false;
  isBecomingPartner: boolean = false;
  user: User | null = null;
  reviews: Review[] = [];
  outgoingReviews: Review[] = [];
  activeTab: string = 'info';
  activeReviewSubTab: 'incoming' | 'outgoing' = 'incoming';
  profileForm: FormGroup;
  isLoadingUser: boolean = false;
  isLoadingIncomingReviews: boolean = false;
  isLoadingOutgoingReviews: boolean = false;
  isSaving: boolean = false;
  isUpdatingLocation: boolean = false;

  locationStatus: 'idle' | 'pending' | 'granted' | 'denied' | 'error' = 'idle';
  locationErrorMessage: string | null = null;

  defaultAvatar = 'assets/images/default-avatar.png';
  private destroy$ = new Subject<void>();

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
      isPartner: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.userService.isPartnerInterface$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isPartnerInterface) => {
        this.isPartnerInterface = isPartnerInterface;
        console.log(
          'ProfileComponent: isPartnerInterface updated from service:',
          this.isPartnerInterface
        );
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserProfile(): void {
    this.isLoadingUser = true;
    this.userService
      .getCurrentUserProfile()
      .pipe(finalize(() => (this.isLoadingUser = false)))
      .subscribe({
        next: (user) => {
          this.user = user;
          if (this.user) {
            this.profileForm.patchValue({
              firstname: this.user.firstname,
              lastname: this.user.lastname,
              username: this.user.username,
              email: this.user.email,
              phone: this.user.phone_number,
              address: this.user.address,
              isPartner: this.user.is_partner,
            });
            this.loadIncomingReviews();
            this.loadOutgoingReviews();
          }
        },
        error: (err) => console.error('Error loading user profile:', err),
      });
  }

  loadIncomingReviews(): void {
    if (!this.user?.id) return;
    this.isLoadingIncomingReviews = true;
    this.reviewService
      .getReviewsReceivedForUser(this.user.id)
      .pipe(finalize(() => (this.isLoadingIncomingReviews = false)))
      .subscribe({
        next: (reviews) => (this.reviews = reviews),
        error: (err) => console.error('Error loading reviews:', err),
      });
  }

  loadOutgoingReviews(): void {
    if (!this.user?.id) return;
    this.isLoadingOutgoingReviews = true;
    this.reviewService
      .getReviewsGivenByUser(this.user.id)
      .pipe(finalize(() => (this.isLoadingOutgoingReviews = false)))
      .subscribe({
        next: (reviews) => {
          this.outgoingReviews = reviews;
        },
        error: (err) => {
          console.error('Error loading outgoing reviews:', err);
        },
      });
  }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
    if (tabName === 'reviews' && this.reviews.length === 0) {
      this.loadIncomingReviews();
    }
    if (tabName === 'reviews' && this.outgoingReviews.length === 0) {
      this.loadOutgoingReviews();
    }
  }

  setActiveReviewSubTab(subTab: 'incoming' | 'outgoing'): void {
    this.activeReviewSubTab = subTab;
    if (subTab === 'outgoing' && this.outgoingReviews.length === 0) {
      this.loadOutgoingReviews();
    }
  }

  saveProfileChanges(): void {
    if (this.profileForm.invalid || !this.user?.id) {
      return;
    }
    this.isSaving = true;
    const updatedProfileData = {
      firstname: this.f['firstname'].value,
      lastname: this.f['lastname'].value,
      username: this.f['username'].value,
      email: this.f['email'].value,
      phone_number: this.f['phone'].value,
      address: this.f['address'].value,
    };

    this.userService
      .updateUserProfile(this.user.id, updatedProfileData)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.profileForm.markAsPristine();
          console.log('Profile updated successfully');
        },
        error: (err) => {
          console.error('Error updating profile:', err);
        },
      });
  }

  updateLocation(): void {
    if (!navigator.geolocation) {
      this.locationStatus = 'error';
      this.locationErrorMessage =
        'Geolocation is not supported by your browser.';
      return;
    }

    this.isUpdatingLocation = true;
    this.locationStatus = 'pending';
    this.locationErrorMessage = null;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.locationStatus = 'granted';
        const coords = position.coords;
        console.log(
          `Location obtained: Lat ${coords.latitude}, Lon ${coords.longitude}`
        );

        if (this.user) {
          this.user.latitude = coords.latitude;
          this.user.longitude = coords.longitude;
        }

        const locationUpdate = {
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
              this.locationStatus = 'idle';
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
            break;
          case error.TIMEOUT:
            this.locationErrorMessage =
              'The request to get user location timed out.';
            break;
          default:
            this.locationErrorMessage =
              'An unknown error occurred while getting location.';
            break;
        }
        console.error(`Geolocation error: ${this.locationErrorMessage}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  editAvatar(): void {
    console.log('Edit avatar clicked');
    alert("Fonctionnalité de changement d'avatar à implémenter.");
  }

  get f() {
    return this.profileForm.controls;
  }

  becomePartner(): void {
    // Ensure the checkbox is checked (form control is valid)
    if (this.f['isPartner'].invalid) {
      this.f['isPartner'].markAsTouched();
      return;
    }
    this.isBecomingPartner = true; // Use the dedicated loading flag
    this.userService
      .becomePartner()
      .pipe(
        finalize(() => (this.isBecomingPartner = false)) // Stop loading
      )
      .subscribe({
        next: (/* optional updated user data */) => {
          console.log('Successfully became partner');
          if (this.user) {
            this.user.is_partner = true; // <-- IMPORTANT: Update local user state
          }
          // The *ngIf in the template will now automatically show the switch section
          // No need to manually set isPartnerInterface here. Let the user switch if they want.
          this.f['isPartner'].setValue(true); // Ensure form control reflects the state
          this.f['isPartner'].markAsPristine(); // Optional
        },
        error: (err) => {
          console.error('Error becoming partner:', err);
          // Optional: Reset checkbox if API call failed
          // this.f['isPartner'].setValue(false);
        },
      });
  }

  switchInterface(event: any): void {
    const isChecked = event.target.checked;
    this.userService.switchInterface(isChecked);
  }
}
