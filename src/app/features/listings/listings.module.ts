import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ListingsRoutingModule } from './listings-routing.module';

import { ListingDetailComponent } from './components/listings-detail/listing-detail.component';
import { CategoriesComponent } from './components/listings/categories/categories.component';
import { FiltersSideBarComponent } from './components/listings/filters-side-bar/filters-side-bar.component';
import { ListingCardComponent } from './components/listings/listings-list/listing-card/listing-card.component';
import { ListingsListComponent } from './components/listings/listings-list/listings-list.component';
import { ListingsComponent } from './components/listings/listings.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartnerReviewsComponent } from './components/partner-reviews/partner-reviews.component';

@NgModule({
  declarations: [
    ListingsComponent,
    ListingsListComponent,
    ListingDetailComponent,
    ListingCardComponent,
    CategoriesComponent,
    FiltersSideBarComponent,
    PartnerReviewsComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ListingsRoutingModule
  ]
})
export class ListingsModule { }
