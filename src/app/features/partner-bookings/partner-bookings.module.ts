import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerBookingsRoutingModule } from './partner-bookings-routing.module';
import { PartnerBookingsComponent } from './components/partner-bookings/partner-bookings.component';


@NgModule({
  declarations: [
    PartnerBookingsComponent
  ],
  imports: [
    CommonModule,
    PartnerBookingsRoutingModule
  ]
})
export class PartnerBookingsModule { }
