import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { ImageService } from './image.service';
import { TimerTickService } from './timer-tick.service';
import { OneSecondTimerTickService } from './one-second-timer-tick.service';
import { TournamentControlService } from './tournament.control.service';
import { TournamentKeyboardControlService } from './tournament.keyboard-control.service';
import { TournamentService } from './tournament.service';

export let tournamentControlServiceFactory = () => {
    return new TournamentKeyboardControlService();
};

export let timerTickServiceFactory = () => {
    return new OneSecondTimerTickService();
};

@NgModule({
    imports: [
       CommonModule,
       HttpModule
    ],
    providers: [
        ImageService,
        TournamentService,
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
