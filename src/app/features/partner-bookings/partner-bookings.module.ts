import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerBookingsRoutingModule } from './partner-bookings-routing.module';
import { PartnerBookingsComponent } from './components/partner-bookings/partner-bookings.component';
import { ClientReviewComponent } from './components/client-review/client-review.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientReviewsComponent } from './components/client-reviews/client-reviews.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    PartnerBookingsComponent,
    ClientReviewComponent,
    ClientReviewsComponent
  ],
  imports: [
    SharedModule,
    PartnerBookingsRoutingModule, 
    ReactiveFormsModule
  ]
})
export class PartnerBookingsModule { }
