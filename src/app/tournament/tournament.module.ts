import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentComponent } from './tournament.component';
import { TimerFormatPipe } from './timer-format.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TournamentComponent,
    TimerFormatPipe
  ],
  exports: [
    TournamentComponent
  ]
})
export class TournamentModule { }
