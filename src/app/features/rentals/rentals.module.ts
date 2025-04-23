import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RentalsRoutingModule } from './rentals-routing.module';
import { RentalsComponent } from './components/rentals/rentals.component';
import { RentalsListComponent } from './components/rentals/rentals-list/rentals-list.component';
import { RentalDetailComponent } from './components/rental-detail/rental-detail.component';
import { ListingCardComponent } from './components/rentals/rentals-list/listing-card/listing-card.component';
import { CategoriesComponent } from './components/rentals/categories/categories.component';
import { FiltersSideBarComponent } from './components/rentals/filters-side-bar/filters-side-bar.component';


@NgModule({
  declarations: [
    RentalsComponent, // this wrapps other components (smart component)
    RentalsListComponent, // this is referenced inside of RentalsComponent and it contains all Rentals (dumb component)
    RentalDetailComponent, ListingCardComponent, CategoriesComponent, FiltersSideBarComponent // this is to view details about an object for Rental 
  ],
  imports: [
    CommonModule,
    RentalsRoutingModule
  ]
})
export class RentalsModule { }
