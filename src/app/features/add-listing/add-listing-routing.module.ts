import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddListingComponent } from './components/add-listing/add-listing.component';

const routes: Routes = [
  {
    path: '', // Route pour la création d'une nouvelle annonce
    component: AddListingComponent,
    title: 'TechBridge - Add Listing'
  },
  {
    path: ':id/edit', // Route pour l'édition d'une annonce existante
    component: AddListingComponent,
    title: 'TechBridge - Edit Listing'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddListingRoutingModule { }
