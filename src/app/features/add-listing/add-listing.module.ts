import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddListingRoutingModule } from './add-listing-routing.module';
import { AddListingComponent } from './components/add-listing/add-listing.component';


@NgModule({
  declarations: [
    AddListingComponent
  ],
  imports: [
    CommonModule,
    AddListingRoutingModule
  ]
})
export class AddListingModule { }
