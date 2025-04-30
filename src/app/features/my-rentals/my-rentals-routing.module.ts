import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyRentalsComponent } from './components/my-rentals/my-rentals.component'; // Importer le composant

// Définir la route pour le composant dans ce module
const routes: Routes = [
  {
    path: '', // Route par défaut pour le chemin 'my-rentals'
    component: MyRentalsComponent
  }
  // Ajouter d'autres routes spécifiques à my-rentals ici si nécessaire
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyRentalsRoutingModule { }
