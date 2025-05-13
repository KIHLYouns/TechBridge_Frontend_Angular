import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of, map, tap } from 'rxjs';

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
  reviewer_id: number;
  reviewee_id: number;
  rating: number;
  comment: string;
  reservation_id: number;
  listing_id?: number;
  type: 'forPartner' | 'forClient' | 'forObject';
}

// this will help us structure data that will be returned when e fetch client reviews
export interface ClientReview {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    id: number;
    username: string;
    avatar_url: string;
  };
}

export interface ListingReview {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    id: number;
    username: string;
    avatar_url: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getUserReviews(userId: number): Observable<UserReviewsResponse> {
  /*  const mockResponse: UserReviewsResponse = {
      received_reviews: [
        {
          id: 245,
          reviewer: {
            id: 83,
            username: 'sarah_tech',
            firstname: 'Sarah',
            lastname: 'Johnson',
            avatar_url: 'https://ui-avatars.com/api/?name=Sarah+Johnson',
          },
          reviewee: {
            id: userId,
            username: 'hmed_samaki',
            firstname: 'Jean',
            lastname: 'Dupont',
            avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
          },
          rating: 5,
          comment:
            'Jean was very professional and the equipment was in perfect condition. Delivery was on time and he provided great instructions on how to use the camera.',
          created_at: '2025-04-15T14:30:00Z',
          type: 'forPartner',
        },
        {
          id: 198,
          reviewer: {
            id: 42,
            username: 'alex_photo',
            firstname: 'Alex',
            lastname: 'Smith',
            avatar_url: 'https://ui-avatars.com/api/?name=Alex+Smith',
          },
          reviewee: {
            id: userId,
            username: 'hmed_samaki',
            firstname: 'Jean',
            lastname: 'Dupont',
            avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
          },
          rating: 4,
          comment:
            'Good experience overall. The camera was clean and worked perfectly. Jean was helpful with setup instructions.',
          created_at: '2025-03-22T09:15:00Z',
          type: 'forPartner',
        },
      ],
      given_reviews: [
        {
          id: 156,
          reviewer: {
            id: userId,
            username: 'hmed_samaki',
            firstname: 'Jean',
            lastname: 'Dupont',
            avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
          },
          reviewee: {
            id: 54,
            username: 'camera_pro',
            firstname: 'Michael',
            lastname: 'Wong',
            avatar_url: 'https://ui-avatars.com/api/?name=Michael+Wong',
          },
          rating: 5,
          comment:
            'Great camera equipment, would rent again! Michael was extremely professional and offered excellent advice on the best settings for my shoot.',
          created_at: '2025-01-20T10:15:00Z',
          type: 'forPartner',
        },
        {
          id: 203,
          reviewer: {
            id: userId,
            username: 'hmed_samaki',
            firstname: 'Jean',
            lastname: 'Dupont',
            avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
          },
          reviewee: {
            id: 67,
            username: 'drone_master',
            firstname: 'Emma',
            lastname: 'Rodriguez',
            avatar_url: 'https://ui-avatars.com/api/?name=Emma+Rodriguez',
          },
          rating: 3,
          comment:
            'The drone was in good condition, but battery life was less than advertised. Emma was responsive to messages though.',
          created_at: '2025-03-05T16:30:00Z',
          type: 'forPartner',
        },
      ],
    }; */
  //  return of(mockResponse).pipe(delay(800));
    return this.http.get<UserReviewsResponse>(`${this.apiUrl}/users/${userId}/reviews`);
  }

  submitReview(request: ReviewSubmitRequest): Observable<void> {
    // return this.http.post<Review>(`${this.apiUrl}/reviews`, request);
    /* return of(undefined).pipe(
      delay(3000),
      map(() => void 0) // Explicitly return void to match Observable<void>
    ); */
    return this.http.post<void>(`${this.apiUrl}/reviews`, request);
  }

  hasUserReviewedReservation(
    userId: number | null,
    reservation_id: number
  ): Observable<boolean> {
    // return this.http.get<boolean>(`${this.apiUrl}/reviews/check?userId=${userId}&reservation_id=${reservation_id}`);
   /* const hasReviewed = Math.random() >= 0.5;
    return of(hasReviewed).pipe(delay(300)); */
    return this.http.get<boolean>(`${this.apiUrl}/reviews/check?userId=${userId}&reservation_id=${reservation_id}`).pipe(
      tap((response) => console.log('Check if user has reviewed:', response)),
    );
  }

  // To Test with the backend !!
  getClientReviews(clientId: number): Observable<ClientReview[]> {
    // In a real app: return this.http.get<ClientReview[]>(`${this.apiUrl}/reviews/clients/${clientId}`);
    /*const mockReviews = getMockClientReviews(clientId);
    const randomDelay = 300 + Math.floor(Math.random() * 500);
    return of(mockReviews).pipe(delay(randomDelay)); */
    return this.http.get<{total: number, data: ClientReview[]}>(`${this.apiUrl}/reviews/clients/${clientId}`)
           .pipe(map(response => response.data));
  }

  getListingReviews(listingId: number): Observable<ListingReview[]> {
    // In real app: return this.http.get<ListingReview[]>(`${this.apiUrl}/listings/${listingId}/reviews`);
   /* const mockReviews: ListingReview[] = [
      {
        id: 501,
        rating: 5,
        comment:
          'Excellent camera! Perfect condition and worked flawlessly for my photoshoot. Highly recommended!',
        created_at: '2025-03-15T14:30:00Z',
        reviewer: {
          id: 201,
          username: 'marcus_photo',
          avatar_url: 'https://ui-avatars.com/api/?name=Marcus+Photo',
        },
      },
      {
        id: 502,
        rating: 4,
        comment:
          'Great equipment, easy to use. Battery life was a bit shorter than expected, but overall a positive experience.',
        created_at: '2025-02-10T09:15:00Z',
        reviewer: {
          id: 202,
          username: 'sarah_filmmaker',
          avatar_url: 'https://ui-avatars.com/api/?name=Sarah+Filmmaker',
        },
      },
      {
        id: 503,
        rating: 5,
        comment:
          'This equipment exceeded my expectations. The owner provided excellent instructions and the quality was top-notch.',
        created_at: '2025-01-20T16:45:00Z',
        reviewer: {
          id: 203,
          username: 'michael_studio',
          avatar_url: 'https://ui-avatars.com/api/?name=Michael+Studio',
        },
      },
    ]; 

    const randomDelay = 300 + Math.floor(Math.random() * 500);
    return of(mockReviews).pipe(delay(randomDelay)); */
    return this.http.get<ListingReview[]>(`${this.apiUrl}/listings/${listingId}/reviews`);
  }
}

// Mock data function for client reviews
/*function getMockClientReviews(clientId: number): ClientReview[] {
  // Create different reviews based on client ID for variety
  const mockReviewsBase: ClientReview[] = [
    {
      id: 301,
      rating: 5,
      comment:
        'Excellent client! Took great care of my equipment and returned everything in perfect condition. Communication was seamless throughout the rental period.',
      created_at: '2025-04-07T09:00:00Z',
      reviewer: {
        id: 101,
        username: 'hmed_samaki',
        avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
      },
    },
    {
      id: 302,
      rating: 4,
      comment:
        'Good communication and punctual with pickup and return. Equipment was returned in good condition with only minor wear.',
      created_at: '2025-03-15T14:30:00Z',
      reviewer: {
        id: 102,
        username: 'samir_mofakir',
        avatar_url: 'https://ui-avatars.com/api/?name=Alice+Martin',
      },
    },
    {
      id: 303,
      rating: 5,
      comment:
        'A pleasure to work with! Highly professional, respectful of the equipment, and extremely punctual. Would happily rent to this client again.',
      created_at: '2025-02-20T11:45:00Z',
      reviewer: {
        id: 103,
        username: 'ilyas_lmatag',
        avatar_url: 'https://ui-avatars.com/api/?name=Felix+Bernard',
      },
    },
    {
      id: 304,
      rating: 3,
      comment:
        'Returned the equipment with minor issues, but was honest about it and communication was good. Would consider renting to again.',
      created_at: '2025-01-10T16:20:00Z',
      reviewer: {
        id: 104,
        username: 'wadi3',
        avatar_url: 'https://ui-avatars.com/api/?name=Sophie+Leroy',
      },
    },
    {
      id: 305,
      rating: 5,
      comment:
        'Fantastic client who knows their equipment well. No issues whatsoever, perfect renting experience.',
      created_at: '2024-12-05T10:10:00Z',
      reviewer: {
        id: 105,
        username: 'tech_master',
        avatar_url: 'https://ui-avatars.com/api/?name=Tech+Master',
      },
    },
  ];

  // Reviews for client 201 (marcus_photo)
  if (clientId === 201) {
    return [
      {
        id: 401,
        rating: 5,
        comment:
          'Marcus is the ideal client - professional, knowledgeable about camera equipment, and returned everything spotless. Highly recommended!',
        created_at: '2025-04-10T09:30:00Z',
        reviewer: {
          id: 101,
          username: 'hmed_samaki',
          avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
        },
      },
      {
        id: 402,
        rating: 5,
        comment:
          'Marcus showed great respect for my Canon equipment. Communication was excellent and return was on time. Would rent to again without hesitation.',
        created_at: '2025-03-05T14:15:00Z',
        reviewer: {
          id: 102,
          username: 'samir_mofakir',
          avatar_url: 'https://ui-avatars.com/api/?name=Alice+Martin',
        },
      },
      {
        id: 403,
        rating: 4,
        comment:
          'Very good experience. Responsible with the equipment and good communication throughout.',
        created_at: '2025-02-15T11:45:00Z',
        reviewer: {
          id: 103,
          username: 'ilyas_lmatag',
          avatar_url: 'https://ui-avatars.com/api/?name=Felix+Bernard',
        },
      },
    ];
  }

  // Reviews for client 202 (sarah_filmmaker)
  else if (clientId === 202) {
    return [
      {
        id: 404,
        rating: 5,
        comment:
          'Sarah is a true professional! She handled my drone with expertise and returned it in perfect condition. Her communication was outstanding.',
        created_at: '2025-03-28T16:45:00Z',
        reviewer: {
          id: 101,
          username: 'hmed_samaki',
          avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
        },
      },
      {
        id: 405,
        rating: 4,
        comment:
          'Great experience renting to Sarah. She knows her equipment and takes good care of it. Prompt with communication and pickup/return.',
        created_at: '2025-01-22T09:30:00Z',
        reviewer: {
          id: 102,
          username: 'samir_mofakir',
          avatar_url: 'https://ui-avatars.com/api/?name=Alice+Martin',
        },
      },
    ];
  }

  // Reviews for client 203 (michael_studio)
  else if (clientId === 203) {
    return [
      {
        id: 406,
        rating: 3,
        comment:
          'Michael returned the lighting kit with a minor issue, but was upfront about it and offered to pay for repairs. Communication could have been better during the rental period.',
        created_at: '2025-04-22T14:15:00Z',
        reviewer: {
          id: 101,
          username: 'hmed_samaki',
          avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
        },
      },
      {
        id: 407,
        rating: 4,
        comment:
          'Good client overall. Equipment was returned in acceptable condition and on time.',
        created_at: '2025-02-10T11:20:00Z',
        reviewer: {
          id: 103,
          username: 'ilyas_lmatag',
          avatar_url: 'https://ui-avatars.com/api/?name=Felix+Bernard',
        },
      },
    ];
  }

  // Reviews for client 204 (david_productions)
  else if (clientId === 204) {
    return [
      {
        id: 408,
        rating: 5,
        comment:
          'David and his team are exceptional! They treated my cinema camera with absolute care and professionalism. Perfect experience.',
        created_at: '2025-04-10T09:15:00Z',
        reviewer: {
          id: 101,
          username: 'hmed_samaki',
          avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
        },
      },
    ];
  }

  // Reviews for client 205 (emma_vlogger)
  else if (clientId === 205) {
    return [
      {
        id: 409,
        rating: 4,
        comment:
          'Emma took good care of my microphone setup. Great communication and on-time return.',
        created_at: '2025-03-15T15:30:00Z',
        reviewer: {
          id: 101,
          username: 'hmed_samaki',
          avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
        },
      },
      {
        id: 410,
        rating: 5,
        comment:
          'Excellent client! Emma is very knowledgeable about audio equipment and handled everything with care. Would definitely rent to her again!',
        created_at: '2024-12-12T10:00:00Z',
        reviewer: {
          id: 104,
          username: 'wadi3',
          avatar_url: 'https://ui-avatars.com/api/?name=Sophie+Leroy',
        },
      },
    ];
  }

  // Reviews for client 206 (alex_adventures)
  else if (clientId === 206) {
    return [
      {
        id: 411,
        rating: 2,
        comment:
          "Equipment was returned late and with some damage. Alex was apologetic but I'd be hesitant to rent again without some assurances.",
        created_at: '2025-03-25T17:45:00Z',
        reviewer: {
          id: 101,
          username: 'hmed_samaki',
          avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
        },
      },
    ];
  }

  // For any other client IDs, return a default set or random selection from base reviews
  else {
    // Randomize which base reviews to use (with client ID as seed for consistency)
    const seed = clientId % 10;
    return mockReviewsBase.filter((_, index) => (index + seed) % 3 === 0);
  }
} */
