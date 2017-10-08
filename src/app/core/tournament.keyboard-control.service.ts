import { Injectable } from '@angular/core';
import { BehaviorSubject }   from 'rxjs/BehaviorSubject';
import { TournamentControlService } from './tournament.control.service';

@Injectable()
export class TournamentKeyboardControlService extends TournamentControlService {
    private tournamentInfo = {
        title: 'Friday Night Poker',
        description: '$10 Buy-in (1 rebuy through level 5)',
        buyIn: 10,
        rebuyAmount: 10,
        rebuyThroughLevel: 5,
        levels: [
            { level: 1,  levelTime: 20, smallBlind: 5,   bigBlind: 10,  ante: 0, breakTime: 0  },
            { level: 2,  levelTime: 20, smallBlind: 10,  bigBlind: 20,  ante: 0, breakTime: 0  },
            { level: 3,  levelTime: 20, smallBlind: 15,  bigBlind: 30,  ante: 0, breakTime: 0  },
            { level: 4,  levelTime: 20, smallBlind: 20,  bigBlind: 40,  ante: 0, breakTime: 0  },
            { level: 5,  levelTime: 20, smallBlind: 25,  bigBlind: 50,  ante: 0, breakTime: 20 },
            { level: 6,  levelTime: 20, smallBlind: 50,  bigBlind: 100, ante: 0, breakTime: 0  },
            { level: 7,  levelTime: 20, smallBlind: 75,  bigBlind: 150, ante: 0, breakTime: 0  },
            { level: 8,  levelTime: 20, smallBlind: 75,  bigBlind: 150, ante: 0, breakTime: 0  },
            { level: 9,  levelTime: 20, smallBlind: 100, bigBlind: 200, ante: 0, breakTime: 0  },
            { level: 10, levelTime: 20, smallBlind: 150, bigBlind: 300, ante: 0, breakTime: 0  },
            { level: 11, levelTime: 20, smallBlind: 200, bigBlind: 400, ante: 0, breakTime: 0  },
            { level: 12, levelTime: 20, smallBlind: 300, bigBlind: 600, ante: 0, breakTime: 0  }
        ],
        payouts: [ .7, .2, .1 ]
    };

    constructor() {
        super();
        this.command = new BehaviorSubject({});
        window.addEventListener('keydown', (event) => {
            if (event.key == '1') {
                this.command.next({command:'entrantMinus'});
            } else if (event.key === '2') {
                this.command.next({command:'entrantPlus'});
            } else if (event.key === '3') {
                this.command.next({command:'playerMinus'});
            } else if (event.key === '4') {
                this.command.next({command:'playerPlus'});
            } else if (event.key === '5') {
                this.command.next({command:'rebuyMinus'});
            } else if (event.key === '6') {
                this.command.next({command:'rebuyPlus'});
            } else if (event.key === 't') {
                this.command.next({command:'tournament',parameters:this.tournamentInfo});
            } else if (event.key === 's') {
                this.command.next({command:'start'});
            } else if (event.key === 'p') {
                this.command.next({command:'pause'});
            } else if (event.key === 'r') {
                this.command.next({command:'resume'});
            } else if (event.key === 'n') {
                this.command.next({command:'nextLevel'});
            } else if (event.key === 'b') {
                this.command.next({command:'previousLevel'});
            }
        });
    }
}
