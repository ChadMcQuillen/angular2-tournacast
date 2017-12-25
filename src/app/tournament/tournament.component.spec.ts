import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable, Observer } from 'rxjs/Rx';

import { TournamentComponent } from './tournament.component';
import { TimerFormatPipe } from './timer-format.pipe';
import { TimerTickService } from '../core/timer-tick.service';
import { TournamentControlService } from '../core/tournament.control.service';

let tournamentInfo = {
    title: 'Friday Night Poker',
    description: '$10 Buy-in (1 rebuy through level 5)',
    buyIn: 10,
    rebuyAmount: 10,
    rebuyThroughLevel: 5,
    levels: [
        { level: 1,  levelTime: 1, smallBlind: 5,    bigBlind: 10,    ante: 0,    breakTime: 0 },
        { level: 2,  levelTime: 1, smallBlind: 10,   bigBlind: 20,    ante: 0,    breakTime: 0 },
        { level: 3,  levelTime: 1, smallBlind: 15,   bigBlind: 30,    ante: 0,    breakTime: 0 },
        { level: 4,  levelTime: 1, smallBlind: 20,   bigBlind: 40,    ante: 0,    breakTime: 0 },
        { level: 5,  levelTime: 1, smallBlind: 25,   bigBlind: 50,    ante: 0,    breakTime: 1 },
        { level: 6,  levelTime: 1, smallBlind: 50,   bigBlind: 100,   ante: 0,    breakTime: 0 },
        { level: 7,  levelTime: 1, smallBlind: 75,   bigBlind: 150,   ante: 0,    breakTime: 0 },
        { level: 8,  levelTime: 1, smallBlind: 100,  bigBlind: 200,   ante: 25,   breakTime: 0 },
        { level: 9,  levelTime: 1, smallBlind: 150,  bigBlind: 300,   ante: 40,   breakTime: 0 },
        { level: 10, levelTime: 1, smallBlind: 200,  bigBlind: 400,   ante: 50,   breakTime: 1 },
        { level: 11, levelTime: 1, smallBlind: 300,  bigBlind: 600,   ante: 75,   breakTime: 0 },
        { level: 12, levelTime: 1, smallBlind: 400,  bigBlind: 800,   ante: 100,  breakTime: 0 },
        { level: 13, levelTime: 1, smallBlind: 500,  bigBlind: 1000,  ante: 100,  breakTime: 0 },
        { level: 14, levelTime: 1, smallBlind: 1000, bigBlind: 2000,  ante: 200,  breakTime: 0 },
        { level: 15, levelTime: 1, smallBlind: 4000, bigBlind: 8000,  ante: 1000, breakTime: 0 },
        { level: 16, levelTime: 1, smallBlind: 5000, bigBlind: 10000, ante: 1000, breakTime: 0 }
    ],
    payouts: [ 1 ]
};

class MockTournamentControlService extends TournamentControlService {
    constructor() {
        super();
        this.command = new BehaviorSubject({command:'tournament',parameters:tournamentInfo});
    }
    public entrantMinus() {
        this.command.next({command:'entrantMinus'});
    }
    public entrantPlus() {
        this.command.next({command:'entrantPlus'});
    }
    public playerMinus() {
        this.command.next({command:'playerMinus'});
    }
    public playerPlus() {
        this.command.next({command:'playerPlus'});
    }
    public rebuyMinus() {
        this.command.next({command:'rebuyMinus'});
    }
    public rebuyPlus() {
        this.command.next({command:'rebuyPlus'});
    }
    public start() {
        this.command.next({command:'start'});
    }
    public pause() {
        this.command.next({command:'pause'});
    }
    public resume() {
        this.command.next({command:'resume'});
    }
    public nextLevel() {
        this.command.next({command:'nextLevel'});
    }
    public previousLevel() {
        this.command.next({command:'previousLevel'});
    }
    public setPayouts(payouts) {
        this.command.next({
            command:'payouts',
            parameters:payouts
        });
    }
};

class MockTimerTickService extends TimerTickService {

    public timerTickObservable: Observable<number>;

    private timerTickObserver: Observer<any>;

    constructor() {
        super();
        this.timerTickObservable = Observable.create(observer => {
            this.timerTickObserver = observer;
            return () => {
            };
        });
    }

    public timerTick() {
        this.timerTickObserver.next(0);
    }
}

describe('TournamentComponent', () => {
    let component: TournamentComponent;
    let fixture: ComponentFixture<TournamentComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TournamentComponent,
                TimerFormatPipe
            ],
            imports: [
                RouterTestingModule.withRoutes([]),
            ],
            providers: [
                { provide: TournamentControlService, useClass: MockTournamentControlService },
                { provide: TimerTickService, useClass: MockTimerTickService }
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
    describe('Level', () => {
        function testLevelsAndBreaks(index, label, level) {
            it('should be ' + label + ' ' + level, () => {
                let tournamentControlService = fixture.debugElement.injector.get(TournamentControlService);
                tournamentControlService.start();
                for (let i = 0; i < index; i++) {
                    tournamentControlService.nextLevel();
                }
                fixture.detectChanges();
                de = fixture.debugElement.query(By.css('#levelTitle'));
                el = de.nativeElement;
                expect(el.textContent).toBe(label);
                de = fixture.debugElement.query(By.css('#level'));
                el = de.nativeElement;
                expect(el.textContent).toBe(level);
            });
        }
        for (let i = 0, breakIndex = 0; i < tournamentInfo.levels.length; i++) {
            testLevelsAndBreaks(i + breakIndex, 'Level', tournamentInfo.levels[i].level.toString());
            if (tournamentInfo.levels[i].breakTime > 0) {
                breakIndex++;
                testLevelsAndBreaks(i + breakIndex, 'Break', breakIndex.toString());
            }
        };
    });
    describe('Entries', () => {
        it('should be titled Entries', () => {
            de = fixture.debugElement.query(By.css('#entriesTitle'));
            el = de.nativeElement;
            expect(el.textContent).toBe('Entries');
        });
        it('should initially be 0', () => {
            de = fixture.debugElement.query(By.css('#entries'));
            el = de.nativeElement;
            expect(el.textContent).toBe('0');
        });
        it('should be 1 after adding an entrant', () => {
            let tournamentControlService = fixture.debugElement.injector.get(TournamentControlService);
            tournamentControlService.entrantPlus();
            fixture.detectChanges();
            de = fixture.debugElement.query(By.css('#entries'));
            el = de.nativeElement;
            expect(el.textContent).toBe('1');
        });
    });
    describe('Rebuys', () => {
        it('should be titled Rebuys', () => {
            de = fixture.debugElement.query(By.css('#rebuysTitle'));
            el = de.nativeElement;
            expect(el.textContent).toBe('Rebuys');
        });
        it('should initially be 0', () => {
            de = fixture.debugElement.query(By.css('#rebuys'));
            el = de.nativeElement;
            expect(el.textContent).toBe('0');
        });
        it('should be 1 after adding a rebuy', () => {
            let tournamentControlService = fixture.debugElement.injector.get(TournamentControlService);
            tournamentControlService.rebuyPlus();
            fixture.detectChanges();
            de = fixture.debugElement.query(By.css('#rebuys'));
            el = de.nativeElement;
            expect(el.textContent).toBe('1');
        });
    });
    describe('Pot', () => {
        it('should be titled Pot', () => {
            de = fixture.debugElement.query(By.css('#potTitle'));
            el = de.nativeElement;
            expect(el.textContent).toBe('Total Pot');
        });
        it('should initially be $0', () => {
            de = fixture.debugElement.query(By.css('#pot'));
            el = de.nativeElement;
            expect(el.textContent).toBe('$0');
        });
        it('should be $100 for 10 players with $10 buy-in and no re-buys', () => {
            let tournamentControlService = fixture.debugElement.injector.get(TournamentControlService);
            de = fixture.debugElement.query(By.css('#pot'));
            el = de.nativeElement;
            for (let i = 0; i < 10; i++) {
                tournamentControlService.entrantPlus();
            }
            fixture.detectChanges();
            expect(el.textContent).toBe('$100');
        });
        it('should be $110 for 10 players with $10 buy-in and 1 re-buy', () => {
            let tournamentControlService = fixture.debugElement.injector.get(TournamentControlService);
            de = fixture.debugElement.query(By.css('#pot'));
            el = de.nativeElement;
            for (let i = 0; i < 10; i++) {
                tournamentControlService.entrantPlus();
            }
            tournamentControlService.rebuyPlus();
            fixture.detectChanges();
            expect(el.textContent).toBe('$110');
        });
    });
    describe('Timer', () => {
        it('should initially be 1:00', () => {
            de = fixture.debugElement.query(By.css('#countdown'));
            el = de.nativeElement;
            expect(el.textContent.trim()).toBe('01:00');
        });
        it('should be styled white when greater than 5 seconds', () => {
            let tournamentControlService = fixture.debugElement.injector.get(TournamentControlService);
            let timerTickService = fixture.debugElement.injector.get(TimerTickService);
            tournamentControlService.start();
            for (let i = 60; i > 6; i--) {
                timerTickService.timerTick();
            }
            fixture.detectChanges();
            de = fixture.debugElement.query(By.css('#countdown'));
            el = de.nativeElement;
            expect(window.getComputedStyle(el, null).getPropertyValue('color')).toBe('rgb(255, 255, 255)');
        });
        it('should be styled red when 5 seconds or less', () => {
            let tournamentControlService = fixture.debugElement.injector.get(TournamentControlService);
            let timerTickService = fixture.debugElement.injector.get(TimerTickService);
            tournamentControlService.start();
            for (let i = 60; i > 5; i--) {
                timerTickService.timerTick();
            }
            fixture.detectChanges();
            de = fixture.debugElement.query(By.css('#countdown'));
            el = de.nativeElement;
            expect(window.getComputedStyle(el, null).getPropertyValue('color')).toBe('rgb(255, 0, 0)');
        });
    });
    describe('Current and Next Blind Levels', () => {
        function testBlinds(index, expectedResult) {
            let expectedText = [
                expectedResult.title,
                expectedResult.currentBlinds.length > 0 ? 'as ' + expectedResult.currentBlinds : 'blank',
                expectedResult.nextBlinds.length > 0 ? 'as ' + expectedResult.nextBlinds.replace('Next Level: ', '') : 'blank'
            ];
            it(`should be titled ${expectedText[0]} with current level ${expectedText[1]} and next level ${expectedText[2]}`, () => {
                let tournamentControlService = fixture.debugElement.injector.get(TournamentControlService);
                tournamentControlService.start();
                for (let i = 0; i < index; i++) {
                    tournamentControlService.nextLevel();
                }
                fixture.detectChanges();
                de = fixture.debugElement.query(By.css('#blindsTitle'));
                el = de.nativeElement;
                expect(el.textContent).toBe(expectedResult.title);
                de = fixture.debugElement.query(By.css('#blinds'));
                if (expectedResult.currentBlinds) {
                    el = de.nativeElement;
                    expect(el.textContent.trim().replace(/\s\s+/g, ' ')).toBe(expectedResult.currentBlinds);
                } else {
                    expect(de).toBe(null);
                }
                de = fixture.debugElement.query(By.css('#blindsContainer'));
                el = de.nativeElement;
                expect(el.className).toEqual(expectedResult.class);
                de = fixture.debugElement.query(By.css('#nextLevelBlinds'));
                if (expectedResult.nextBlinds) {
                    el = de.nativeElement;
                    expect(el.textContent.trim().replace(/\s\s+/g, ' ')).toBe(expectedResult.nextBlinds);
                } else {
                    expect(de).toBe(null);
                }
            });
        }
        let expectedResults = [
            { title: 'Blinds',
              currentBlinds: '$5 / $10',
              nextBlinds: 'Next Level: $10 / $20',
              class: 'blindsLargeText' },
            { title: 'Blinds',
              currentBlinds: '$10 / $20',
              nextBlinds: 'Next Level: $15 / $30',
              class: 'blindsLargeText' },
            { title: 'Blinds',
              currentBlinds: '$15 / $30',
              nextBlinds: 'Next Level: $20 / $40',
              class: 'blindsLargeText' },
            { title: 'Blinds',
              currentBlinds: '$20 / $40',
              nextBlinds: 'Next Level: $25 / $50',
              class: 'blindsLargeText' },
            { title: 'Blinds',
              currentBlinds: '$25 / $50',
              nextBlinds: 'Break 1',
              class: 'blindsLargeText' },
            { title: 'Break',
              currentBlinds: '',
              nextBlinds: 'Next Level: $50 / $100',
              class: 'blindsLargeText' },
            { title: 'Blinds',
              currentBlinds: '$50 / $100',
              nextBlinds: 'Next Level: $75 / $150',
              class: 'blindsLargeText' },
            { title: 'Blinds',
              currentBlinds: '$75 / $150',
              nextBlinds: 'Next Level: $100 / $200 / $25',
              class: 'blindsLargeText' },
            { title: 'Blinds + Ante',
              currentBlinds: '$100 / $200 / $25',
              nextBlinds: 'Next Level: $150 / $300 / $40',
              class: 'blindsLargeText' },
            { title: 'Blinds + Ante',
              currentBlinds: '$150 / $300 / $40',
              nextBlinds: 'Next Level: $200 / $400 / $50',
              class: 'blindsLargeText' },
            { title: 'Blinds + Ante',
              currentBlinds: '$200 / $400 / $50',
              nextBlinds: 'Break 2',
              class: 'blindsLargeText' },
            { title: 'Break',
              currentBlinds: '',
              nextBlinds: 'Next Level: $300 / $600 / $75',
              class: 'blindsLargeText' },
            { title: 'Blinds + Ante',
              currentBlinds: '$300 / $600 / $75',
              nextBlinds: 'Next Level: $400 / $800 / $100',
              class: 'blindsLargeText' },
            { title: 'Blinds + Ante',
              currentBlinds: '$400 / $800 / $100',
              nextBlinds: 'Next Level: $500 / $1,000 / $100',
              class: 'blindsLargeText' },
            { title: 'Blinds + Ante',
              currentBlinds: '$500 / $1,000 / $100',
              nextBlinds: 'Next Level: $1,000 / $2,000 / $200',
              class: 'blindsLargeText' },
            { title: 'Blinds + Ante',
              currentBlinds: '$1,000 / $2,000 / $200',
              nextBlinds: 'Next Level: $4,000 / $8,000 / $1,000',
              class: 'blindsLargeText' },
            { title: 'Blinds + Ante',
              currentBlinds: '$4,000 / $8,000 / $1,000',
              nextBlinds: 'Next Level: $5,000 / $10,000 / $1,000',
              class: 'blindsLargeText' },
            { title: 'Blinds + Ante',
              currentBlinds: '$5,000 / $10,000 / $1,000',
              nextBlinds: '',
              class: 'blindsSmallText' }
        ];
        for (let i = 0; i < expectedResults.length; i++) {
            testBlinds(i, expectedResults[i]);
        };
    });
    describe('Blind Schedule', () => {
        function testBlindSchedule(index, expectedResult, levelText) {
            let startingLevel = tableText[expectedResult.startIndex].text;
            let endingLevel = tableText[expectedResult.endIndex - 1].text;
            let highlightedLevel = tableText[expectedResult.highlightedIndices[0]].text;
            it(`should display ${startingLevel} through ${endingLevel} when on ${highlightedLevel}`, () => {
                let tournamentControlService = fixture.debugElement.injector.get(TournamentControlService);
                tournamentControlService.start();
                for (let i = 0; i < index; i++) {
                    tournamentControlService.nextLevel();
                }
                fixture.detectChanges();
                de = fixture.debugElement.query(By.css('#blindSchedule'));
                el = de.nativeElement;
                let trs = el.querySelectorAll('tr');
                expect(trs.length).toBe(10);
                for (let j = expectedResult.startIndex; j < expectedResult.endIndex; j++) {
                    let tr = trs[j - expectedResult.startIndex];
                    expect(tr.textContent.trim().replace(/\s\s+/g, ' ')).toBe(tableText[j].text);
                    let td = tr.querySelector('td');
                    if (expectedResult.highlightedIndices.includes(j)) {
                        expect(td.className).toBe(tableText[j].class + ' levelCurrent');
                        expect(window.getComputedStyle(td, null).getPropertyValue('color')).toBe('rgb(255, 255, 0)');
                    } else {
                        expect(td.className).toBe(tableText[j].class + ' level');
                        expect(window.getComputedStyle(td, null).getPropertyValue('color')).toBe('rgb(255, 255, 255)');
                    }
                }
            });
        }
        let tableText = [
            { text: 'Level 1',                   class: 'levelLargeText'  },
            { text: '$5 / $10',                  class: 'levelLargeText'  },
            { text: 'Level 2',                   class: 'levelLargeText'  },
            { text: '$10 / $20',                 class: 'levelLargeText'  },
            { text: 'Level 3',                   class: 'levelLargeText'  },
            { text: '$15 / $30',                 class: 'levelLargeText'  },
            { text: 'Level 4',                   class: 'levelLargeText'  },
            { text: '$20 / $40',                 class: 'levelLargeText'  },
            { text: 'Level 5',                   class: 'levelLargeText'  },
            { text: '$25 / $50',                 class: 'levelLargeText'  },
            { text: 'Break 1',                   class: 'levelLargeText'  },
            { text: '1 minutes',                 class: 'levelLargeText'  },
            { text: 'Level 6',                   class: 'levelLargeText'  },
            { text: '$50 / $100',                class: 'levelLargeText'  },
            { text: 'Level 7',                   class: 'levelLargeText'  },
            { text: '$75 / $150',                class: 'levelLargeText'  },
            { text: 'Level 8',                   class: 'levelLargeText'  },
            { text: '$100 / $200 / $25',         class: 'levelMediumText' },
            { text: 'Level 9',                   class: 'levelLargeText'  },
            { text: '$150 / $300 / $40',         class: 'levelMediumText' },
            { text: 'Level 10',                  class: 'levelLargeText'  },
            { text: '$200 / $400 / $50',         class: 'levelMediumText' },
            { text: 'Break 2',                   class: 'levelLargeText'  },
            { text: '1 minutes',                 class: 'levelLargeText'  },
            { text: 'Level 11',                  class: 'levelLargeText'  },
            { text: '$300 / $600 / $75',         class: 'levelMediumText' },
            { text: 'Level 12',                  class: 'levelLargeText'  },
            { text: '$400 / $800 / $100',        class: 'levelMediumText' },
            { text: 'Level 13',                  class: 'levelLargeText'  },
            { text: '$500 / $1,000 / $100',      class: 'levelMediumText' },
            { text: 'Level 14',                  class: 'levelLargeText'  },
            { text: '$1,000 / $2,000 / $200',    class: 'levelMediumText' },
            { text: 'Level 15',                  class: 'levelLargeText'  },
            { text: '$4,000 / $8,000 / $1,000',  class: 'levelSmallText'  },
            { text: 'Level 16',                  class: 'levelLargeText'  },
            { text: '$5,000 / $10,000 / $1,000', class: 'levelSmallText'  }
        ];
        let expectedResults = [
            { startIndex: 0,  endIndex: 9,  highlightedIndices: [  0,  1 ] },
            { startIndex: 0,  endIndex: 9,  highlightedIndices: [  2,  3 ] },
            { startIndex: 0,  endIndex: 9,  highlightedIndices: [  4,  5 ] },
            { startIndex: 2,  endIndex: 11, highlightedIndices: [  6,  7 ] },
            { startIndex: 4,  endIndex: 13, highlightedIndices: [  8,  9 ] },
            { startIndex: 6,  endIndex: 15, highlightedIndices: [ 10, 11 ] },
            { startIndex: 8,  endIndex: 17, highlightedIndices: [ 12, 13 ] },
            { startIndex: 10, endIndex: 19, highlightedIndices: [ 14, 15 ] },
            { startIndex: 12, endIndex: 21, highlightedIndices: [ 16, 17 ] },
            { startIndex: 14, endIndex: 23, highlightedIndices: [ 18, 19 ] },
            { startIndex: 16, endIndex: 25, highlightedIndices: [ 20, 21 ] },
            { startIndex: 18, endIndex: 27, highlightedIndices: [ 22, 23 ] },
            { startIndex: 20, endIndex: 29, highlightedIndices: [ 24, 25 ] },
            { startIndex: 22, endIndex: 31, highlightedIndices: [ 26, 27 ] },
            { startIndex: 24, endIndex: 33, highlightedIndices: [ 28, 29 ] },
            { startIndex: 26, endIndex: 35, highlightedIndices: [ 30, 31 ] },
            { startIndex: 26, endIndex: 35, highlightedIndices: [ 32, 33 ] },
            { startIndex: 26, endIndex: 35, highlightedIndices: [ 34, 35 ] }
        ];
        for (let i = 0; i < expectedResults.length; i++) {
            testBlindSchedule(i, expectedResults[i], tableText);
        };
    });
    describe('Payouts', () => {
        function testPayout(payouts, expectedResult) {
            it(`should display ${payouts.length} payouts`, () => {
                let tournamentControlService = fixture.debugElement.injector.get(TournamentControlService);
                for (let i = 0; i < 13; i++) {
                    tournamentControlService.entrantPlus();
                }
                tournamentControlService.setPayouts(payouts);
                fixture.detectChanges();
                de = fixture.debugElement.query(By.css('#payouts'));
                el = de.nativeElement;
                let lis = el.querySelectorAll('li');
                expect(lis.length).toBe(payouts.length);
                for (let j = 0; j < lis.length; j++) {
                    expect(lis[j].textContent.trim().replace(/\s\s+/g, ' ')).toBe(expectedResult[j]);
                }
            });
        }
        let payouts = [
            [ 1                                                ],
            [ .7,  .3                                          ],
            [ .6,  .3,   .1                                    ],
            [ .5,  .25,  .15,  .1                              ],
            [ .5,  .25,  .15,  .075, .025                      ],
            [ .45, .2,   .15,  .1,   .075, .025                ],
            [ .45, .2,   .15,  .1,   .05,  .03, .02            ],
            [ .45, .2,   .15,  .085, .05,  .03, .02, .015      ],
            [ .4,  .225, .175, .075, .05,  .03, .02, .015, .01 ]
        ];
        let expectedResults = [
            [ '1st: $130'                                                                                            ],
            [ '1st: $91', '2nd: $39'                                                                                 ],
            [ '1st: $78', '2nd: $39', '3rd: $13'                                                                     ],
            [ '1st: $65', '2nd: $33', '3rd: $19', '4th: $13'                                                         ],
            [ '1st: $65', '2nd: $33', '3rd: $19', '4th: $10', '5th: $3'                                              ],
            [ '1st: $59', '2nd: $26', '3rd: $19', '4th: $13', '5th: $10', '6th: $3'                                  ],
            [ '1st: $59', '2nd: $26', '3rd: $19', '4th: $13', '5th: $6',  '6th: $4', '7th: $3'                       ],
            [ '1st: $59', '2nd: $26', '3rd: $19', '4th: $11', '5th: $6',  '6th: $4', '7th: $3', '8th: $2'            ],
            [ '1st: $52', '2nd: $29', '3rd: $23', '4th: $10', '5th: $6',  '6th: $4', '7th: $3', '8th: $2', '9th: $1' ]
        ];
        for (let i = 0; i < payouts.length; i++) {
            testPayout(payouts[i], expectedResults[i]);
        }
    });
});
