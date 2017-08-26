import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TournamentModule } from './tournament/tournament.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TournamentModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
