import { Observable, Observer, Subscription } from 'rxjs/Rx';

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

    private timerSubscription: Subscription;
    private levelObserver: Observer<any>;

    constructor(tournamentInfo) {
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
}
