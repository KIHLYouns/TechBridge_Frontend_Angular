
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService, ReviewSubmitRequest } from '../../../../core/services/review.service';
import { Reservation } from '../../../my-rentals/services/reservations.service';

@Component({
  selector: 'app-client-review',
  standalone: false,
  templateUrl: './client-review.component.html',
  styleUrl: './client-review.component.scss'
})
export class ClientReviewComponent implements OnInit {
  @Input() reservation: Reservation | null = null;
  @Input() userId: number | null = null;
  @Output() close = new EventEmitter<boolean>();

  reviewForm!: FormGroup;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedRating: number = 0;
  isSubmitting = false;
  submitError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]]
    });
  }

  selectRating(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ rating });
  }

  submitReview(): void {

    console.log("test")
    if (this.reviewForm.invalid) {
      Object.keys(this.reviewForm.controls).forEach(key => {
        this.reviewForm.get(key)?.markAsTouched();
      });
      return;
    }
    console.log("test")


    if (!this.reservation || !this.userId) {
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;

    const reviewData: ReviewSubmitRequest = {
      reviewer_id: this.userId, // user reviewing (partner)
      reviewee_id: this.reservation.client?.id || 0, // user reviewed (client) 
      rating: this.reviewForm.value.rating, // client rating 
      comment: this.reviewForm.value.comment, // comment
      reservation_id: this.reservation.id, // reservation id
      listing_id: this.reservation.listing?.id, // listing id
      type: 'forClient'  // type for CLient
    };

    console.log(reviewData);

    this.reviewService.submitReview(reviewData).subscribe({
      next: () => {
        this.isSubmitting = false;
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
    this.close.emit(false);
  }
}