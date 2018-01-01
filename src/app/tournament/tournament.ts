import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { TimerTickService } from '../core/timer-tick.service';
import { Beeper } from './beeper';

export class Tournament {
    public title: string;
    public description: string;
    public locale: string;
    public currencyCode: string;
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
    public levelChange: BehaviorSubject<number>;
    public payoutPercentages: Array<number>;
    public payouts: Array<number>;
    public numberOfEntrants: number;
    public numberOfPlayersRemaining: number;
    public numberOfRebuys: number;
    public secondsRemaining: number;
    public state: string;

    private timerSubscription: Subscription;

    constructor(private timerTickService: TimerTickService, tournamentInfo) {
        this.title = tournamentInfo.title;
        this.description = tournamentInfo.description;
        this.locale = tournamentInfo.locale;
        if (!this.locale) {
            this.locale = 'en-US';
        }
        this.currencyCode = tournamentInfo.currencyCode;
        if (!this.currencyCode) {
            this.currencyCode = 'USD';
        }
        this.buyIn = tournamentInfo.buyIn;
        this.rebuyAmount = tournamentInfo.rebuyAmount;
        this.rebuyThroughLevel = tournamentInfo.rebuyThroughLevel;
        this.levels = tournamentInfo.levels;
        this.payoutPercentages = tournamentInfo.payouts;
        if (!this.payoutPercentages) {
            this.payoutPercentages = [ 1 ];
        }
        this.numberOfEntrants = 0;
        this.numberOfPlayersRemaining = 0;
        this.numberOfRebuys = 0;
        this.state = 'start-pending';

        this.recalculatePayouts();

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
        this.levelChange = new BehaviorSubject(this.currentLevelIndex);
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
                this.levelChange.next(this.currentLevelIndex);
            } else {
                this.stop();
            }
        } else if (this.secondsRemaining <= 5) {
            Beeper.beep();
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
        this.levelChange.complete();
    }

    public entrantPlus() {
        this.numberOfEntrants++;
        this.playerPlus();
        this.recalculatePayouts();
    }

    public entrantMinus() {
        if (this.numberOfEntrants > 0) {
            this.numberOfEntrants--;
            this.playerMinus();
            this.recalculatePayouts();
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
        this.recalculatePayouts();
    }

    public rebuyMinus() {
        if (this.numberOfRebuys > 0) {
            this.numberOfRebuys--;
            this.recalculatePayouts();
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
            this.levelChange.next(this.currentLevelIndex);
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
            this.levelChange.next(this.currentLevelIndex);
        }
    }

    public setPayouts(payoutPercentages) {
        this.payoutPercentages = payoutPercentages;
        this.recalculatePayouts();
    }

    private recalculatePayouts() {
        // use largest remainder method to distribute fractional payouts
        let pot = this.numberOfEntrants * this.buyIn +
                  this.numberOfRebuys * this.rebuyAmount;
        let sum = 0;

        let payouts = this.payoutPercentages.map(function(payoutPercentage, i) {
            let amount = Math.floor(pot * payoutPercentage);
            sum += amount;
            return {
                amount: amount,
                remainder: (pot * payoutPercentage) % 1,
                originalIndex: i,
            };
        });

        // sort by remainder then amount
        if (sum != pot) {
            let parts = payouts.sort(function(a, b) {
                if (a.remainder == b.remainder) {
                    return (a.amount < b.amount) ? -1 : (a.amount > b.amount) ? 1 : 0;
                } else {
                    return (a.remainder < b.remainder) ? -1 : 1;
                }
            }).reverse();

            let diff = pot - sum;
            let i = 0;
            while (i < diff) {
                parts[i].amount++;
                i++;
            }

            payouts = payouts.sort(function(a, b) {
                return a.originalIndex - b.originalIndex;
            });
        }
        this.payouts = payouts.map(payout => payout.amount);
    }
}
