import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Review } from '../../shared/database.model'; // Adjust path as needed

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = '/api/reviews'; // Example API endpoint

  constructor(private http: HttpClient) {}

  // Method to get reviews *about* a specific user (Incoming)
  getReviewsForUser(userId: number): Observable<Review[]> {
    // Replace with actual API call
    // Example: return this.http.get<Review[]>(`${this.apiUrl}?revieweeId=${userId}`);

    // --- Mock Data Example ---
    const mockReviews: Review[] = [
      {
        id: 1,
        // Ensure reviewer object includes avatar_url
        reviewer: { id: 2, username: 'JaneDoe', firstname: 'Jane', lastname: 'Doe', avatar_url: 'https://ui-avatars.com/api' },
        reviewee: { id: userId }, // Assuming current user is the reviewee
        rating: 5,
        comment: 'Excellent client, took care of the equipment and returned it in the same condition as received. Easy and pleasant communication.',
        created_at: new Date('2025-03-10'),
        is_visible: true,
        type: 'forClient',
      },
      {
        id: 3,
        // Ensure reviewer object includes avatar_url
        reviewer: { id: 4, username: 'PhotoPro', firstname: 'Peter', lastname: 'Lens', avatar_url: 'https://ui-avatars.com/api' },
        reviewee: { id: userId },
        rating: 4,
        comment: 'Good communication, item returned on time.',
        created_at: new Date('2025-04-22'),
        is_visible: true,
        type: 'forClient',
      },
    ];
    return of(mockReviews);
    // --- End Mock Data ---
  }

  // Method to get reviews *given* by a specific user (Outgoing)
  getReviewsGivenByUser(userId: number): Observable<Review[]> {
    // Replace with actual API call
    // Example: return this.http.get<Review[]>(`${this.apiUrl}?reviewerId=${userId}`);

    // --- Mock Data Example ---
    const mockOutgoingReviews: Review[] = [
      {
        id: 2,
        reviewer: { id: userId }, // Current user is the reviewer
        // Ensure reviewee object includes avatar_url
        reviewee: { id: 5, username: 'GadgetRent', firstname: 'Gadget', lastname: 'Rentals', avatar_url: 'https://ui-avatars.com/api' },
        rating: 5,
        comment: 'Fantastic service, the drone was exactly as described. Will rent again!',
        created_at: new Date('2025-02-18'),
        is_visible: true,
        type: 'forPartner', // Example type
      },
       {
        id: 4, // Another outgoing review example
        reviewer: { id: userId },
        reviewee: { id: 6, username: 'SoundSystem', firstname: 'Audio', lastname: 'Pro', avatar_url: 'https://ui-avatars.com/api' }, // Added avatar
        rating: 4,
        comment: 'Good equipment, but pickup was slightly delayed.',
        created_at: new Date('2025-05-01'),
        is_visible: true,
        type: 'forPartner',
      },
    ];
    return of(mockOutgoingReviews);
    // --- End Mock Data ---
  }

  // Add other methods as needed (e.g., submitReview)
}
