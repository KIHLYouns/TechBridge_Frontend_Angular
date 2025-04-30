import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingDetailComponent } from './components/listings-detail/listing-detail.component';
import { ListingsComponent } from './components/listings/listings.component';

const routes: Routes = [
  { path: '', component: ListingsComponent },
  { path: ':id', component: ListingDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListingsRoutingModule { }
