import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'rentals', pathMatch: 'full' }, // when the app loads we are redirected to /rentals 
  { path: 'rentals', loadChildren: () => import('./features/rentals/rentals.module').then(m => m.RentalsModule) }, // /rentals loads the RentalsModule
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
