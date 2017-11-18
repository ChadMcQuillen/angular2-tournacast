import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer }   from 'rxjs/Observer';
import { Tournament } from './tournament';
import { TimerTickService } from '../core/timer-tick.service';
import { TournamentControlService } from '../core/tournament.control.service';

@Injectable()
export class TournamentService {
    public tournament: Tournament;

    constructor(private tournamentControlService: TournamentControlService,
                private timerTickService: TimerTickService) {
        this.tournament = new Tournament(timerTickService, this.tournamentControlService.command.getValue().parameters);
        this.tournamentControlService.command.subscribe(
            value => {
                if (value.command === 'start') {
                    this.tournament.start();
                } else if (value.command === 'pause') {
                    this.tournament.pause();
                } else if (value.command === 'resume') {
                    this.tournament.resume();
                } else if (value.command === 'nextLevel') {
                    this.tournament.nextLevel();
                } else if (value.command === 'previousLevel') {
                    this.tournament.previousLevel();
                } else if (value.command === 'entrantPlus') {
                    this.tournament.entrantPlus();
                } else if (value.command === 'entrantMinus') {
                    this.tournament.entrantMinus();
                } else if (value.command === 'playerPlus') {
                    this.tournament.playerPlus();
                } else if (value.command === 'playerMinus') {
                    this.tournament.playerMinus();
                } else if (value.command === 'rebuyPlus') {
                    this.tournament.rebuyPlus();
                } else if (value.command === 'rebuyMinus') {
                    this.tournament.rebuyMinus();
                } else if (value.command === 'payouts') {
                    this.tournament.setPayouts(value.parameters);
                }
            }
        );
    }
}
