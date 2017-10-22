import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerTickService } from './timer-tick.service';
import { OneSecondTimerTickService } from './one-second-timer-tick.service';
import { TournamentControlService } from './tournament.control.service';
import { TournamentKeyboardControlService } from './tournament.keyboard-control.service';

export let tournamentControlServiceFactory = () => {
    return new TournamentKeyboardControlService();
};

export let timerTickServiceFactory = () => {
    return new OneSecondTimerTickService();
};

@NgModule({
    imports: [
       CommonModule
    ],
    providers: [
        {
            provide: TournamentControlService,
            useFactory: tournamentControlServiceFactory
        },
        {
            provide: TimerTickService,
            useFactory: timerTickServiceFactory
        }
    ]
})
export class CoreModule { }
