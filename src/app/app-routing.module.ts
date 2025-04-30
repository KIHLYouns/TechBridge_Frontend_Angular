import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // when the app loads we are automatically redirected to "/listings"
  // and this loads the ListingsModule, 
  { path: '', redirectTo: 'listings', pathMatch: 'full' }, 
  { path: 'listings', loadChildren: () => import('./features/listings/listings.module').then(m => m.ListingsModule) }, // /listings loads the ListingsModule
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'my-rentals', loadChildren: () => import('./features/my-rentals/my-rentals.module').then(m => m.MyRentalsModule) }, // /my-rentals loads the MyRentalsModule
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
