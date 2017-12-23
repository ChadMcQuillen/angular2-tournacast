import { Router }            from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CurrencyPipe }      from '@angular/common';
import { Tournament }        from './tournament';
import { TournamentService } from './tournament.service';

@Component({
    selector: 'app-tournament',
    templateUrl: './tournament.component.html',
    styleUrls: ['./tournament.component.css'],
    providers: [
        TournamentService
    ]
})
export class TournamentComponent implements OnInit {

    public tournament: Tournament;
    public startBlindIndex: number;
    public endBlindIndex: number;
    public visibleLevels;
    public places = [ '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th' ];

    constructor(private router: Router,
                private tournamentService: TournamentService) {
        this.tournament = tournamentService.tournament;
        this.tournament.levelObservable.subscribe(
            value => {
                this.setVisibleLevels();
            },
            null,
            () => {
                this.router.navigate(['/slideshow']);
            }
        );
    }

    ngOnInit() {
    }

    setVisibleLevels() {
        this.startBlindIndex = Math.max(this.tournament.currentLevelIndex - 2, 0);
        this.endBlindIndex = Math.min(this.tournament.currentLevelIndex + 2, this.tournament.levelsAndBreaks.length - 1);
        if (this.tournament.currentLevelIndex - this.startBlindIndex < 2) {
            var excess = 2 - (this.tournament.currentLevelIndex - this.startBlindIndex);
            this.endBlindIndex = Math.min(this.endBlindIndex + excess, this.tournament.levelsAndBreaks.length - 1);
        }
        if (this.endBlindIndex - this.tournament.currentLevelIndex < 2) {
            var excess = 2 - (this.endBlindIndex - this.tournament.currentLevelIndex);
            this.startBlindIndex = Math.max(this.startBlindIndex - excess, 0);
        }
    }

    getClassForLevel(i) {
        var klass = <any>{ };

        if (i == this.tournament.currentLevelIndex) {
            klass.levelCurrent = true;
        } else {
            klass.level = true;
        }
        return klass;
    }

    getClassForCurrentBlinds() {
        var level = this.tournament.levelsAndBreaks[this.tournament.currentLevelIndex];
        var numberOfDigits = level.smallBlind.toString().length +
                             level.bigBlind.toString().length;
        if (level.ante > 0) {
            numberOfDigits += level.ante.toString().length;
        }
        if (numberOfDigits < 13) {
            return 'blindsLargeText';
        } else {
            return 'blindsSmallText';
        }
    }

    getClassesForBlinds(i) {
        var level = this.tournament.levelsAndBreaks[i];
        var numberOfDigits = level.smallBlind.toString().length +
                             level.bigBlind.toString().length;
        if (level.ante > 0) {
            numberOfDigits += level.ante.toString().length;
        }
        var klass = <any>{ };
        if (numberOfDigits < 8) {
            klass.levelLargeText = true;
        } else if (numberOfDigits < 12) {
            klass.levelMediumText = true;
        } else {
            klass.levelSmallText = true;
        }
        if (i == this.tournament.currentLevelIndex) {
            klass.levelCurrent = true;
        } else {
            klass.level = true;
        }
        return klass;
    }
}
