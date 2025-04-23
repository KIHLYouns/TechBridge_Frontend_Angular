import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

// Core Module is only imported by App Module
// CoreModule's purpose is to provide app-wide singleton services and components used only by AppComponent
@NgModule({
  // core components are referenced in AppComponent
  declarations: [
    HeaderComponent
  ],
  imports: [
    SharedModule, // SharedModule for shared components and Modules
    RouterModule, // Import RouterModule to enable routerLink in header
  ],
  exports: [
    HeaderComponent
  ]
})
export class CoreModule { }
