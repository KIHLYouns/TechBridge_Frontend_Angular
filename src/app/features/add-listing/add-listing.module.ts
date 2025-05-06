import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Importer ReactiveFormsModule
import { SharedModule } from '../../shared/shared.module'; // Importer SharedModule si nécessaire

import { AddListingRoutingModule } from './add-listing-routing.module';
import { AddListingComponent } from './components/add-listing/add-listing.component';

@NgModule({
  declarations: [
    AddListingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, // Ajouter ReactiveFormsModule ici
    SharedModule,        // Ajouter SharedModule ici
    AddListingRoutingModule
  ]
})
export class AddListingModule { }
