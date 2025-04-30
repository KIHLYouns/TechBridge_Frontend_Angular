import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Listing } from '../../../../shared/database.model';
import { ListingsService } from '../../services/listings.service';

@Component({
  selector: 'app-listing-detail',
  standalone: false,
  templateUrl: './listing-detail.component.html',
  styleUrl: './listing-detail.component.scss'
})
export class ListingDetailComponent implements OnInit {

  listingId!: number;
  listing$!: Observable<Listing>;
  constructor(private route: ActivatedRoute, private listingsService: ListingsService, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe({
      next: params => {
        this.listingId = +params['id'];
        this.loadListingDetails(this.listingId);
      }
    });
  }

  private loadListingDetails(id: number): void {
    this.listing$ = this.listingsService.getListingById(id);
  }

  rent(id: number) {
    this.router.navigate(['/auth/sign-in']);
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}
