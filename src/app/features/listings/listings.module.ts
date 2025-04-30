import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ListingsRoutingModule } from './listings-routing.module';

import { ListingDetailComponent } from './components/listings-detail/listing-detail.component';
import { CategoriesComponent } from './components/listings/categories/categories.component';
import { FiltersSideBarComponent } from './components/listings/filters-side-bar/filters-side-bar.component';
import { ListingCardComponent } from './components/listings/listings-list/listing-card/listing-card.component';
import { ListingsListComponent } from './components/listings/listings-list/listings-list.component';
import { ListingsComponent } from './components/listings/listings.component';

@NgModule({
  declarations: [
    ListingsComponent,
    ListingsListComponent,
    ListingDetailComponent,
    ListingCardComponent,
    CategoriesComponent,
    FiltersSideBarComponent
  ],
  imports: [
    SharedModule,
    ListingsRoutingModule
  ]
})
export class ListingsModule { }
