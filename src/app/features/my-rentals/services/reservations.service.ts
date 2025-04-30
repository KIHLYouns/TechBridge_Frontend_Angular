import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Reservation,
  ReservationStatus,
  Review,
} from '../../../shared/database.model'; // Import Review
import { ListingsService } from '../../listings/services/listings.service'; // Pour réutiliser les mocks

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  // Déclarer la propriété sans l'initialiser ici
  private mockReservations: Reservation[];

  // Inject ListingsService pour accéder aux mocks existants (listings, users)
  constructor(private listingsService: ListingsService) {
    // Initialiser mockReservations DANS le constructeur
    this.mockReservations = [
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
  }

  // Méthode pour obtenir les réservations "actuelles" (pending, confirmed, ongoing)
  getCurrentUserReservations(): Observable<Reservation[]> {
    const currentStatuses: ReservationStatus[] = [
      'pending',
      'confirmed',
      'ongoing',
    ];
    // Simule la récupération des réservations pour un utilisateur spécifique (ici, on retourne tout pour le mock)
    // Dans une vraie appli, vous filtreriez par ID utilisateur
    const current = this.mockReservations.filter((r) =>
      currentStatuses.includes(r.status)
    );
    // Simule un appel API avec un délai
    return of(current).pipe(delay(400));
  }

  // Méthode pour obtenir l'historique des réservations (completed, canceled)
  getPastUserReservations(): Observable<Reservation[]> {
    const pastStatuses: ReservationStatus[] = ['completed', 'canceled'];
    // Simule la récupération des réservations pour un utilisateur spécifique (ici, on retourne tout pour le mock)
    // Dans une vraie appli, vous filtreriez par ID utilisateur
    const past = this.mockReservations.filter((r) =>
      pastStatuses.includes(r.status)
    );
    // Simule un appel API avec un délai
    return of(past).pipe(delay(600));
  }

  // Ajoutez ici d'autres méthodes si nécessaire (ex: cancelReservation(id), addReview(reviewData))
}
