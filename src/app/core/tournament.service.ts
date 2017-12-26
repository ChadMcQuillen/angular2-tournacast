import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Tournament } from '../tournament/tournament';
import { TimerTickService } from './timer-tick.service';
import { TournamentControlService } from './tournament.control.service';

@Injectable()
export class TournamentService {
    public tournament: Tournament;
    public tournamentControl: BehaviorSubject<string>;

    private tournamentStructure: any;

    constructor(private zone: NgZone,
                private tournamentControlService: TournamentControlService,
                private timerTickService: TimerTickService) {
        this.tournamentControl = new BehaviorSubject('waiting');
        this.tournamentControlService.command.subscribe(
            value => {
                if (NgZone.isInAngularZone()) {
                    this.processTournamentCommand(value);
                } else {
                    this.zone.run(() => {
                        this.processTournamentCommand(value);
                    });
                }
            }
        );
    }

    private getTournamentInfo(data: any) {
        let level = this.tournament.levelsAndBreaks[this.tournament.currentLevelIndex];
        let levelText = level.levelType + ' ' + level.levelIndex;
        data.info = {
            state: this.tournament.state,
            level: levelText,
            entrants: this.tournament.numberOfEntrants,
            players: this.tournament.numberOfPlayersRemaining,
            rebuys: this.tournament.numberOfRebuys,
            payouts: this.tournament.payoutPercentages,
            tournament: this.tournamentStructure
        }
    }

    private processTournamentCommand(value: any) {
        let data = {
            command: value.command,
            info: null
        };

        if (value.command === 'getTournament') {
            if (this.tournament) {
                this.getTournamentInfo(data);
            } else {
                data.info = {state: 'undefined'};
            }
        } else if (value.command === 'tournament') {
            this.tournamentStructure = value.parameters;
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
            this.getTournamentInfo(data);
        } else if (value.command === 'start') {
            this.tournament.start();
            data.info = {state: this.tournament.state};
        } else if (value.command === 'stop') {
            this.tournament.stop();
            // this.tournament.state is null by the time we get to here
            data.info = {state: 'stopped'};
        } else if (value.command === 'pause') {
            this.tournament.pause();
            data.info = {state: this.tournament.state};
        } else if (value.command === 'resume') {
            this.tournament.resume();
            data.info = {state: this.tournament.state};
        } else if (value.command === 'nextLevel') {
            this.tournament.nextLevel();
            data.info = {state: this.tournament.state};
        } else if (value.command === 'previousLevel') {
            this.tournament.previousLevel();
            data.info = {state: this.tournament.state};
        } else if (value.command === 'entrantPlus') {
            this.tournament.entrantPlus();
            data.info = {
                entrants: this.tournament.numberOfEntrants,
                players: this.tournament.numberOfPlayersRemaining
            };
        } else if (value.command === 'entrantMinus') {
            this.tournament.entrantMinus();
            data.info = {
                entrants: this.tournament.numberOfEntrants,
                players: this.tournament.numberOfPlayersRemaining
            };
        } else if (value.command === 'playerPlus') {
            this.tournament.playerPlus();
            data.info = {
                entrants: this.tournament.numberOfEntrants,
                players: this.tournament.numberOfPlayersRemaining
            };
        } else if (value.command === 'playerMinus') {
            this.tournament.playerMinus();
            data.info = {
                entrants: this.tournament.numberOfEntrants,
                players: this.tournament.numberOfPlayersRemaining
            };
        } else if (value.command === 'rebuyPlus') {
            this.tournament.rebuyPlus();
            data.info = {rebuys: this.tournament.numberOfRebuys};
        } else if (value.command === 'rebuyMinus') {
            this.tournament.rebuyMinus();
            data.info = {rebuys: this.tournament.numberOfRebuys};
        } else if (value.command === 'payouts') {
            this.tournament.setPayouts(value.parameters);
            data.info = {payouts: this.tournament.payoutPercentages};
        } else {
            return;
        }
        this.tournamentControlService.broadcastTournamentUpdate(data);
    }
}
