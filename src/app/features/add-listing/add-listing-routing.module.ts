import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddListingComponent } from './components/add-listing/add-listing.component';

const routes: Routes = [
   {
      path: '', // Route par défaut pour le chemin 'my-rentals'
      component: AddListingComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddListingRoutingModule { }
