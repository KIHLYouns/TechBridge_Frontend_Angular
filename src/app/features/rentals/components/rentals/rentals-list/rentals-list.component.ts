import { Component, Input } from '@angular/core';
import { Rental } from '../../../models/rental.model';

@Component({
  selector: 'app-rentals-list',
  standalone: false,
  templateUrl: './rentals-list.component.html',
  styleUrl: './rentals-list.component.scss'
})
export class RentalsListComponent {

  // this will contain an array of rentals, these rentals are passed down from the parent component 
  @Input() rentals: Rental[] = [];

}
