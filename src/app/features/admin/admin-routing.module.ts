import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminClaimListComponent } from './components/admin-claim-list/admin-claim-list.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminListingListComponent } from './components/admin-listing-list/admin-listing-list.component';
import { AdminUserListComponent } from './components/admin-user-list/admin-user-list.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: AdminUserListComponent },
      { path: 'listings', component: AdminListingListComponent },
      { path: 'claims', component: AdminClaimListComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
