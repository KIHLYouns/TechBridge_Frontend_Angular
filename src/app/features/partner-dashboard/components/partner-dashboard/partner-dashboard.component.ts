import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Listing, ListingStatus } from '../../../../shared/database.model';
import { ListingsService } from '../../../listings/services/listings.service';
import { UserService } from '../../../profile/services/user.service'; // Import UserService

@Component({
  selector: 'app-partner-dashboard',
  standalone: false,
  templateUrl: './partner-dashboard.component.html',
  styleUrls: ['./partner-dashboard.component.scss'],
})
export class PartnerDashboardComponent implements OnInit {
  private partnerId: number | null = null;

  allPartnerListings: Listing[] = [];
  filteredPartnerListings: Listing[] = [];
  selectedStatusFilter: string = 'All Listings';
  isLoading: boolean = true;
  errorMessage: string | null = null;
  successMessage: string | null = null; // Nouvelle propriété pour les messages de succès
  private toastTimeout: any; // Variable pour gérer le délai des toasts

  stats = {
    activeListings: { value: 0, limit: 5, current: 0 },
    upcomingBookings: 7, // TODO: Fetch from backend BookingService
    pendingReviews: 4, // TODO: Fetch from backend ReviewService
  };

  constructor(
    private listingsService: ListingsService,
    private userService: UserService, // Inject UserService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.partnerId = this.userService.getCurrentUserId(); // Correction ici

    if (this.partnerId) {
      this.loadPartnerData();
    } else {
      this.errorMessage = 'Could not identify partner. Please log in again.';
      this.isLoading = false;
    }
  }

  loadPartnerData(): void {
    if (!this.partnerId) return;

    this.isLoading = true;
    this.errorMessage = null; // Réinitialiser les messages lors du chargement
    this.successMessage = null;
    this.listingsService
      .getListingsByPartnerId(this.partnerId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.updateDynamicStats();
          this.applyFilter();
        }),
        catchError((err: HttpErrorResponse) => {
          this.errorMessage = 'Failed to load listings. Please try again.';
          this.allPartnerListings = [];
          return of([]);
        })
      )
      .subscribe({
        next: (partnerListings) => {
          this.allPartnerListings = partnerListings;
        },
      });
  }

  updateDynamicStats(): void {
    const activeListingsCount = this.allPartnerListings.filter(
      (l) => l.status === 'active'
    ).length;
    this.stats.activeListings.value = activeListingsCount;
    this.stats.activeListings.current = activeListingsCount;
  }

  applyFilter(event?: Event): void {
    if (event) {
      this.selectedStatusFilter = (event.target as HTMLSelectElement).value;
    }

    let listingsToFilter = [...this.allPartnerListings];

    switch (this.selectedStatusFilter) {
      case 'Active':
        listingsToFilter = listingsToFilter.filter(
          (l) => l.status === 'active'
        );
        break;
      case 'Paused':
        listingsToFilter = listingsToFilter.filter(
          (l) => l.status === 'inactive'
        );
        break;
      case 'Archived':
        listingsToFilter = listingsToFilter.filter(
          (l) => l.status === 'archived'
        );
        break;
      case 'Premium':
        listingsToFilter = listingsToFilter.filter((l) => l.is_premium);
        break;
      case 'All Listings':
      default:
        listingsToFilter = listingsToFilter.filter(
          (l) => l.status !== 'archived'
        );
        break;
    }
    this.filteredPartnerListings = listingsToFilter;
  }

  private updateListingLocally(
    listingId: number,
    changes: Partial<Listing>
  ): void {
    const indexInAll = this.allPartnerListings.findIndex(
      (l) => l.id === listingId
    );
    if (indexInAll !== -1) {
      this.allPartnerListings[indexInAll] = {
        ...this.allPartnerListings[indexInAll],
        ...changes,
      };
    }
    this.applyFilter();
    this.updateDynamicStats();
  }

  pauseListing(listing: Listing): void {
    if (!listing.id) return;
    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;
    this.listingsService
      .toggleListingStatus(listing.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.updateListingLocally(listing.id!, {
            status: response.status as ListingStatus,
          });
          if (response.message) {
            this.showMessage('success', response.message);
          }
        },
        error: (err) => this.handleActionError(err, 'pausing'),
      });
  }

  activateListing(listing: Listing): void {
    if (!listing.id) return;
    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;
    this.listingsService
      .toggleListingStatus(listing.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response?.status) {
            this.updateListingLocally(listing.id!, {
              status: response.status as ListingStatus,
            });
            if (response.warning) {
              this.showMessage('error', response.warning);
            } else if (response.message) {
              this.showMessage('success', response.message);
            }
          } else if (response?.warning) {
            this.showMessage('error', response.warning);
          }
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 403 && err.error?.error) {
            this.showMessage('error', err.error.error);
          } else {
            this.handleActionError(err, 'activating');
          }
        },
      });
  }

  archiveListing(listing: Listing): void {
    if (!listing.id) return;
    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;
    this.listingsService
      .toggleListingArchivedStatus(listing.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.updateListingLocally(listing.id!, {
            status: response.status as ListingStatus,
          });
          if (response.warning) {
            this.showMessage('error', response.warning);
          } else if (response.message) {
            this.showMessage('success', response.message);
          }
        },
        error: (err) => this.handleActionError(err, 'archiving'),
      });
  }

  restoreListing(listing: Listing): void {
    if (!listing.id) return;
    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;
    this.listingsService
      .toggleListingArchivedStatus(listing.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.updateListingLocally(listing.id!, { status: response.status });
          if (response.warning) {
            this.showMessage('error', response.warning);
          } else if (response.message) {
            this.showMessage('success', response.message);
          }
        },
        error: (err) => this.handleActionError(err, 'restoring'),
      });
  }

  private handleActionError(
    err: HttpErrorResponse,
    action: string,
    specificMessage?: string
  ): void {
    console.error(`Error ${action} listing:`, err);
    this.successMessage = null;

    let errorMessage = specificMessage || 'An unexpected error occurred.';
    if (err.error) {
      if (typeof err.error === 'string') {
        errorMessage = err.error;
      } else if (err.error.error && typeof err.error.error === 'string') {
        errorMessage = err.error.error;
      } else if (err.error.message && typeof err.error.message === 'string') {
        errorMessage = err.error.message;
      } else if (err.status === 0 || err.status === -1) {
        errorMessage = `Failed to ${action} listing. Cannot connect to the server. Please check your network connection.`;
      } else {
        errorMessage = `Failed to ${action} listing. An unexpected error occurred (Status: ${err.status}).`;
      }
    }
    this.showMessage('error', errorMessage);
  }

  private showMessage(type: 'success' | 'error', message: string): void {
    if (type === 'success') {
      this.successMessage = message;
    } else {
      this.errorMessage = message;
    }

    // Réinitialiser le délai précédent
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    // Masquer automatiquement après 5 secondes
    this.toastTimeout = setTimeout(() => {
      this.clearMessage(type);
    }, 5000);
  }

  clearMessage(type: 'success' | 'error'): void {
    if (type === 'success') {
      this.successMessage = null;
    } else {
      this.errorMessage = null;
    }
  }

  getListingStatusClass(listing: Listing): string {
    if (listing.status === 'active') return 'available';
    if (listing.status === 'inactive') return 'paused';
    if (listing.status === 'archived') return 'archived';
    return '';
  }

  getListingStatusText(listing: Listing): string {
    if (!listing.status) return 'Unknown';
    if (listing.status === 'inactive') return 'Paused';
    return listing.status.charAt(0).toUpperCase() + listing.status.slice(1);
  }

  goToAddListing(): void {
    this.router.navigate(['/listing/']);
  }

  editListing(listing_id: number | undefined): void {
    if (listing_id) {
      this.router.navigate(['/listing', listing_id, 'edit']);
    }
  }

  goToPartnerBookings(): void {
    this.router.navigate(['/partner/bookings']);
  }

  goToPartnerProfileReviews(): void {
    if (this.partnerId) {
      this.router.navigate(['/profile', this.partnerId], {
        fragment: 'reviews',
      });
    } else {
      this.router.navigate(['/profile'], { fragment: 'reviews' });
    }
  }
}
