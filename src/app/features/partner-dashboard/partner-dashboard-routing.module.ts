import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartnerDashboardComponent } from './components/partner-dashboard/partner-dashboard.component';

const routes: Routes = [   {
      path: '', // Route par défaut pour le chemin 'my-rentals'
      component: PartnerDashboardComponent
    }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerDashboardRoutingModule { }
