import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // when the app loads we are automatically redirected to "/rentals"
  // and this loads the RentalsModule, 
  { path: '', redirectTo: 'rentals', pathMatch: 'full' }, 
  { path: 'rentals', loadChildren: () => import('./features/rentals/rentals.module').then(m => m.RentalsModule) }, // /rentals loads the RentalsModule
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
