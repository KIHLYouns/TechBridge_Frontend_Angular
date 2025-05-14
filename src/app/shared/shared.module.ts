import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactModalComponent } from '../features/my-rentals/components/contact-modal/contact-modal.component';



@NgModule({
  declarations: [
    ContactModalComponent
  ],
  imports: [
    CommonModule
    
  ], 
  exports: [
    CommonModule, ContactModalComponent
  ]
})
export class SharedModule { }
