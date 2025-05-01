import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ProfileComponent } from './components/profile/profile.component'; // Import ProfileComponent
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  declarations: [
    ProfileComponent // Add ProfileComponent back to declarations
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
})
export class ProfileModule { }
