import { CommonModule } from '@angular/common'; // Assurez-vous que CommonModule est importé
import { NgModule } from '@angular/core';

import { MyRentalsComponent } from './components/my-rentals/my-rentals.component';
import { MyRentalsRoutingModule } from './my-rentals-routing.module';
// Le service est 'providedIn: root', donc pas besoin de l'importer ou de le fournir ici.
// import { ReservationsService } from '../reservations/services/reservations.service';


@NgModule({
  declarations: [
    MyRentalsComponent
    // ... autres composants de ce module
  ],
  imports: [
    CommonModule, // Nécessaire pour *ngFor, *ngIf, pipes (date, currency, titlecase), [ngClass], etc.
    MyRentalsRoutingModule
    // ... autres modules importés
  ],
  // providers: [ReservationsService] // Décommentez UNIQUEMENT si ReservationsService n'est PAS 'providedIn: root'
})
export class MyRentalsModule { }
