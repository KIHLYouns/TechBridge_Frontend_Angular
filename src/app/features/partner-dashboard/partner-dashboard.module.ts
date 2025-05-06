import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PartnerDashboardComponent } from './components/partner-dashboard/partner-dashboard.component';
import { PartnerDashboardRoutingModule } from './partner-dashboard-routing.module';

@NgModule({
  declarations: [
    PartnerDashboardComponent
  ],
  imports: [
    CommonModule,
    PartnerDashboardRoutingModule,
    FormsModule
  ]
})
export class PartnerDashboardModule { }
