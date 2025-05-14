import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  Review,
  ReviewService,
  UserReviewsResponse,
} from '../../../../core/services/review.service';
import { User } from '../../../../shared/database.model';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';

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

  receivedReviewsAsPartner: Review[] = [];
  receivedReviewsAsClient: Review[] = [];
  givenReviewsAsPartner: Review[] = [];
  givenReviewsAsClient: Review[] = [];

    // Reviews currently displayed based on interface mode
  displayedIncomingReviews: Review[] = [];
  displayedOutgoingReviews: Review[] = [];


  activeTab: string = 'info';
  activeReviewSubTab: 'incoming' | 'outgoing' = 'incoming';
  profileForm: FormGroup;
  isLoadingUser: boolean = false;
  isLoadingReviews: boolean = false;
  isSaving: boolean = false;
  isUpdatingLocation: boolean = false;

  locationStatus: 'idle' | 'pending' | 'granted' | 'denied' | 'error' = 'idle';
  locationErrorMessage: string | null = null;

  defaultAvatar = 'assets/images/default-avatar.png';
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private reviewService: ReviewService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
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
    
    // Subscribe to interface mode changes
    this.userService.isPartnerInterface$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isPartnerInterface) => {
        console.log(
          'ProfileComponent: isPartnerInterface updated from service:',
          isPartnerInterface
        );
        
        // Only update if the state has changed
        if (this.isPartnerInterface !== isPartnerInterface) {
          this.isPartnerInterface = isPartnerInterface;
          
          // Update displayed reviews when interface mode changes
          this.updateDisplayedReviews();
          
          // Force change detection to update the UI
          this.cdRef.detectChanges();
          
          console.log('ProfileComponent: UI updated after interface mode change');
        }
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
            // Update form with user data
            this.profileForm.patchValue({
              firstname: this.user.firstname,
              lastname: this.user.lastname,
              username: this.user.username,
              email: this.user.email,
              phone: this.user.phone_number,
              address: this.user.address,
              is_partner: this.user.is_partner,
            });
            this.loadAllReviews();
          }
        },
        error: (err) => console.error('Error loading user profile:', err),
      });
  }

    // New method to load all review types at once
  loadAllReviews(): void {
    if (!this.user?.id) return;
    this.isLoadingReviews = true;
    
    this.reviewService
      .getUserReviews(this.user.id)
      .pipe(finalize(() => {
        this.isLoadingReviews = false;
        this.updateDisplayedReviews();
      }))
      .subscribe({
        next: (response: UserReviewsResponse) => {
          // Store all review types
          this.receivedReviewsAsPartner = response.received_reviews_as_partner || [];
          this.receivedReviewsAsClient = response.received_reviews_as_client || [];
          this.givenReviewsAsPartner = response.given_reviews_as_partner || [];
          this.givenReviewsAsClient = response.given_reviews_as_client || [];
          
          // Update displayed reviews based on current interface mode
          this.updateDisplayedReviews();
        },
        error: (err: any) => console.error('Error loading reviews:', err),
      });
  }

    // New method to update which reviews are displayed based on interface mode
  updateDisplayedReviews(): void {
    if (this.isPartnerInterface) {
      this.displayedIncomingReviews = this.receivedReviewsAsPartner;
      this.displayedOutgoingReviews = this.givenReviewsAsPartner;
    } else {
      this.displayedIncomingReviews = this.receivedReviewsAsClient;
      this.displayedOutgoingReviews = this.givenReviewsAsClient;
    }
    
    // Force change detection to update the UI
    this.cdRef.detectChanges();
  }




  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
    if (tabName === 'reviews' && 
        (this.receivedReviewsAsClient.length === 0 || 
         this.receivedReviewsAsPartner.length === 0)) {
      this.loadAllReviews();
    }
  }

  setActiveReviewSubTab(subTab: 'incoming' | 'outgoing'): void {
    this.activeReviewSubTab = subTab;
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
    console.log('ProfileComponent: Switching interface to:', isChecked ? 'Partner' : 'Client');
    
    // Prevent default to ensure we control the event completely
    if (event.preventDefault) {
      event.preventDefault();
    }
    
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    
    // Update local state immediately for UI consistency
    this.isPartnerInterface = isChecked;
    
    // Update the service with the new preference
    this.userService.switchInterface(isChecked);
    
    // Update the displayed reviews based on the new interface mode
    this.updateDisplayedReviews();
    
    // Force change detection to update the UI
    this.cdRef.detectChanges();
    
    // For debugging
    console.log('ProfileComponent: Interface switched, local state:', this.isPartnerInterface);
  }
  
  // Add this new method specifically for clicking on the status text
  toggleInterfaceFromLabel(): void {
    // Toggle to the opposite of current state
    const newState = !this.isPartnerInterface;
    console.log('ProfileComponent: Toggling interface from label to:', newState ? 'Partner' : 'Client');
    
    // Update local state
    this.isPartnerInterface = newState;
    
    // Update service
    this.userService.switchInterface(newState);
    
    // Update displayed reviews
    this.updateDisplayedReviews();
    
    // Force change detection
    this.cdRef.detectChanges();
  }


  getDefaultAvatar(event: Event, username?: string): void {
    const target = event.target as HTMLImageElement;
    const name = username || 'Default User';

    const encodedName = encodeURIComponent(name.trim()).replace(/%20/g, '+');
    target.src = `https://ui-avatars.com/api/?name=${encodedName}&color=000&size=128`;
    target.onerror = null; // Prevents infinite error loops
  }
}

