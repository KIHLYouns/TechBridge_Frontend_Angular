import { Component, OnInit } from '@angular/core'; // Importer OnInit
import { Router } from '@angular/router'; // Importer Router
import { Reservation } from '../../../../shared/database.model'; // Importer le modèle Reservation
import { ReservationsService } from '../../services/reservations.service'; // Importer le service

@Component({
  selector: 'app-my-rentals',
  standalone: false,
  templateUrl: './my-rentals.component.html',
  styleUrls: ['./my-rentals.component.scss']
})
export class MyRentalsComponent implements OnInit { // Implémenter OnInit
  activeTab: 'current' | 'history' = 'current';
  currentRentals: Reservation[] = [];
  pastRentals: Reservation[] = [];
  isLoadingCurrent = false;
  isLoadingPast = false;
  errorMessage = '';

  // Injecter le service de réservations et Router
  constructor(
    private reservationsService: ReservationsService,
    private router: Router // Injecter Router
  ) {}

  ngOnInit(): void {
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
        this.errorMessage = 'Could not load current rentals. Please try again later.';
        this.isLoadingCurrent = false;
      }
    });
  }

  loadPastRentals(): void {
    this.isLoadingPast = true;
    // Ne pas écraser un message d'erreur potentiel de l'autre appel
    // this.errorMessage = '';

    this.reservationsService.getPastUserReservations().subscribe({
      next: (data) => {
        this.pastRentals = data;
        this.isLoadingPast = false;
      },
      error: (err) => {
        console.error('Error loading past rentals:', err);
        // Afficher une seule erreur si les deux échouent ou si l'autre a réussi
        if (!this.errorMessage || this.currentRentals.length > 0) {
          this.errorMessage = 'Could not load rental history. Please try again later.';
        }
        this.isLoadingPast = false;
      }
    });
  }

  // --- Méthodes utilitaires ---

  /**
   * Calcule la différence en jours entre deux dates.
   * Ajoute 1 pour inclure le jour de début et de fin.
   */
  calculateDays(startDateStr: string | undefined, endDateStr: string | undefined): number | null {
    if (!startDateStr || !endDateStr) {
      return null;
    }
    try {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      // Vérifier si les dates sont valides
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error("Invalid date format provided:", startDateStr, endDateStr);
        return null;
      }
      // Calculer la différence en millisecondes
      const diffTime = end.getTime() - start.getTime();
      // Convertir en jours et ajouter 1
      // Utiliser Math.max pour s'assurer qu'une location le même jour compte pour 1 jour
      const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) + 1;
      return diffDays;
    } catch (e) {
      console.error("Error calculating days:", e);
      return null; // Retourne null en cas d'erreur
    }
  }

  // --- Méthodes pour les actions (Exemples à implémenter) ---

  goToListing(listingId: number | undefined): void {
    if (!listingId) return;
    this.router.navigate(['/listings', listingId]); // Navigue vers la page détail
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
    console.log(`Canceling rental ${rentalId}`);
    // TODO: Appeler le service pour annuler la réservation
    // Exemple: this.reservationsService.cancelReservation(rentalId).subscribe(() => { ... });
    // Mettre à jour la liste ou recharger après succès
    // Par exemple, déplacer la réservation vers l'historique ou la supprimer de 'currentRentals'
    alert(`Action: Cancel rental ${rentalId}`); // Placeholder
  }

  leaveReview(rentalId: number): void {
    console.log(`Leaving review for rental ${rentalId}`);
    // TODO: Ouvrir un modal/formulaire de review
    // Appeler le service pour soumettre la review
    alert(`Action: Leave review for rental ${rentalId}`); // Placeholder
  }

  rentAgain(listingId: number | undefined): void {
    if (!listingId) return;
    console.log(`Renting again listing ${listingId}`);
    this.router.navigate(['/listings', listingId]); // Utiliser le Router pour naviguer
  }

  contactPartner(partnerId: number | undefined): void {
     if (!partnerId) return;
     console.log(`Contacting partner ${partnerId}`);
     // TODO: Implémenter la logique de contact (ex: ouvrir chat, afficher infos)
     alert(`Action: Contact partner ${partnerId}`); // Placeholder
  }
}
