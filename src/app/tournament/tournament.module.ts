import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentComponent } from './tournament.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TournamentComponent
  ],
  exports: [
    TournamentComponent
  ]
})
export class TournamentModule { }
