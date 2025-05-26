import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ReviewService,
  ReviewSubmitRequest,
} from '../../../../core/services/review.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reservation } from '../../services/reservations.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-review-modal',
  standalone: false,
  templateUrl: './review-modal.component.html',
  styleUrl: './review-modal.component.scss',
})
export class ReviewModalComponent implements OnInit {
  @Input() reservation: Reservation | null = null; // selected reservation, this model could be changed
  @Input() userId: number | null = null;
  @Output() close = new EventEmitter<boolean>(); // Changed to emit boolean for success status

  reviewForm!: FormGroup;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedPartnerRating: number = 0;
  selectedItemRating: number = 0;
  isSubmitting = false;
  submitError: string | null = null;

  constructor(private fb: FormBuilder, private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      partnerReview: this.fb.group({
        rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
        comment: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]]
      }),
      itemReview: this.fb.group({
        rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
        comment: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]]
      })
    });

    // Subscribe to form value changes to update selected ratings
    this.partnerReviewForm.get('rating')?.valueChanges.subscribe(value => {
      this.selectedPartnerRating = value || 0;
    });
    
    this.itemReviewForm.get('rating')?.valueChanges.subscribe(value => {
      this.selectedItemRating = value || 0;
    });
    
  }

  get partnerReviewForm(): FormGroup {
    return this.reviewForm.get('partnerReview') as FormGroup;
  }
  
  get itemReviewForm(): FormGroup {
    return this.reviewForm.get('itemReview') as FormGroup;
  }

  // Updated star selection methods
  selectPartnerRating(rating: number): void {
    this.selectedPartnerRating = rating;
    this.partnerReviewForm.get('rating')?.setValue(rating);
    this.partnerReviewForm.get('rating')?.markAsTouched();
  }

  selectItemRating(rating: number): void {
    this.selectedItemRating = rating;
    this.itemReviewForm.get('rating')?.setValue(rating);
    this.itemReviewForm.get('rating')?.markAsTouched();
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.partnerReviewForm.controls).forEach(key => {
        this.partnerReviewForm.get(key)?.markAsTouched();
      });
      Object.keys(this.itemReviewForm.controls).forEach(key => {
        this.itemReviewForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    if (!this.reservation) {
      return;
    }
    
    if (!this.userId) {
      return;
    }
  
    this.isSubmitting = true;
    this.submitError = null;

    // Create partner review request
    const partnerReviewData: ReviewSubmitRequest = {
      reviewer_id: this.userId,
      reviewee_id: this.reservation.partner?.id || 0,
      rating: this.partnerReviewForm.value.rating,
      comment: this.partnerReviewForm.value.comment,
      reservation_id: this.reservation.id,
      listing_id: this.reservation.listing?.id,
      type: 'forPartner'
    };

    // Create item review request
    const itemReviewData: ReviewSubmitRequest = {
      reviewer_id: this.userId,
      reviewee_id: this.reservation.partner?.id || 0,
      rating: this.itemReviewForm.value.rating,
      comment: this.itemReviewForm.value.comment,
      reservation_id: this.reservation.id,
      listing_id: this.reservation.listing?.id,
      type: 'forObject'
    };

    console.log(partnerReviewData);
    console.log(itemReviewData);

    // Submit both reviews using forkJoin to wait for both to complete
    forkJoin([
      this.reviewService.submitReview(partnerReviewData),
      this.reviewService.submitReview(itemReviewData)
    ]).subscribe({
      next: () => {
        this.isSubmitting = false;
        // Emit true to indicate successful submission
        this.close.emit(true);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = 'Failed to submit review. Please try again.';
        console.error('Error submitting review:', error);
      }
    });
  }

  closeModal(): void {
    // Emit false to indicate no submission (just closing)
    this.close.emit(false);
  }
}
