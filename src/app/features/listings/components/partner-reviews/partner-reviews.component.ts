import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ReviewService, PartnerReview } from '../../../../core/services/review.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-partner-reviews',
  standalone: false,
  templateUrl: './partner-reviews.component.html',
  styleUrls: ['./partner-reviews.component.scss']
})
export class PartnerReviewsComponent implements OnChanges {
  @Input() partnerId: number | null = null;
  @Output() close = new EventEmitter<void>();

  reviews: PartnerReview[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  partnerUsername: string = '';
  averageRating: number = 0;

  constructor(
    private reviewService: ReviewService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partnerId'] && this.partnerId) {
      this.loadPartnerReviews(this.partnerId);
    }
  }

  loadPartnerReviews(partnerId: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    // Force change detection to show loading state immediately
    this.cdRef.detectChanges();

    this.reviewService.getPartnerReviews(partnerId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          // Force change detection when loading completes
          this.cdRef.detectChanges();
        })
      )
      .subscribe({
        next: (data) => {
          console.log('Partner reviews loaded:', data);
          this.reviews = data;
          
          // Calculate average rating
          this.calcAverageRating();
          
          // Extract partner username from first review if available
          if (data.length > 0 && data[0].reviewer) {
            this.partnerUsername = data[0].reviewer.username;
          }
          
          // Force change detection to update the UI
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error('Error loading partner reviews:', err);
          this.errorMessage = 'Could not load reviews. Please try again later.';
          
          // Force change detection to show the error
          this.cdRef.detectChanges();
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
  
  getDefaultAvatar(event: Event, username?: string): void {
    const target = event.target as HTMLImageElement;
    const name = username || 'Default User';

    const encodedName = encodeURIComponent(name.trim()).replace(/%20/g, '+');
    target.src = `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=128`;
    target.onerror = null; // Prevents infinite error loops
  }
}