import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // when the app loads we are automatically redirected to "/listings"
  // and this loads the ListingsModule, 
  { path: '', redirectTo: 'listings', pathMatch: 'full' }, 
  { path: 'listings', loadChildren: () => import('./features/listings/listings.module').then(m => m.ListingsModule) }, // /listings loads the ListingsModule
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'my-rentals', loadChildren: () => import('./features/my-rentals/my-rentals.module').then(m => m.MyRentalsModule) }, // /my-rentals loads the MyRentalsModule
  { path: 'profile', loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule)},
  { path: 'partner-bookings', loadChildren: () => import('./features/partner-bookings/partner-bookings.module').then(m => m.PartnerBookingsModule)},
  { path: 'partner-dashboard', loadChildren: () => import('./features/partner-dashboard/partner-dashboard.module').then(m => m.PartnerDashboardModule)},
  { path: 'listing', loadChildren: () => import('./features/add-listing/add-listing.module').then(m => m.AddListingModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
