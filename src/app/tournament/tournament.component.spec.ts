import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TournamentComponent } from './tournament.component';
import { TimerFormatPipe } from './timer-format.pipe';
import { TimerTickService } from '../core/timer-tick.service';
import { TournamentControlService } from '../core/tournament.control.service';

class MockTournamentControlService extends TournamentControlService {
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
        this.command = new BehaviorSubject({command:'tournament',parameters:this.tournamentInfo});
    }
};

describe('TournamentComponent', () => {
    let component: TournamentComponent;
    let fixture: ComponentFixture<TournamentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TournamentComponent,
                TimerFormatPipe
            ],
            providers: [
                { provide: TournamentControlService, useClass: MockTournamentControlService },
                TimerTickService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TournamentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
