import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ProfileComponent } from './components/profile/profile.component'; // Import ProfileComponent
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ProfileComponent // Add ProfileComponent back to declarations
  ],
  imports: [
    SharedModule,
    ProfileRoutingModule,
    ReactiveFormsModule
  ],
})
export class ProfileModule { }
