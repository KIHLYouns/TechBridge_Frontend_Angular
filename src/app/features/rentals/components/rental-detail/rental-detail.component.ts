import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Rental } from '../../models/rental.model';
import { RentalsService } from '../../services/rentals.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rental-detail',
  standalone: false,
  templateUrl: './rental-detail.component.html',
  styleUrl: './rental-detail.component.scss'
})
export class RentalDetailComponent implements OnInit{

  rentalId!: number;
  rental$!: Observable<Rental>;
  constructor(private route: ActivatedRoute, private rentalsService: RentalsService, private router: Router){}

  ngOnInit(): void {
    this.route.params.subscribe({
      next: params => {
        this.rentalId = +params['id'];
        this.loadRentalDetails(this.rentalId);
      } 
    })
  }

  private loadRentalDetails(id: number): void {
   this.rental$ = this.rentalsService.getRentalById(id);
  }

  rent(id: number) {
    // we check if a the user is authenticated 
    // if yes , we retrieve his id and call the proper api
    // else we redirect to the login page
    this.router.navigate(['/auth/sign-in']);
  }

}
