import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentControlService } from './tournament.control.service';
import { TournamentKeyboardControlService } from './tournament.keyboard-control.service';

export let tournamentControlServiceFactory = () => {
    return new TournamentKeyboardControlService();
};

@NgModule({
    imports: [
       CommonModule
    ],
    providers: [{
        provide: TournamentControlService,
        useFactory: tournamentControlServiceFactory
    }]
})
export class CoreModule { }
