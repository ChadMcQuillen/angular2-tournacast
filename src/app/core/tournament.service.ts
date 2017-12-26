import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Tournament } from '../tournament/tournament';
import { TimerTickService } from './timer-tick.service';
import { TournamentControlService } from './tournament.control.service';

@Injectable()
export class TournamentService {
    public tournament: Tournament;
    public tournamentControl: BehaviorSubject<string>;

    constructor(private tournamentControlService: TournamentControlService,
                private timerTickService: TimerTickService) {
        this.tournamentControl = new BehaviorSubject('waiting');
        this.tournamentControlService.command.subscribe(
            value => {
                if (value.command === 'tournament') {
                    this.tournament = new Tournament(this.timerTickService, value.parameters);
                    this.tournament.levelChange.subscribe(
                        null,
                        null,
                        () => {
                            this.tournamentControl.next('completed');
                            this.tournament = null;
                        }
                    );
                    this.tournamentControl.next('start-pending');
                } else if (value.command === 'start') {
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
