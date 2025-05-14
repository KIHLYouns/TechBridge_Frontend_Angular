import { CommonModule } from '@angular/common'; // Assurez-vous que CommonModule est importé
import { NgModule } from '@angular/core';

import { MyRentalsComponent } from './components/my-rentals/my-rentals.component';
import { MyRentalsRoutingModule } from './my-rentals-routing.module';
import { ReviewModalComponent } from './components/review-modal/review-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactModalComponent } from './components/contact-modal/contact-modal.component';
import { SharedModule } from '../../shared/shared.module';
// Le service est 'providedIn: root', donc pas besoin de l'importer ou de le fournir ici.
// import { ReservationsService } from '../reservations/services/reservations.service';


@NgModule({
  declarations: [
    MyRentalsComponent,
    ReviewModalComponent
    // ... autres composants de ce module
  ],
  imports: [
    MyRentalsRoutingModule,
    ReactiveFormsModule,
    SharedModule
    // ... autres modules importés
  ],
  // providers: [ReservationsService] // Décommentez UNIQUEMENT si ReservationsService n'est PAS 'providedIn: root'
})
export class MyRentalsModule { }
