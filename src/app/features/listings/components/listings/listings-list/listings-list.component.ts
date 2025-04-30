import { Component, Input } from '@angular/core';
import { Listing } from '../../../../../shared/database.model';

@Component({
  selector: 'app-listings-list',
  standalone: false,
  templateUrl: './listings-list.component.html',
  styleUrl: './listings-list.component.scss'
})
export class ListingsListComponent {

  // this will contain an array of listings, these listings are passed down from the parent component 
  @Input() listings: Listing[] = [];

}
