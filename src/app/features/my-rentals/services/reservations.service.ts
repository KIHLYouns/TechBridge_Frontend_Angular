import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { delay, map, mergeMap } from 'rxjs/operators';
import { ReservationStatus, Review } from '../../../shared/database.model'; // Import Review
import { ListingsService } from '../../listings/services/listings.service'; // Pour réutiliser les mocks
import { ReviewService } from '../../../core/services/review.service';
import { TokenService } from '../../auth/services/token.service';
import { HttpClient } from '@angular/common/http';

// Interfaces for Reservation, User, and Listing

export interface Reservation {
  id: number;
  start_date: string;
  end_date: string;
  total_cost: number;
  status: 'pending' | 'confirmed' | 'ongoing' | 'canceled' | 'completed';
  created_at: string;
  delivery_option: boolean;
  contract_url?: string | null;
  listing: Listing;
  partner: User;
  client: User;
  isReviewedByCurrentUser?: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  avatar_url?: string | null;
}

export interface Listing {
  id: number;
  title: string;
  main_image: string;
}

export interface CreateReservationRequest {
  start_date: string; // Format: YYYY-MM-DD
  end_date: string; // Format: YYYY-MM-DD
  listing_id: number;
  client_id: number;
  delivery_option: boolean;
}

// Mock data for client with ID 103

export const mockClientReservations: Reservation[] = [
  // CURRENT RESERVATIONS (pending, confirmed, ongoing)
  {
    id: 1001,
    start_date: '2025-05-10T00:00:00Z',
    end_date: '2025-05-12T00:00:00Z',
    total_cost: 105,
    status: 'pending',
    created_at: '2025-04-28T10:00:00Z',
    delivery_option: false,
    contract_url: null,
    listing: {
      id: 1,
      title: 'PlayStation 5 Slim',
      main_image: 'https://picsum.photos/600/400?random=1',
    },
    partner: {
      id: 101,
      username: 'hmed_samaki',
      avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
      email: 'jean.dupont@example.com',
      phone_number: '0123456789',
    },
    client: {
      id: 103,
      username: 'younsk',
      avatar_url: 'https://ui-avatars.com/api/?name=Youns+Kihl',
      email: 'youns.dev@example.com',
      phone_number: '0611223344',
    },
  },
  {
    id: 1002,
    start_date: '2025-05-20T00:00:00Z',
    end_date: '2025-05-21T00:00:00Z',
    total_cost: 100,
    status: 'confirmed',
    created_at: '2025-04-25T15:30:00Z',
    delivery_option: true,
    contract_url: 'https://example.com/contracts/1002.pdf',
    listing: {
      id: 2,
      title: 'DJI Mini 4 Pro Drone',
      main_image: 'https://picsum.photos/600/400?random=2',
    },
    partner: {
      id: 102,
      username: 'samir_mofakir',
      avatar_url: 'https://ui-avatars.com/api/?name=Alice+Martin',
      email: 'alice.martin@example.com',
      phone_number: '0987654321',
    },
    client: {
      id: 103,
      username: 'younsk',
      avatar_url: 'https://ui-avatars.com/api/?name=Youns+Kihl',
      email: 'youns.dev@example.com',
      phone_number: '0611223344',
    },
  },
  {
    id: 1003,
    start_date: '2025-06-01T00:00:00Z',
    end_date: '2025-06-03T00:00:00Z',
    total_cost: 180,
    status: 'ongoing',
    created_at: '2025-04-29T11:00:00Z',
    delivery_option: true,
    contract_url: 'https://example.com/contracts/1003.pdf',
    listing: {
      id: 3,
      title: 'Sony Alpha a7 IV Camera',
      main_image: 'https://picsum.photos/600/400?random=3',
    },
    partner: {
      id: 103,
      username: 'ilyas_lmatag',
      avatar_url: 'https://ui-avatars.com/api/?name=Felix+Bernard',
      email: 'felix.bernard@example.com',
      phone_number: '0611223344',
    },
    client: {
      id: 103,
      username: 'younsk',
      avatar_url: 'https://ui-avatars.com/api/?name=Youns+Kihl',
      email: 'youns.dev@example.com',
      phone_number: '0611223344',
    },
  },

  // PAST RESERVATIONS (completed, canceled)
  {
    id: 1004,
    start_date: '2025-03-01T00:00:00Z',
    end_date: '2025-03-03T00:00:00Z',
    total_cost: 40,
    status: 'completed',
    created_at: '2025-02-20T09:00:00Z',
    delivery_option: false,
    contract_url: 'https://example.com/contracts/1004.pdf',
    listing: {
      id: 4,
      title: 'Shure SM7B Microphone',
      main_image: 'https://picsum.photos/600/400?random=4',
    },
    partner: {
      id: 104,
      username: 'wadi3',
      avatar_url: 'https://ui-avatars.com/api/?name=Sophie+Leroy',
      email: 'sophie.leroy@example.com',
      phone_number: '0712345678',
    },
    client: {
      id: 103,
      username: 'younsk',
      avatar_url: 'https://ui-avatars.com/api/?name=Youns+Kihl',
      email: 'youns.dev@example.com',
      phone_number: '0611223344',
    },
  },
  {
    id: 1005,
    start_date: '2025-04-05T00:00:00Z',
    end_date: '2025-04-07T00:00:00Z',
    total_cost: 120,
    status: 'completed',
    created_at: '2025-03-25T14:15:00Z',
    delivery_option: true,
    contract_url: 'https://example.com/contracts/1005.pdf',
    listing: {
      id: 5,
      title: 'Meta Quest 3 VR Headset',
      main_image: 'https://picsum.photos/600/400?random=5',
    },
    partner: {
      id: 101,
      username: 'hmed_samaki',
      avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
      email: 'jean.dupont@example.com',
      phone_number: '0123456789',
    },
    client: {
      id: 103,
      username: 'younsk',
      avatar_url: 'https://ui-avatars.com/api/?name=Youns+Kihl',
      email: 'youns.dev@example.com',
      phone_number: '0611223344',
    },
  },
  {
    id: 1006,
    start_date: '2025-04-15T00:00:00Z',
    end_date: '2025-04-16T00:00:00Z',
    total_cost: 55,
    status: 'canceled',
    created_at: '2025-04-10T10:00:00Z',
    delivery_option: false,
    contract_url: null,
    listing: {
      id: 6,
      title: 'BenQ TK700 4K Projector',
      main_image: 'https://picsum.photos/600/400?random=6',
    },
    partner: {
      id: 102,
      username: 'samir_mofakir',
      avatar_url: 'https://ui-avatars.com/api/?name=Alice+Martin',
      email: 'alice.martin@example.com',
      phone_number: '0987654321',
    },
    client: {
      id: 103,
      username: 'younsk',
      avatar_url: 'https://ui-avatars.com/api/?name=Youns+Kihl',
      email: 'youns.dev@example.com',
      phone_number: '0611223344',
    },
  },
  {
    id: 1007,
    start_date: '2025-02-10T00:00:00Z',
    end_date: '2025-02-12T00:00:00Z',
    total_cost: 75,
    status: 'completed',
    created_at: '2025-02-01T08:30:00Z',
    delivery_option: true,
    contract_url: 'https://example.com/contracts/1007.pdf',
    listing: {
      id: 7,
      title: 'GoPro HERO12 Black',
      main_image: 'https://picsum.photos/600/400?random=7',
    },
    partner: {
      id: 103,
      username: 'ilyas_lmatag',
      avatar_url: 'https://ui-avatars.com/api/?name=Felix+Bernard',
      email: 'felix.bernard@example.com',
      phone_number: '0611223344',
    },
    client: {
      id: 103,
      username: 'younsk',
      avatar_url: 'https://ui-avatars.com/api/?name=Youns+Kihl',
      email: 'youns.dev@example.com',
      phone_number: '0611223344',
    },
  },
  {
    id: 1008,
    start_date: '2025-01-05T00:00:00Z',
    end_date: '2025-01-06T00:00:00Z',
    total_cost: 35,
    status: 'completed',
    created_at: '2024-12-28T15:45:00Z',
    delivery_option: false,
    contract_url: 'https://example.com/contracts/1008.pdf',
    listing: {
      id: 1,
      title: 'PlayStation 5 Slim',
      main_image: 'https://picsum.photos/600/400?random=8',
    },
    partner: {
      id: 101,
      username: 'hmed_samaki',
      avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
      email: 'jean.dupont@example.com',
      phone_number: '0123456789',
    },
    client: {
      id: 103,
      username: 'younsk',
      avatar_url: 'https://ui-avatars.com/api/?name=Youns+Kihl',
      email: 'youns.dev@example.com',
      phone_number: '0611223344',
    },
  },
  {
    id: 1009,
    start_date: '2025-01-20T00:00:00Z',
    end_date: '2025-01-22T00:00:00Z',
    total_cost: 90,
    status: 'canceled',
    created_at: '2025-01-15T11:20:00Z',
    delivery_option: true,
    contract_url: null,
    listing: {
      id: 3,
      title: 'Sony Alpha a7 IV Camera',
      main_image: 'https://picsum.photos/600/400?random=9',
    },
    partner: {
      id: 103,
      username: 'ilyas_lmatag',
      avatar_url: 'https://ui-avatars.com/api/?name=Felix+Bernard',
      email: 'felix.bernard@example.com',
      phone_number: '0611223344',
    },
    client: {
      id: 103,
      username: 'younsk',
      avatar_url: 'https://ui-avatars.com/api/?name=Youns+Kihl',
      email: 'youns.dev@example.com',
      phone_number: '0611223344',
    },
  },
  {
    id: 1010,
    start_date: '2025-02-25T00:00:00Z',
    end_date: '2025-02-28T00:00:00Z',
    total_cost: 160,
    status: 'completed',
    created_at: '2025-02-18T09:30:00Z',
    delivery_option: true,
    contract_url: 'https://example.com/contracts/1010.pdf',
    listing: {
      id: 2,
      title: 'DJI Mini 4 Pro Drone',
      main_image: 'https://picsum.photos/600/400?random=10',
    },
    partner: {
      id: 102,
      username: 'samir_mofakir',
      avatar_url: 'https://ui-avatars.com/api/?name=Alice+Martin',
      email: 'alice.martin@example.com',
      phone_number: '0987654321',
    },
    client: {
      id: 103,
      username: 'younsk',
      avatar_url: 'https://ui-avatars.com/api/?name=Youns+Kihl',
      email: 'youns.dev@example.com',
      phone_number: '0611223344',
    },
  },
];

// Mock data for partner bookings
const mockPartnerBookings: Reservation[] = [
  // PENDING - waiting for partner approval
  {
    id: 2001,
    start_date: '2025-05-15T00:00:00Z',
    end_date: '2025-05-17T00:00:00Z',
    total_cost: 120,
    status: 'pending',
    created_at: '2025-05-01T14:20:00Z',
    delivery_option: true,
    contract_url: null,
    listing: {
      id: 101,
      title: 'Canon EOS R5 Camera',
      main_image: 'https://picsum.photos/600/400?random=101',
    },
    partner: {
      id: 101, // Current user (partner)
      username: 'hmed_samaki',
      avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
      email: 'jean.dupont@example.com',
      phone_number: '0123456789',
    },
    client: {
      id: 201,
      username: 'marcus_photo',
      avatar_url: 'https://ui-avatars.com/api/?name=Marcus+Photo',
      email: 'marcus@example.com',
      phone_number: '0612345678',
    },
  },
  // CONFIRMED - partner has accepted, not yet started
  {
    id: 2002,
    start_date: '2025-06-05T00:00:00Z',
    end_date: '2025-06-08T00:00:00Z',
    total_cost: 240,
    status: 'confirmed',
    created_at: '2025-05-10T09:15:00Z',
    delivery_option: false,
    contract_url: 'https://example.com/contracts/2002.pdf',
    listing: {
      id: 102,
      title: 'DJI Mavic 3 Pro Drone',
      main_image: 'https://picsum.photos/600/400?random=102',
    },
    partner: {
      id: 101, // Current user (partner)
      username: 'hmed_samaki',
      avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
      email: 'jean.dupont@example.com',
      phone_number: '0123456789',
    },
    client: {
      id: 202,
      username: 'sarah_filmmaker',
      avatar_url: 'https://ui-avatars.com/api/?name=Sarah+Filmmaker',
      email: 'sarah@example.com',
      phone_number: '0698765432',
    },
  },
  // ONGOING - currently being used by client
  {
    id: 2003,
    start_date: '2025-05-05T00:00:00Z',
    end_date: '2025-05-10T00:00:00Z',
    total_cost: 300,
    status: 'ongoing',
    created_at: '2025-04-20T16:45:00Z',
    delivery_option: true,
    contract_url: 'https://example.com/contracts/2003.pdf',
    listing: {
      id: 103,
      title: 'Professional Lighting Kit',
      main_image: 'https://picsum.photos/600/400?random=103',
    },
    partner: {
      id: 101, // Current user (partner)
      username: 'hmed_samaki',
      avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
      email: 'jean.dupont@example.com',
      phone_number: '0123456789',
    },
    client: {
      id: 203,
      username: 'michael_studio',
      avatar_url: 'https://ui-avatars.com/api/?name=Michael+Studio',
      email: 'michael@example.com',
      phone_number: '0633445566',
    },
  },
  // COMPLETED - successful past booking
  {
    id: 2004,
    start_date: '2025-04-01T00:00:00Z',
    end_date: '2025-04-05T00:00:00Z',
    total_cost: 200,
    status: 'completed',
    created_at: '2025-03-15T10:20:00Z',
    delivery_option: false,
    contract_url: 'https://example.com/contracts/2004.pdf',
    listing: {
      id: 104,
      title: 'Sony FX3 Cinema Camera',
      main_image: 'https://picsum.photos/600/400?random=104',
    },
    partner: {
      id: 101, // Current user (partner)
      username: 'hmed_samaki',
      avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
      email: 'jean.dupont@example.com',
      phone_number: '0123456789',
    },
    client: {
      id: 204,
      username: 'david_productions',
      avatar_url: 'https://ui-avatars.com/api/?name=David+Productions',
      email: 'david@example.com',
      phone_number: '0677889900',
    },
  },
  // Another COMPLETED booking (not yet reviewed)
  {
    id: 2005,
    start_date: '2025-03-10T00:00:00Z',
    end_date: '2025-03-12T00:00:00Z',
    total_cost: 120,
    status: 'completed',
    created_at: '2025-02-28T08:30:00Z',
    delivery_option: true,
    contract_url: 'https://example.com/contracts/2005.pdf',
    listing: {
      id: 105,
      title: 'RØDE Wireless GO II Microphone',
      main_image: 'https://picsum.photos/600/400?random=105',
    },
    partner: {
      id: 101, // Current user (partner)
      username: 'hmed_samaki',
      avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
      email: 'jean.dupont@example.com',
      phone_number: '0123456789',
    },
    client: {
      id: 205,
      username: 'emma_vlogger',
      avatar_url: 'https://ui-avatars.com/api/?name=Emma+Vlogger',
      email: 'emma@example.com',
      phone_number: '0611223344',
    },
  },
  // CANCELED - client canceled or partner declined
  {
    id: 2006,
    start_date: '2025-03-20T00:00:00Z',
    end_date: '2025-03-21T00:00:00Z',
    total_cost: 60,
    status: 'canceled',
    created_at: '2025-03-15T12:10:00Z',
    delivery_option: false,
    contract_url: null,
    listing: {
      id: 106,
      title: 'GoPro HERO 12 Black',
      main_image: 'https://picsum.photos/600/400?random=106',
    },
    partner: {
      id: 101, // Current user (partner)
      username: 'hmed_samaki',
      avatar_url: 'https://ui-avatars.com/api/?name=Jean+Dupont',
      email: 'jean.dupont@example.com',
      phone_number: '0123456789',
    },
    client: {
      id: 206,
      username: 'alex_adventures',
      avatar_url: 'https://ui-avatars.com/api/?name=Alex+Adventures',
      email: 'alex@example.com',
      phone_number: '0655667788',
    },
  },
];

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  // Déclarer la propriété sans l'initialiser ici
  //  private mockReservations: Reservation[];
  constructor(
    private reviewService: ReviewService,
    private tokenService: TokenService,
    private http: HttpClient
  ) {}

  getClientReservations(): Observable<Reservation[]> {
    /* const clientReservations: Reservation[] = mockClientReservations;
    return of(clientReservations).pipe(delay(400)); */
    const userId = this.tokenService.getUserIdFromToken();
    return this.http.get<Reservation[]>(`/api/reservations/client/${userId}`);
  }

  getPartnerReservations(): Observable<Reservation[]> {
    /* const partnerReservations: Reservation[] = mockPartnerBookings;
    return of(partnerReservations).pipe(delay(400)); */
    const userId = this.tokenService.getUserIdFromToken();
    return this.http.get<Reservation[]>(`/api/reservations/partner/${userId}`);
  }

  // this method sends a request to submit a new reservation
  createReservation(request: CreateReservationRequest): Observable<void> {
    // const url = '/api/reservations/';
    /* return this.http.post<any>(url, request).pipe(
    catchError(error => {
      console.error('Error creating reservation:', error);
      return throwError(() => new Error('Failed to create reservation. Please try again.'));
    })
  ); */
    /*return of(undefined).pipe(
      delay(3000),
      map(() => void 0) // Explicitly return void to match Observable<void>
    );*/
    return this.http.post<void>(`/api/reservations`, request);
  }

  cancelReservation(reservation_id: number): Observable<void> {
    /*const url = `/api/reservations/${reservation_id}/cancel`;
  return this.http.patch<any>(url, {}).pipe(
    catchError(error => {
      console.error('Error canceling reservation:', error);
      return throwError(() => new Error('Failed to cancel reservation. Please try again.'));
    })
  ); */
    /*
    return of(undefined).pipe(
      delay(3000),
      map(() => void 0) // Explicitly return void to match Observable<void>
    ); */
    // Need to implement endpoint to match backend
    return this.http.patch<void>(`/api/reservations/${reservation_id}`, {
      status: 'canceled',
    });
  }

  // Accept a pending reservation (partner action)
  acceptReservation(reservation_id: number): Observable<void> {
    // const url = `/api/reservations/${reservation_id}/accept`;
    /*return this.http.patch<any>(url, {}).pipe(
    catchError(error => {
      console.error('Error accepting reservation:', error);
      return throwError(() => new Error('Failed to accept reservation. Please try again.'));
    })
  );*/ /*
    return of(undefined).pipe(
      delay(3000),
      map(() => void 0) // Explicitly return void to match Observable<void>
    ); */
    // Need to implement endpoint to match backend
    return this.http.patch<void>(`/api/reservations/${reservation_id}`, {
      status: 'confirmed',
    });
  }

  // Current Angular method
  declineReservation(reservation_id: number): Observable<void> {
    // Need to implement endpoint to match backend
    return this.http.patch<void>(`/api/reservations/${reservation_id}`, {
      status: 'declined',
    });

    /*const url = `/api/reservations/${reservation_id}/decline`;
  return this.http.delete<any>(url).pipe(
    catchError(error => {
      console.error('Error declining reservation:', error);
      return throwError(() => new Error('Failed to decline reservation. Please try again.'));
    })
  ); */

    /*return of(undefined).pipe(
      delay(3000),
      map(() => void 0) // Explicitly return void to match Observable<void>
    ); */
  }

  // Current Angular method
  cancelReservationByPartner(reservation_id: number): Observable<void> {
    // Need to implement endpoint to match backend
    return this.http.patch<void>(`/api/reservations/${reservation_id}`, {
      status: 'canceled',
    });

    /*const url = `/api/reservations/${reservation_id}/cancel-by-partner`;
  return this.http.patch<any>(url, {}).pipe(
    catchError(error => {
      console.error('Error canceling reservation by partner:', error);
      return throwError(() => new Error('Failed to cancel reservation. Please try again.'));
    })
  ); */
    /*  return of(undefined).pipe(
      delay(3000),
      map(() => void 0) // Explicitly return void to match Observable<void>
    ); */
  }

  // Méthode pour obtenir les réservations "actuelles" (pending, confirmed, ongoing)
  getCurrentUserReservations(): Observable<Reservation[]> {
    const currentStatuses: ReservationStatus[] = [
      'pending',
      'confirmed',
      'ongoing',
    ];
    return this.getClientReservations().pipe(
      map((reservations) => {
        return reservations.filter((r) => currentStatuses.includes(r.status));
      })
    );
  }

  // Méthode pour obtenir l'historique des réservations (completed, canceled)
  getPastUserReservations(): Observable<Reservation[]> {
    const pastStatuses: ReservationStatus[] = ['completed', 'canceled'];

    return this.getClientReservations().pipe(
      map((reservations) => {
        return reservations.filter((r) => pastStatuses.includes(r.status));
      }),
      mergeMap((reservations) => {
        const completedReservations = reservations.filter(
          (r) => r.status === 'completed'
        );
        if (completedReservations.length === 0) {
          return of(reservations);
        }
        const reviewChecks: Observable<{ id: number; reviewed: boolean }>[] =
          completedReservations.map((reservation) =>
            this.reviewService
              .hasUserReviewedReservation(
                this.tokenService.getUserIdFromToken(),
                reservation.id
              )
              .pipe(map((reviewed) => ({ id: reservation.id, reviewed })))
          );
        return forkJoin(reviewChecks).pipe(
          map((results) => {
            const reviewStatusMap = new Map<number, boolean>();
            results.forEach((result) => {
              reviewStatusMap.set(result.id, result.reviewed);
            });
            return reservations.map((reservation) => ({
              ...reservation,
              isReviewedByCurrentUser:
                reviewStatusMap.get(reservation.id) || false,
            }));
          })
        );
      })
    );
  }

  getCurrentPartnerReservations(): Observable<Reservation[]> {
    const currentStatuses: ReservationStatus[] = [
      'pending',
      'confirmed',
      'ongoing',
    ];
    return this.getPartnerReservations().pipe(
      map((reservations) => {
        return reservations.filter((r) => currentStatuses.includes(r.status));
      }),
      mergeMap((reservations) => {
        const completedReservations = reservations.filter(
          (r) => r.status === 'completed'
        );
        if (completedReservations.length === 0) {
          return of(reservations);
        }
        const reviewChecks: Observable<{ id: number; reviewed: boolean }>[] =
          completedReservations.map((reservation) =>
            this.reviewService
              .hasUserReviewedReservation(
                this.tokenService.getUserIdFromToken(),
                reservation.id
              )
              .pipe(map((reviewed) => ({ id: reservation.id, reviewed })))
          );
        return forkJoin(reviewChecks).pipe(
          map((results) => {
            const reviewStatusMap = new Map<number, boolean>();
            results.forEach((result) => {
              reviewStatusMap.set(result.id, result.reviewed);
            });
            return reservations.map((reservation) => ({
              ...reservation,
              isReviewedByCurrentUser:
                reviewStatusMap.get(reservation.id) || false,
            }));
          })
        );
      })
    );
  }

  getPastPartnerReservations(): Observable<Reservation[]> {
    const pastStatuses: ReservationStatus[] = ['completed', 'canceled'];
    return this.getPartnerReservations().pipe(
      map((reservations) => {
        return reservations.filter((r) => pastStatuses.includes(r.status));
      })
    );
  }
}
