import { Component, Input } from '@angular/core';
import { Rental } from '../../../../models/rental.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listing-card',
  standalone: false,
  templateUrl: './listing-card.component.html',
  styleUrl: './listing-card.component.scss',
})
export class ListingCardComponent {
  @Input() rental!: Rental;
  constructor(private router: Router){}
  public navigateToDetail() {
    this.router.navigate(['/rentals', this.rental.id]);
  }
}
