import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Listing } from '../../../../shared/database.model';
import { ListingsService } from '../../../listings/services/listings.service';

@Component({
  selector: 'app-partner-dashboard',
  standalone: false,
  templateUrl: './partner-dashboard.component.html',
  styleUrls: ['./partner-dashboard.component.scss'] // Changed from styleUrl to styleUrls
})
export class PartnerDashboardComponent implements OnInit {
  // Hardcoded partner ID, replace with actual logged-in partner ID from auth service
  private partnerId = 101;

  allPartnerListings: Listing[] = [];
  filteredPartnerListings: Listing[] = [];
  selectedStatusFilter: string = 'All Listings';

  // Static stats data (as per requirement)
  stats = {
    activeListings: { value: 0, limit: 5, current: 0 }, // Will be updated dynamically
    upcomingBookings: 7,
    pendingReviews: 4,
  };

  constructor(
    private listingsService: ListingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listingsService.getListings().subscribe({
      next: (allListings) => {
        this.allPartnerListings = allListings;
        this.updateDynamicStats();
        this.applyFilter();
      },
      error: (err) => {
        console.error('Error fetching listings:', err);
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
        listingsToFilter = listingsToFilter.filter(l => l.status === 'paused');
        break;
      case 'Archived':
        listingsToFilter = listingsToFilter.filter(l => l.status === 'archived');
        break;
      case 'Premium':
        listingsToFilter = listingsToFilter.filter(l => l.is_premium);
        break;
      case 'All Listings':
      default:
        // No additional status/type filter needed
        break;
    }
    this.filteredPartnerListings = listingsToFilter;
  }

  getListingStatusClass(listing: Listing): string {
    if (listing.status === 'active') return 'available';
    if (listing.status === 'paused') return 'paused';
    if (listing.status === 'archived') return 'archived';
    return '';
  }

  getListingStatusText(listing: Listing): string {
    if (listing.status === 'active') return 'Active';
    if (listing.status === 'paused') return 'Paused';
    if (listing.status === 'archived') return 'Archived';
    return listing.status ? (listing.status as string).charAt(0).toUpperCase() + (listing.status as string).slice(1) : 'Unknown';
  }

  // Navigation methods
  goToAddListing(): void {
    this.router.navigate(['/listing']);
  }

  editListing(listingId: number | undefined): void {
    if (listingId) {
      this.router.navigate(['/listing', listingId, 'edit']);
    }
  }

  goToPartnerBookings(): void {
    this.router.navigate(['/partner-bookings']);
  }

  goToPartnerProfileReviews(): void {
    this.router.navigate(['/partner-bookings'], { fragment: 'reviews' });
  }

  // Listing action methods (mock implementations)
  pauseListing(listing: Listing): void {
    listing.status = 'paused';
    console.log(`Paused listing: ${listing.title}`);
    this.updateDynamicStats();
    this.applyFilter(); // Re-apply filter to update view
  }

  activateListing(listing: Listing): void {
    listing.status = 'active';
    console.log(`Activated listing: ${listing.title}`);
    this.updateDynamicStats();
    this.applyFilter();
  }

  archiveListing(listing: Listing): void {
    listing.status = 'archived';
    console.log(`Archived listing: ${listing.title}`);
    this.updateDynamicStats();
    this.applyFilter();
  }

  restoreListing(listing: Listing): void {
    listing.status = 'active'; // Or 'paused' if that was its previous state before archiving
    console.log(`Restored listing: ${listing.title}`);
    this.updateDynamicStats();
    this.applyFilter();
  }

  boostListing(listing: Listing): void {
    // Mock: In a real app, this might set is_premium or call an API
    listing.is_premium = true; // Example: make it premium
    // Potentially update premium_start_date and premium_end_date
    console.log(`Boosted listing: ${listing.title}`);
    this.applyFilter();
  }
}