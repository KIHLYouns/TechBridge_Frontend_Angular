import { Component, OnInit } from '@angular/core';
import { Claim } from '../../../../shared/database.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-claim-list',
  standalone: false,
  templateUrl: './admin-claim-list.component.html',
  styleUrls: ['./admin-claim-list.component.scss']
})
export class AdminClaimListComponent implements OnInit {
  claims: Claim[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  searchQuery: string = '';

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.adminService.getClaims().subscribe({
      next: (data) => {
        this.claims = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load claims.';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  updateStatus(claim: Claim, status: 'resolved' | 'rejected'): void {
    if (!claim.id) return;
    
    const originalStatus = claim.status;
    claim.status = status;

    this.adminService.updateClaimStatus(claim.id, status).subscribe({
      next: () => {
        // Claim updated successfully
      },
      error: (err) => {
        claim.status = originalStatus;
        this.errorMessage = err.error?.message || 'Failed to update claim status.';
        console.error(err);
      }
    });
  }

  get filteredClaims(): Claim[] {
    if (!this.searchQuery.trim()) {
      return this.claims;
    }
    
    const query = this.searchQuery.toLowerCase();
    return this.claims.filter(claim => 
      claim.user?.username?.toLowerCase().includes(query) || 
      claim.description?.toLowerCase().includes(query) ||
      claim.listing?.title?.toLowerCase().includes(query)
    );
  }
}
