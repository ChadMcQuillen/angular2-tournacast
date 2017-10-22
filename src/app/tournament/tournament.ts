import { Observable, Observer, Subscription } from 'rxjs/Rx';
import { TimerTickService } from '../core/timer-tick.service';

export class Tournament {
    public title: string;
    public description: string;
    public buyIn: number;
    public rebuyAmount: number;
    public rebuyThroughLevel: number;
    public levels: Array<{
        level: number,
        levelTime: number,
        smallBlind: number,
        bigBlind: number,
        ante: number,
        breakTime: number
    }>;
    public levelsAndBreaks: Array<{
        levelType: string,
        levelIndex: number,
        levelTime: number,
        smallBlind: number,
        bigBlind: number,
        ante: number
    }>;
    public currentLevelIndex: number;
    public levelObservable: Observable<number>;
    public payouts: Array<number>;
    public numberOfEntrants: number;
    public numberOfPlayersRemaining: number;
    public numberOfRebuys: number;
    public secondsRemaining: number;
    public state: string;

    private timerSubscription: Subscription;
    private levelObserver: Observer<any>;

    constructor(private timerTickService: TimerTickService, tournamentInfo) {
        this.title = tournamentInfo.title;
        this.description = tournamentInfo.description;
        this.buyIn = tournamentInfo.buyIn;
        this.rebuyAmount = tournamentInfo.rebuyAmount;
        this.rebuyThroughLevel = tournamentInfo.rebuyThroughLevel;
        this.levels = tournamentInfo.levels;
        this.payouts = tournamentInfo.payouts;
        this.numberOfEntrants = 0;
        this.numberOfPlayersRemaining = 0;
        this.numberOfRebuys = 0;
        this.state = 'start-pending';

        // expand out breaks as if they were their own level
        this.levelsAndBreaks = [ ];
        var levelIndex = 1;
        var breakIndex = 1;
        for (var level = 0; level < tournamentInfo.levels.length; level++) {
            this.levelsAndBreaks.push(
                {
                    levelType:  'Level',
                    levelIndex: levelIndex,
                    levelTime:  tournamentInfo.levels[level].levelTime,
                    smallBlind: tournamentInfo.levels[level].smallBlind,
                    bigBlind:   tournamentInfo.levels[level].bigBlind,
                    ante:       tournamentInfo.levels[level].ante
                });
            if (tournamentInfo.levels[level].breakTime > 0 &&
                level < tournamentInfo.levels.length - 1) {
                this.levelsAndBreaks.push(
                    {
                        levelType:  'Break',
                        levelIndex: breakIndex,
                        levelTime:  tournamentInfo.levels[level].breakTime,
                        smallBlind: 0, // not used
                        bigBlind:   0, // not used
                        ante:       0  // not used
                    });
                breakIndex++;
            }
            levelIndex++;
        }
        this.currentLevelIndex = 0;
        this.secondsRemaining = this.levelsAndBreaks[0].levelTime * 60;
        this.levelObservable = new Observable(observer => {
            this.levelObserver = observer;
            observer.next(this.currentLevelIndex);
        });
    }

    public start() {
        if (this.state === 'start-pending') {
            this.state = 'running';
            this.timerSubscription = this.timerTickService.timerTickObservable.subscribe(t=> {
                this.timerTick(t);
            });
        }
    }

    public timerTick(t) {
        this.secondsRemaining--;
        if (this.secondsRemaining == 0) {
            if (this.currentLevelIndex < this.levelsAndBreaks.length - 1) {
                this.currentLevelIndex++;
                this.secondsRemaining = this.levelsAndBreaks[this.currentLevelIndex].levelTime * 60;
                if (this.levelObserver) {
                    this.levelObserver.next(this.currentLevelIndex);
                }
            } else {
                if (this.levelObserver) {
                    this.levelObserver.next(this.currentLevelIndex);
                }
                this.state = 'stopped';
            }
        }
    }

    public pause() {
        if (this.state === 'running' && this.timerSubscription) {
            this.state = 'paused';
            this.timerSubscription.unsubscribe();
            this.timerSubscription = null;
        }
    }

    public resume() {
        if (this.state === 'paused') {
            this.state = 'running';
            this.timerSubscription = this.timerTickService.timerTickObservable.subscribe(t=> {
                this.timerTick(t);
            });
        }
    }

    public stop() {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
            this.timerSubscription = null;
        }
        this.state = 'stopped';
    }

    public entrantPlus() {
        this.numberOfEntrants++;
        this.playerPlus();
    }

    public entrantMinus() {
        if (this.numberOfEntrants > 0) {
            this.numberOfEntrants--;
            this.playerMinus();
        }
    }

    public playerPlus() {
        if (this.numberOfPlayersRemaining < this.numberOfEntrants) {
            this.numberOfPlayersRemaining++;
        }
    }

    public playerMinus() {
        var minimumPlayers = 0;
        if (this.state !== 'start-pending') {
            minimumPlayers = 1;
        }
        if (this.numberOfPlayersRemaining > minimumPlayers) {
            this.numberOfPlayersRemaining--;
        }
    }

    public rebuyPlus() {
        this.numberOfRebuys++;
    }

    public rebuyMinus() {
        if (this.numberOfRebuys > 0) {
            this.numberOfRebuys--;
        }
    }

    public previousLevel() {
        if (this.state !== 'start-pending' && this.currentLevelIndex > 0) {
            this.state = 'paused';
            if (this.timerSubscription) {
                this.timerSubscription.unsubscribe();
                this.timerSubscription = null;
            }
            this.currentLevelIndex--;
            this.secondsRemaining = this.levelsAndBreaks[this.currentLevelIndex].levelTime * 60;
            if (this.levelObserver) {
                this.levelObserver.next(this.currentLevelIndex);
            }
        }
    }

    public nextLevel() {
        if (this.state !== 'start-pending' && this.currentLevelIndex < this.levelsAndBreaks.length - 1) {
            this.state = 'paused';
            if (this.timerSubscription) {
                this.timerSubscription.unsubscribe();
                this.timerSubscription = null;
            }
            this.currentLevelIndex++;
            this.secondsRemaining = this.levelsAndBreaks[this.currentLevelIndex].levelTime * 60;
            if (this.levelObserver) {
                this.levelObserver.next(this.currentLevelIndex);
            }
        }
    }
}
