import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AdminModule } from './features/admin/admin.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule, // importing this makes HeaderComponent available for use
    BrowserModule, // this includes CommonModule
    AppRoutingModule, // this configures the router service with root routes
    AdminModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
