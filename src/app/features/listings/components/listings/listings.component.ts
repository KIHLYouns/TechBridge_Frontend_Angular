import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Listing } from '../../../../shared/database.model';
import { ListingsService } from '../../services/listings.service';

@Component({
  selector: 'app-listings',
  standalone: false,
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.scss'
})
export class ListingsComponent implements OnInit {

  public listings$!: Observable<Listing[]>;

  constructor(private listingsService: ListingsService){}

  ngOnInit(): void {
    this.listings$ = this.listingsService.getListings();
  }

}
