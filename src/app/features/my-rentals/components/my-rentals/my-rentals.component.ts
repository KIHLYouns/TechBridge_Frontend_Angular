import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Importer OnInit
import { Router } from '@angular/router'; // Importer Router
import {
  Reservation,
  ReservationsService,
} from '../../services/reservations.service'; // Importer le service
import { TokenService } from '../../../auth/services/token.service';
import { ReviewService } from '../../../../core/services/review.service';

@Component({
  selector: 'app-my-rentals',
  standalone: false,
  templateUrl: './my-rentals.component.html',
  styleUrls: ['./my-rentals.component.scss'],
})
export class MyRentalsComponent implements OnInit {
  // Implémenter OnInit
  activeTab: 'current' | 'history' = 'current';
  currentRentals: Reservation[] = [];
  pastRentals: Reservation[] = [];

  isLoadingCurrent = false;
  isLoadingPast = false;
  errorMessage = '';

  // Add these properties
  showReviewModal = false;
  showContactModal = false;
  selectedReservation: Reservation | null = null;
  currentUserId!: number | null; // Replace with your actual logic to get current user ID

  // Contact info for the modal
  contactInfo: {
    name: string;
    email?: string;
    phone?: string;
    avatar?: string;
  } | null = null;


  // Action states
  processingActionForId: number | null = null;
  actionError: string | null = null;
  actionSuccess: string | null = null;
  // Injecter le service de réservations et Router
  constructor(
    private reservationsService: ReservationsService,
    private router: Router, // Injecter Router
    private tokenService: TokenService,
    private reviewService: ReviewService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.tokenService.getUserIdFromToken();
    this.loadRentals(); // Charger les données à l'initialisation
  }

  setActiveTab(tab: 'current' | 'history'): void {
    this.activeTab = tab;
    // Optionnel : Recharger les données si elles peuvent changer pendant que l'utilisateur est sur la page
    // if (tab === 'current' && this.currentRentals.length === 0 && !this.isLoadingCurrent) this.loadCurrentRentals();
    // if (tab === 'history' && this.pastRentals.length === 0 && !this.isLoadingPast) this.loadPastRentals();
  }

  loadRentals(): void {
    this.loadCurrentRentals();
    this.loadPastRentals();
  }

  loadCurrentRentals(): void {
    this.isLoadingCurrent = true;
    this.errorMessage = ''; // Réinitialiser les erreurs spécifiques à cet appel si nécessaire

    this.reservationsService.getCurrentUserReservations().subscribe({
      next: (data) => {
        this.currentRentals = data;
        this.isLoadingCurrent = false;
      },
      error: (err) => {
        console.error('Error loading current rentals:', err);
        this.errorMessage =
          'Could not load current rentals. Please try again later.';
        this.isLoadingCurrent = false;
      },
    });
  }

  // this loads
  loadPastRentals(): void {
    this.isLoadingPast = true;
    this.reservationsService.getPastUserReservations().subscribe({
      next: (data) => {
        this.pastRentals = data;
        this.isLoadingPast = false;
      },
      error: (err) => {
        console.error('Error loading past rentals:', err);
        if (!this.errorMessage || this.currentRentals.length > 0) {
          this.errorMessage =
            'Could not load rental history. Please try again later.';
        }
        this.isLoadingPast = false;
      },
    });
  }

  // --- Méthodes utilitaires ---

  /**
   * Calcule la différence en jours entre deux dates.
   * Ajoute 1 pour inclure le jour de début et de fin.
   */
  calculateDays(
    startDateStr: string | undefined,
    endDateStr: string | undefined
  ): number | null {
    if (!startDateStr || !endDateStr) {
      return null;
    }
    try {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      // Vérifier si les dates sont valides
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error(
          'Invalid date format provided:',
          startDateStr,
          endDateStr
        );
        return null;
      }
      // Calculer la différence en millisecondes
      const diffTime = end.getTime() - start.getTime();
      // Convertir en jours et ajouter 1
      // Utiliser Math.max pour s'assurer qu'une location le même jour compte pour 1 jour
      const diffDays =
        Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) + 1;
      return diffDays;
    } catch (e) {
      console.error('Error calculating days:', e);
      return null; // Retourne null en cas d'erreur
    }
  }

  // --- Méthodes pour les actions (Exemples à implémenter) ---

  goToListing(listing_id: number | undefined): void {
    if (!listing_id) return;
    this.router.navigate(['/listings', listing_id]); // Navigue vers la page détail
  }

  acceptRental(rentalId: number): void {
    console.log(`Accepting rental ${rentalId}`);
    // TODO: Appeler le service pour mettre à jour le statut de la réservation en 'confirmed'
    // Exemple: this.reservationsService.updateReservationStatus(rentalId, 'confirmed').subscribe(() => { ... });
    // Mettre à jour l'affichage :
    // 1. Trouver la réservation dans currentRentals
    // 2. Changer son statut localement en 'confirmed'
    // 3. Ou simplement recharger les données avec this.loadRentals() ou this.loadCurrentRentals()
    alert(`Action: Accept rental ${rentalId}`); // Placeholder
  }

  cancelRental(rentalId: number): void {
    // Confirm before canceling
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    this.processingActionForId = rentalId; // Track this specific reservation ID
    this.actionError = null;

    this.reservationsService.cancelReservation(rentalId).subscribe({
      next: () => {
        console.log('Reservation canceled successfully');
        this.actionSuccess = 'Reservation canceled successfully';
        setTimeout(() => {
          this.actionSuccess = null;
          this.cdRef.markForCheck();
        }, 3000);

        this.loadRentals(); // Reload all rentals
        this.processingActionForId = null;
      },
      error: (error) => {
        console.error('Error canceling reservation:', error);
        this.actionError = 'Failed to cancel reservation. Please try again.';
        this.processingActionForId = null;
      },
    });
  }

  leaveReview(rentalId: number): void {
    console.log(`Opening review modal for rental ${rentalId}`);

    // Find the rental in pastRentals
    const rental = this.pastRentals.find((r) => r.id === rentalId);

    if (rental && rental.status === 'completed') {
      this.selectedReservation = rental;
      this.showReviewModal = true;
    } else {
      console.error('Cannot leave review: rental not found or not completed');
    }
  }

  closeReviewModal(success: boolean): void {
    console.log('closing modal');
    if (success && this.selectedReservation) {
      // If review was successful, reload past rentals to update status
      this.loadPastRentals();
    }

    this.showReviewModal = false;
    this.selectedReservation = null;
  }

  hasBeenReviewed(rental: Reservation): boolean {
    // Just check the property that was added by the service
    return rental.isReviewedByCurrentUser === true;
  }

  rentAgain(listing_id: number | undefined): void {
    if (!listing_id) return;
    console.log(`Renting again listing ${listing_id}`);
    this.router.navigate(['/listings', listing_id]); // Utiliser le Router pour naviguer
  }

  // Updated contact partner method
  contactPartner(partnerId: number | undefined): void {
    if (!partnerId) return;
    
    // Find the rental with this partner
    const rental = [...this.currentRentals, ...this.pastRentals].find(
      r => r.partner?.id === partnerId
    );
    
    if (!rental || !rental.partner) {
      this.actionError = 'Cannot find partner information.';
      setTimeout(() => {
        this.actionError = null;
        this.cdRef.markForCheck();
      }, 3000);
      return;
    }
    
    // Prepare contact info for the modal
    this.contactInfo = {
      name: rental.partner.username,
      email: rental.partner.email,
      phone: rental.partner.phone_number || undefined,
      avatar: rental.partner.avatar_url || undefined
    };
    
    this.showContactModal = true;
    this.cdRef.markForCheck();
  }

    closeContactModal(): void {
    this.showContactModal = false;
    this.contactInfo = null;
  }

}
