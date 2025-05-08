import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ReviewService, ClientReview } from '../../../../core/services/review.service';

@Component({
  selector: 'app-client-reviews', 
  standalone: false,
  templateUrl: './client-reviews.component.html',
  styleUrls: ['./client-reviews.component.scss']
})
export class ClientReviewsComponent implements OnChanges {
  @Input() clientId: number | null = null;
  @Output() close = new EventEmitter<void>();

  reviews: ClientReview[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  clientUsername: string = '';
  averageRating: number = 0;

  constructor(private partnerBookingsService: ReviewService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clientId'] && this.clientId) {
      this.loadClientReviews(this.clientId);
    }
  }

  loadClientReviews(clientId: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.partnerBookingsService.getClientReviews(clientId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.isLoading = false;
        
        // Extract client username from first review
        if (data.length > 0) {
          this.calcAverageRating();
        }
      },
      error: (err) => {
        console.error('Error loading client reviews:', err);
        this.errorMessage = 'Could not load reviews. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  calcAverageRating(): void {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    
    const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  closeModal(): void {
    this.close.emit();
  }
}
