import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ReviewService } from '../../../core/services/review.service';
import { Image, ReservationStatus } from '../../../shared/database.model'; // Import Review
import { TokenService } from '../../auth/services/token.service';

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
  images: Image[];
}

export interface CreateReservationRequest {
  start_date: string; // Format: YYYY-MM-DD
  end_date: string; // Format: YYYY-MM-DD
  listing_id: number;
  client_id: number;
  delivery_option: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  private apiUrl = 'http://localhost:8000/api';

  // Déclarer la propriété sans l'initialiser ici
  //  private mockReservations: Reservation[];
  constructor(
    private reviewService: ReviewService,
    private tokenService: TokenService,
    private http: HttpClient
  ) {}

    private transformReservation(data: any): Reservation {
      return {
          id: data.reservation_id, // mapping de reservation_id en id
          start_date: data.start_date,
          end_date: data.end_date,
          total_cost: data.total_cost,
          status: data.status,
          created_at: data.created_at,
          delivery_option: data.delivery_option,
          contract_url: data.contract_url,
          listing: data.listing,
          partner: data.partner,
          client: data.client,
          isReviewedByCurrentUser: data.isReviewedByCurrentUser || false,
      };
  }
  
  getClientReservations(): Observable<Reservation[]> {
      const userId = this.tokenService.getUserIdFromToken();
      return this.http.get<any[]>(`${this.apiUrl}/reservations/client/${userId}`).pipe(
          map(response => {
            console.log('Response from API:', response); // Log the response
            const transformedReservations = response.map(this.transformReservation.bind(this));
            console.log('Transformed Reservations:', transformedReservations); // Log the transformed reservations
            return transformedReservations; // Return the transformed reservations
          })
      );
  }
  
  getPartnerReservations(): Observable<Reservation[]> {
      const userId = this.tokenService.getUserIdFromToken();
      return this.http.get<any[]>(`${this.apiUrl}/reservations/partner/${userId}`);
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
    return this.http.post<void>(`${this.apiUrl}/reservations`, request);
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
    return this.http.patch<void>(`${this.apiUrl}/reservations/${reservation_id}`, {
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
    return this.http.patch<void>(`${this.apiUrl}/reservations/${reservation_id}`, {
      status: 'confirmed',
    });
  }

  // Current Angular method
  declineReservation(reservation_id: number): Observable<void> {
    // Need to implement endpoint to match backend
    return this.http.patch<void>(`${this.apiUrl}/reservations/${reservation_id}`, {
      status: 'canceled',
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
    return this.http.patch<void>(`${this.apiUrl}/reservations/${reservation_id}`, {
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
      map((reservations) =>
        reservations.filter((r) => pastStatuses.includes(r.status))
      ),
      mergeMap((reservations) => {
        const completedReservations = reservations.filter(
          (r) => r.status === 'completed' && r.id !== undefined
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
                reservation.id !== undefined
                  ? reviewStatusMap.get(reservation.id) || false
                  : false,
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
}
