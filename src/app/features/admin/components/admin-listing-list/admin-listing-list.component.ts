import { Component, OnInit } from '@angular/core';
import { Listing } from '../../../../shared/database.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-listing-list',
  standalone: false,
  templateUrl: './admin-listing-list.component.html',
  styleUrls: ['./admin-listing-list.component.scss']
})
export class AdminListingListComponent implements OnInit {
  listings: Listing[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  searchQuery: string = '';
  statusFilter: string = '';

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadListings();
  }

  loadListings(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.adminService.getListings(this.statusFilter).subscribe({
      next: (data) => {
        this.listings = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load listings.';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  toggleStatus(listing: Listing): void {
    if (!listing.id) return;
    
    const originalStatus = listing.status;
    listing.status = listing.status === 'active' ? 'inactive' : 'active';

    this.adminService.updateListingStatus(listing.id, 'toggleStatus').subscribe({
      next: () => {
        // Listing status updated successfully
      },
      error: (err) => {
        listing.status = originalStatus;
        this.errorMessage = err.error?.message || 'Failed to update listing status.';
        console.error(err);
      }
    });
  }

  toggleArchived(listing: Listing): void {
    if (!listing.id) return;
    
    const originalStatus = listing.status;
    listing.status = listing.status === 'archived' ? 'inactive' : 'archived';

    this.adminService.updateListingStatus(listing.id, 'toggleArchivedStatus').subscribe({
      next: () => {
        // Listing archived status updated successfully
      },
      error: (err) => {
        listing.status = originalStatus;
        this.errorMessage = err.error?.message || 'Failed to update listing archived status.';
        console.error(err);
      }
    });
  }

  applyFilter(): void {
    this.loadListings();
  }

  clearFilter(): void {
    this.statusFilter = '';
    this.loadListings();
  }

  get filteredListings(): Listing[] {
    if (!this.searchQuery.trim()) {
      return this.listings;
    }
    
    const query = this.searchQuery.toLowerCase();
    return this.listings.filter(listing => 
      listing.title?.toLowerCase().includes(query) || 
      listing.description?.toLowerCase().includes(query) ||
      listing.partner?.username?.toLowerCase().includes(query)
    );
  }
}
