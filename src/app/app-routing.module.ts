import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'listings', pathMatch: 'full' },
  { path: 'listings', loadChildren: () => import('./features/listings/listings.module').then(m => m.ListingsModule) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { 
    path: 'my-rentals', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/my-rentals/my-rentals.module').then(m => m.MyRentalsModule)
  },
  { 
    path: 'profile', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule)
  },
  { 
    path: 'partner-bookings', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/partner-bookings/partner-bookings.module').then(m => m.PartnerBookingsModule)
  },
  { 
    path: 'partner-dashboard', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/partner-dashboard/partner-dashboard.module').then(m => m.PartnerDashboardModule)
  },
  { 
    path: 'listing', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/add-listing/add-listing.module').then(m => m.AddListingModule)
  },
  { 
    path: 'admin', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }