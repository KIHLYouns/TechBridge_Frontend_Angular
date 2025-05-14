import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { AdminClaimListComponent } from './components/admin-claim-list/admin-claim-list.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminListingListComponent } from './components/admin-listing-list/admin-listing-list.component';
import { AdminUserListComponent } from './components/admin-user-list/admin-user-list.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminUserListComponent,
    AdminListingListComponent,
    AdminClaimListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
