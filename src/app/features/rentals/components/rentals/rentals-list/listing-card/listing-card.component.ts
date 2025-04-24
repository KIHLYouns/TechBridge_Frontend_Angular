import { Component, Input } from '@angular/core';
import { Rental } from '../../../../models/rental.model';

@Component({
  selector: 'app-listing-card',
  standalone: false,
  templateUrl: './listing-card.component.html',
  styleUrl: './listing-card.component.scss'
})
export class ListingCardComponent {
  @Input() rental!: Rental;

}
