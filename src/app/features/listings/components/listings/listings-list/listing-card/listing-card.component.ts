import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Listing } from '../../../../../../shared/database.model';

@Component({
  selector: 'app-listing-card',
  standalone: false,
  templateUrl: './listing-card.component.html',
  styleUrl: './listing-card.component.scss',
})
export class ListingCardComponent {
  @Input() listing!: Listing;
  constructor(private router: Router) {}
  public navigateToDetail() {
    this.router.navigate(['/listings', this.listing.id]);
  }
  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}
