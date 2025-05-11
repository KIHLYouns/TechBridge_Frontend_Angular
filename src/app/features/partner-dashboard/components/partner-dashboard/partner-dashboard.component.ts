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
  styleUrls: ['./partner-dashboard.component.scss']
})
export class PartnerDashboardComponent implements OnInit {
  private partnerId: number | null = null;

  allPartnerListings: Listing[] = [];
  filteredPartnerListings: Listing[] = [];
  selectedStatusFilter: string = 'All Listings';
  isLoading: boolean = true;
  errorMessage: string | null = null;

  stats = {
    activeListings: { value: 0, limit: 5, current: 0 },
    upcomingBookings: 7, // TODO: Fetch from backend BookingService
    pendingReviews: 4,   // TODO: Fetch from backend ReviewService
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
      this.errorMessage = "Could not identify partner. Please log in again.";
      this.isLoading = false;
    }
  }

  loadPartnerData(): void {
    if (!this.partnerId) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.listingsService.getListingsByPartnerId(this.partnerId).pipe(
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
    ).subscribe({
      next: (partnerListings) => {
        this.allPartnerListings = partnerListings;
      }
    });
  }

  updateDynamicStats(): void {
    const activeListingsCount = this.allPartnerListings.filter(l => l.status === 'active').length;
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
        listingsToFilter = listingsToFilter.filter(l => l.status === 'active');
        break;
      case 'Paused':
        listingsToFilter = listingsToFilter.filter(l => l.status === 'inactive');
        break;
      case 'Archived':
        listingsToFilter = listingsToFilter.filter(l => l.status === 'archived');
        break;
      case 'Premium':
        listingsToFilter = listingsToFilter.filter(l => l.is_premium);
        break;
      case 'All Listings':
      default:
        break;
    }
    this.filteredPartnerListings = listingsToFilter;
  }

  private updateListingLocally(listingId: number, changes: Partial<Listing>): void {
    const index = this.allPartnerListings.findIndex(l => l.id === listingId);
    if (index !== -1) {
      this.allPartnerListings[index] = { ...this.allPartnerListings[index], ...changes };
    }
  }

  pauseListing(listing: Listing): void {
    if (!listing.id) return;
    this.isLoading = true;
    this.listingsService.toggleListingStatus(listing.id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        this.updateListingLocally(listing.id!, { status: response.status as ListingStatus });
      },
      error: (err: HttpErrorResponse) => {
        this.handleActionError(err, 'pause');
      }
    });
  }

  activateListing(listing: Listing): void {
    if (!listing.id) return;
    this.isLoading = true;
    this.listingsService.toggleListingStatus(listing.id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        this.updateListingLocally(listing.id!, { status: response.status as ListingStatus });
      },
      error: (err: HttpErrorResponse) => {
        this.handleActionError(err, 'activate');
      }
    });
  }

  archiveListing(listing: Listing): void {
    if (!listing.id) return;
    this.isLoading = true;
    this.listingsService.toggleListingArchivedStatus(listing.id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.updateListingLocally(listing.id!, { status: 'archived' });
      },
      error: (err: HttpErrorResponse) => {
        this.handleActionError(err, 'archive');
      }
    });
  }

  restoreListing(listing: Listing): void {
    if (!listing.id) return;
    this.isLoading = true;
    this.listingsService.toggleListingArchivedStatus(listing.id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.loadPartnerData();
      },
      error: (err: HttpErrorResponse) => {
        this.handleActionError(err, 'restore');
      }
    });
  }

  private handleActionError(err: HttpErrorResponse, action: string, specificMessage?: string): void {
    console.error(`Error ${action} listing:`, err);
    this.errorMessage = specificMessage || err.error?.message || err.error?.error || `Failed to ${action} listing.`;
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
      this.router.navigate(['/profile', this.partnerId], { fragment: 'reviews' });
    } else {
      this.router.navigate(['/profile'], { fragment: 'reviews' });
    }
  }
}