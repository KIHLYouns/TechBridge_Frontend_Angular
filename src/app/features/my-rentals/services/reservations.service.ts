import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { delay, map, mergeMap } from 'rxjs/operators';
import { ReservationStatus, Review } from '../../../shared/database.model'; // Import Review
import { ListingsService } from '../../listings/services/listings.service'; // Pour réutiliser les mocks
import { ReviewService } from '../../../core/services/review.service';
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

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  // Déclarer la propriété sans l'initialiser ici
  //  private mockReservations: Reservation[];
  constructor(
    private reviewService: ReviewService,
    private tokenService: TokenService
  ) {}

  // Méthode pour obtenir les réservations "actuelles" (pending, confirmed, ongoing)
  getCurrentUserReservations(): Observable<Reservation[]> {
    const currentStatuses: ReservationStatus[] = [
      'pending',
      'confirmed',
      'ongoing',
    ];

    const current = mockClientReservations.filter((r) =>
      currentStatuses.includes(r.status)
    );
    // Simule un appel API avec un délai
    return of(current).pipe(delay(400));
  }

  // Méthode pour obtenir l'historique des réservations (completed, canceled)
  getPastUserReservations(): Observable<Reservation[]> {
    const pastStatuses: ReservationStatus[] = ['completed', 'canceled'];

    // Filter reservations by status
    const past = mockClientReservations.filter((r) =>
      pastStatuses.includes(r.status)
    );

    // Return past reservations with review status
    return of(past).pipe(
      delay(600),
      // Then, check which reservations have been reviewed by current user
      mergeMap((reservations) => {
        // Only process completed reservations that need review status
        const completedReservations = reservations.filter(
          (r) => r.status === 'completed'
        );

        if (completedReservations.length === 0) {
          // If no completed reservations, just return the original list
          return of(reservations);
        }

        // Create an array of observables that check review status
        const reviewChecks: Observable<{ id: number; reviewed: boolean }>[] =
          completedReservations.map((reservation) =>
            this.reviewService
              .hasUserReviewedReservation(
                this.tokenService.getUserIdFromToken(),
                reservation.id
              )
              .pipe(map((reviewed) => ({ id: reservation.id, reviewed })))
          );

        // Use forkJoin to wait for all checks to complete
        return forkJoin(reviewChecks).pipe(
          map((results) => {
            // Create a map of reservation IDs to review status
            const reviewStatusMap = new Map<number, boolean>();
            results.forEach((result) => {
              reviewStatusMap.set(result.id, result.reviewed);
            });

            // Update each reservation with its review status
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

  // Ajoutez ici d'autres méthodes si nécessaire (ex: cancelReservation(id))
}

/* this.mockReservations = [
      // --- Réservations Actuelles (Exemples) ---
      {
        id: 1001,
        start_date: '2025-05-10T00:00:00Z', // Future date
        end_date: '2025-05-12T00:00:00Z',
        total_cost: 105, // 35 * 3 days (adjust logic if needed)
        status: 'pending',
        created_at: '2025-04-28T10:00:00Z',
        delivery_option: false,
        client: this.listingsService.mockPartners[3], // Example client
        partner: this.listingsService.mockPartners[0], // Partner from listing
        listing: this.listingsService.mockListings[0], // PS5
        payment: undefined,
        reviews: [],
      },
      {
        id: 1002,
        start_date: '2025-05-20T00:00:00Z', // Future date
        end_date: '2025-05-21T00:00:00Z',
        total_cost: 100, // 50 * 2 days
        status: 'confirmed',
        created_at: '2025-04-25T15:30:00Z',
        delivery_option: true,
        client: this.listingsService.mockPartners[2], // Example client
        partner: this.listingsService.mockPartners[1], // Partner from listing
        listing: this.listingsService.mockListings[1], // DJI Drone
        payment: undefined,
        reviews: [],
      },
      {
        id: 1003,
        start_date: '2025-06-01T00:00:00Z', // Future date
        end_date: '2025-06-03T00:00:00Z',
        total_cost: 180, // 60 * 3 days
        status: 'ongoing',
        created_at: '2025-04-29T11:00:00Z',
        delivery_option: true,
        client: this.listingsService.mockPartners[1], // Example client
        partner: this.listingsService.mockPartners[2], // Partner from listing
        listing: this.listingsService.mockListings[2], // Sony Camera
        payment: undefined,
        reviews: [],
      },
      // --- Historique des Réservations (Exemples) ---
      {
        id: 1004,
        start_date: '2025-03-01T00:00:00Z', // Past date
        end_date: '2025-03-03T00:00:00Z',
        total_cost: 40, // 20 * 2 days
        status: 'completed',
        created_at: '2025-02-20T09:00:00Z',
        delivery_option: false,
        client: this.listingsService.mockPartners[0], // Example client
        partner: this.listingsService.mockPartners[3], // Partner from listing
        listing: this.listingsService.mockListings[3], // Shure Mic
        payment: undefined,
        reviews: [], // On pourrait ajouter un mock de review ici
      },
      {
        id: 1005,
        start_date: '2025-04-05T00:00:00Z', // Past date
        end_date: '2025-04-07T00:00:00Z',
        total_cost: 120, // 40 * 3 days
        status: 'completed',
        created_at: '2025-03-25T14:15:00Z',
        delivery_option: true,
        client: this.listingsService.mockPartners[3], // Example client
        partner: this.listingsService.mockPartners[0], // Partner from listing
        listing: this.listingsService.mockListings[4], // Meta Quest
        payment: undefined,
        // Correction: Assurez-vous que l'objet Review correspond à l'interface
        reviews: [
          {
            id: 1,
            rating: 5,
            comment: 'Great experience!',
            is_visible: true,
            created_at: '2025-04-08T10:00:00Z',
            type: 'forObject', // ou 'forClient'/'forPartner' selon le contexte
            reviewer: this.listingsService.mockPartners[3], // Le client qui a laissé l'avis
            // reviewee: this.listingsService.mockPartners[0], // Le partenaire évalué (si type='forPartner')
            listing: this.listingsService.mockListings[4], // Le listing évalué (si type='forObject')
          } as Review,
        ], // Cast en Review pour plus de clarté
      },
      {
        id: 1006,
        start_date: '2025-04-15T00:00:00Z', // Past date but canceled
        end_date: '2025-04-16T00:00:00Z',
        total_cost: 55, // 55 * 1 day
        status: 'canceled',
        created_at: '2025-04-10T10:00:00Z',
        delivery_option: false,
        client: this.listingsService.mockPartners[2], // Example client
        partner: this.listingsService.mockPartners[1], // Partner from listing
        listing: this.listingsService.mockListings[5], // BenQ Projector
        payment: undefined,
        reviews: [],
      },
    ];
  } */
