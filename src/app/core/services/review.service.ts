import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of, map } from 'rxjs';

// You might already have a UserInfo interface in your models
export interface UserInfo {
  id: number;
  username?: string;
  firstname?: string;
  lastname?: string;
  avatar_url?: string;
}

// Update your Review interface if needed
export interface Review {
  id: number;
  reviewer?: UserInfo;
  reviewee?: UserInfo;
  rating: number;
  comment: string;
  created_at: string; // ISO date string format
  type: 'forPartner' | 'forClient' | 'forObject';
  listing_id?: number;
}

// Create a new interface for the combined reviews response
export interface UserReviewsResponse {
  received_reviews: Review[];
  given_reviews: Review[];
}

export interface ReviewSubmitRequest {
  reviewerId: number;
  revieweeId: number;
  rating: number;
  comment: string;
  reservationId: number;
  listingId?: number;
  type: 'forPartner' | 'forClient' | 'forObject';
}


@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = '/api/reviews'; // Example API endpoint

  constructor(private http: HttpClient) {}

  // Lina 
  getUserReviews(userId: number): Observable<UserReviewsResponse> {
    // return this.http.get<UserReviewsResponse>(`${this.apiUrl}/users/${userId}/reviews`);
    const mockResponse: UserReviewsResponse = {
      received_reviews: [
        {
          id: 245,
          reviewer: {
            id: 83,
            username: 'sarah_tech',
            firstname: 'Sarah',
            lastname: 'Johnson',
            avatar_url: 'https://ui-avatars.com/api/?name=Sarah+Johnson'
          },
          reviewee: {
            id: userId,
            username: 'hmed_samaki',
            firstname: 'Jean',
            lastname: 'Dupont',
            avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont'
          },
          rating: 5,
          comment: 'Jean was very professional and the equipment was in perfect condition. Delivery was on time and he provided great instructions on how to use the camera.',
          created_at: '2025-04-15T14:30:00Z',
          type: 'forPartner'
        },
        {
          id: 198,
          reviewer: {
            id: 42,
            username: 'alex_photo',
            firstname: 'Alex',
            lastname: 'Smith',
            avatar_url: 'https://ui-avatars.com/api/?name=Alex+Smith'
          },
          reviewee: {
            id: userId,
            username: 'hmed_samaki',
            firstname: 'Jean',
            lastname: 'Dupont',
            avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont'
          },
          rating: 4,
          comment: 'Good experience overall. The camera was clean and worked perfectly. Jean was helpful with setup instructions.',
          created_at: '2025-03-22T09:15:00Z',
          type: 'forPartner'
        }
      ],
      given_reviews: [
        {
          id: 156,
          reviewer: {
            id: userId,
            username: 'hmed_samaki',
            firstname: 'Jean',
            lastname: 'Dupont',
            avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont'
          },
          reviewee: {
            id: 54,
            username: 'camera_pro',
            firstname: 'Michael',
            lastname: 'Wong',
            avatar_url: 'https://ui-avatars.com/api/?name=Michael+Wong'
          },
          rating: 5,
          comment: 'Great camera equipment, would rent again! Michael was extremely professional and offered excellent advice on the best settings for my shoot.',
          created_at: '2025-01-20T10:15:00Z',
          type: 'forPartner'
        },
        {
          id: 203,
          reviewer: {
            id: userId,
            username: 'hmed_samaki',
            firstname: 'Jean',
            lastname: 'Dupont',
            avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont'
          },
          reviewee: {
            id: 67,
            username: 'drone_master',
            firstname: 'Emma',
            lastname: 'Rodriguez',
            avatar_url: 'https://ui-avatars.com/api/?name=Emma+Rodriguez'
          },
          rating: 3,
          comment: 'The drone was in good condition, but battery life was less than advertised. Emma was responsive to messages though.',
          created_at: '2025-03-05T16:30:00Z',
          type: 'forPartner'
        }
      ]
    };
    return of(mockResponse).pipe(delay(800));
  }

  // Lina 
  submitReview(request: ReviewSubmitRequest): Observable<void> {
    // return this.http.post<Review>(`${this.apiUrl}/reviews`, request);
    return of(undefined).pipe(
      delay(3000),
      map(() => void 0) // Explicitly return void to match Observable<void>
    );
  }

  // Lina 
  hasUserReviewedReservation(userId: number | null, reservationId: number): Observable<boolean> {
    // return this.http.get<boolean>(`${this.apiUrl}/reviews/check?userId=${userId}&reservationId=${reservationId}`);
    const hasReviewed = Math.random() >= 0.5;    
    return of(hasReviewed).pipe(delay(300));
  } 

}
