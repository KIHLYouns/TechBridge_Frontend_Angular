import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Import 'of' for mock data
import { Review } from '../../shared/database.model'; // Adjust path as needed

@Injectable({
  providedIn: 'root' // Or provide in ProfileModule if specific to the feature
})
export class ReviewService {

  // Replace with your actual API endpoint
  private apiUrl = '/api/reviews'; // Example API endpoint

  constructor(private http: HttpClient) { }

  // Method to get reviews *about* a specific user
  getReviewsForUser(userId: number): Observable<Review[]> {
    // Replace with actual API call
    // Example: return this.http.get<Review[]>(`${this.apiUrl}?revieweeId=${userId}`);

    // --- Mock Data Example ---
    const mockReviews: Review[] = [
      { id: 1, reviewer: { username: 'JaneDoe' }, rating: 5, comment: 'Great experience!', created_at: new Date('2023-10-26'), is_visible: true, type: 'forClient' }, // Added is_visible and type
      { id: 2, reviewer: { username: 'TechGuy' }, rating: 4, comment: 'Very helpful.', created_at: new Date('2023-09-15'), is_visible: true, type: 'forClient' } // Added is_visible and type
    ];
    return of(mockReviews);
    // --- End Mock Data ---
  }

  // Add other methods as needed (e.g., submitReview)
}
