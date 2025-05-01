import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartnerBookingsComponent } from './components/partner-bookings/partner-bookings.component';

const routes: Routes = [   {
      path: '', // Route par défaut pour le chemin 'my-rentals'
      component: PartnerBookingsComponent
    }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerBookingsRoutingModule { }
