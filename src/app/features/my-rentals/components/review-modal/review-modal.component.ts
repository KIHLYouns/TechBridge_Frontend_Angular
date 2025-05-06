import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReviewService, ReviewSubmitRequest } from '../../../../core/services/review.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reservation } from '../../services/reservations.service';

@Component({
  selector: 'app-review-modal',
  standalone: false,
  templateUrl: './review-modal.component.html',
  styleUrl: './review-modal.component.scss'
})
export class ReviewModalComponent implements OnInit {

  @Input() reservation: Reservation | null = null; // selected reservation, this model could be changed
  @Input() userId: number | null = null;
  @Output() close = new EventEmitter<boolean>(); // Changed to emit boolean for success status

  
  reviewForm!: FormGroup;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedRating: number = 0;
  isSubmitting = false;
  submitError: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {
  }

  ngOnInit(): void {
    console.log("Creating review form");
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]]
    });
    console.log("Form created:", this.reviewForm);
  }

  selectRating(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ rating });
  }

  submitReview(): void {
    console.log("Submit function called");
  
    // Debug each condition separately
    console.log("Form valid?", this.reviewForm.valid);
    console.log("Form validation errors:", this.reviewForm.errors);
    console.log("Form value:", this.reviewForm.value);
    
    console.log("Rating control valid?", this.reviewForm.get('rating')?.valid);
    console.log("Rating control errors:", this.reviewForm.get('rating')?.errors);
    console.log("Rating control value:", this.reviewForm.get('rating')?.value);
    
    console.log("Comment control valid?", this.reviewForm.get('comment')?.valid);
    console.log("Comment control errors:", this.reviewForm.get('comment')?.errors);
    console.log("Comment control value:", this.reviewForm.get('comment')?.value);
    
    console.log("Reservation:", this.reservation);
    console.log("UserId:", this.userId);
    
    if (this.reviewForm.invalid) {
      console.log("STOPPING: Form is invalid");
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.reviewForm.controls).forEach(key => {
        this.reviewForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    if (!this.reservation) {
      console.log("STOPPING: Reservation is null or undefined");
      return;
    }
    
    if (!this.userId) {
      console.log("STOPPING: UserId is null, undefined, or 0");
      return;
    }
  
    console.log("Passed all validation checks");

    this.isSubmitting = true;
    this.submitError = null;

    const reviewData: ReviewSubmitRequest = {
      reviewerId: this.userId,
      revieweeId: this.reservation.partner?.id || 0, // this could be changed
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
      reservationId: this.reservation.id,
      listingId: this.reservation.listing?.id,
      type: 'forPartner'
    };
    console.log("//////////////////////////////////////////////////////////////////");
    console.log(reviewData);
    console.log("//////////////////////////////////////////////////////////////////");

    this.reviewService.submitReview(reviewData).subscribe({
      next: () => {
        this.isSubmitting = false;
        // Emit true to indicate successful submission
        this.close.emit(true);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = 'Failed to submit review. Please try again.';
        console.error('Error submitting review:', error);
        // We could optionally emit false for failure
        // this.close.emit(false);
      }
    });
  }
  
  closeModal(): void {
    // Emit false to indicate no submission (just closing)
    this.close.emit(false);
  }

}
