import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ReviewService } from '../../../../core/services/review.service';
import { Review, User } from '../../../../shared/database.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  reviews: Review[] = [];
  activeTab: string = 'info';
  profileForm: FormGroup;
  isLoadingUser: boolean = false;
  isLoadingReviews: boolean = false;
  isSaving: boolean = false;

  constructor(
    private userService: UserService,
    private reviewService: ReviewService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserReviews();
  }

  loadUserProfile(): void {
    this.isLoadingUser = true;
    this.userService.getCurrentUserProfile()
      .pipe(finalize(() => this.isLoadingUser = false))
      .subscribe(userData => {
        this.user = userData;
        if (this.user) {
          this.profileForm.patchValue({
            firstname: this.user.firstname,
            lastname: this.user.lastname,
            email: this.user.email,
            phone: this.user.phone_number,
            address: this.user.address
          });
        }
      });
  }

  loadUserReviews(): void {
    const userId = this.userService.getCurrentUserId();
    if (userId) {
      this.isLoadingReviews = true;
      this.reviewService.getReviewsForUser(userId)
        .pipe(finalize(() => this.isLoadingReviews = false))
        .subscribe(reviewData => {
          this.reviews = reviewData;
        });
    } else {
      console.warn('User ID not available to load reviews.');
    }
  }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }

  saveProfileChanges(): void {
    if (this.profileForm.invalid || !this.user || !this.user.id || this.isSaving) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValues = this.profileForm.value;

    const updatedUserData: Partial<User> = {
      firstname: formValues.firstname,
      lastname: formValues.lastname,
      email: formValues.email,
      phone_number: formValues.phone,
      address: formValues.address
    };

    if (!this.user?.id) {
      console.error("User ID is missing, cannot update profile.");
      this.isSaving = false;
      return;
    }

    this.userService.updateUserProfile(this.user.id, updatedUserData)
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: updatedUser => {
          this.user = updatedUser;
          this.profileForm.patchValue({
            firstname: updatedUser.firstname,
            lastname: updatedUser.lastname,
            email: updatedUser.email,
            phone: updatedUser.phone_number,
            address: updatedUser.address
          });
          this.profileForm.markAsPristine();
          console.log('Profile updated successfully!');
        },
        error: err => {
          console.error('Error updating profile:', err);
        }
      });
  }

  editAvatar(): void {
    console.log('Edit avatar clicked - implement file upload logic.');
    alert('Avatar editing not implemented yet.');
  }

  get f() { return this.profileForm.controls; }
}
