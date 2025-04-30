import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // when the app loads we are automatically redirected to "/listings"
  // and this loads the ListingsModule, 
  { path: '', redirectTo: 'listings', pathMatch: 'full' }, 
  { path: 'listings', loadChildren: () => import('./features/listings/listings.module').then(m => m.ListingsModule) }, // /listings loads the ListingsModule
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
