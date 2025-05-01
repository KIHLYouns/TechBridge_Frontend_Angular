import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerDashboardRoutingModule } from './partner-dashboard-routing.module';
import { PartnerDashboardComponent } from './components/partner-dashboard/partner-dashboard.component';


@NgModule({
  declarations: [
    PartnerDashboardComponent
  ],
  imports: [
    CommonModule,
    PartnerDashboardRoutingModule
  ]
})
export class PartnerDashboardModule { }
