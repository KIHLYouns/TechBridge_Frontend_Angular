import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Rental } from '../../models/rental.model';
import { RentalsService } from '../../services/rentals.service';

@Component({
  selector: 'app-rentals',
  standalone: false,
  templateUrl: './rentals.component.html',
  styleUrl: './rentals.component.scss'
})
export class RentalsComponent implements OnInit {

  public rentals$!: Observable<Rental[]>;

  constructor(private rentalsService: RentalsService){}

  ngOnInit(): void {
    this.rentals$ = this.rentalsService.getRentals();
  }

}
