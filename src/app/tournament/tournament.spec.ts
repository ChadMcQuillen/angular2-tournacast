import { Tournament } from './tournament';

let title: string = 'Friday Night Poker';
let description: string = '$10 Buy-in (1 rebuy through level 5)';
let buyIn: number = 10;
let rebuyAmount: number = 10;
let rebuyThroughLevel: number = 5;
let oneLevel: any[] = [
    { level: 1, levelTime: 20, smallBlind: 5, bigBlind: 10, ante: 0, breakTime: 0 }
];
let onePayout: number[] = [ 1 ];
let simpleTournamentInfo = {
    title: title,
    description: description,
    buyIn: buyIn,
    rebuyAmount: rebuyAmount,
    rebuyThroughLevel: rebuyThroughLevel,
    levels: oneLevel,
    payouts: onePayout
};

describe('Tournament', () => {
    describe('Constructor', () => {
        let tournament = new Tournament(simpleTournamentInfo);
        it(`title should be ${title}`, () => {
            expect(tournament.title).toBe(title);
        });
        it(`description should be ${description}`, () => {
            expect(tournament.description).toBe(description);
        });
        it(`buyIn should be ${buyIn}`, () => {
            expect(tournament.buyIn).toBe(buyIn);
        });
        it(`rebuyAmount should be ${rebuyAmount}`, () => {
            expect(tournament.rebuyAmount).toBe(rebuyAmount);
        });
        it(`rebuyThroughLevel should be ${rebuyThroughLevel}`, () => {
            expect(tournament.rebuyThroughLevel).toBe(rebuyThroughLevel);
        });
        it('There should be 1 payout of 100%', () => {
            expect(tournament.payouts.length).toBe(1);
            expect(tournament.payouts[0]).toBe(1);
        });
        it('numberOfEntrants should be 0', () => {
            expect(tournament.numberOfEntrants).toBe(0);
        });
        it('numberOfPlayersRemaining should be 0', () => {
            expect(tournament.numberOfPlayersRemaining).toBe(0);
        });
        it('numberOfRebuys should be 0', () => {
            expect(tournament.numberOfRebuys).toBe(0);
        });
    });
    describe('Levels and Breaks', () => {
        it('2 levels and 1 break should be 3 total levels and breaks', () => {
            let levels: any[] = [
                { level: 1,  levelTime: 20, smallBlind: 5,   bigBlind: 10,  ante: 0, breakTime: 20 },
                { level: 2,  levelTime: 20, smallBlind: 10,  bigBlind: 20,  ante: 0, breakTime: 0  }
            ];
            let tournamentInfo = {
                title: title,
                description: description,
                buyIn: buyIn,
                rebuyAmount: rebuyAmount,
                rebuyThroughLevel: rebuyThroughLevel,
                levels: levels,
                payouts: onePayout
            };
            let tournament = new Tournament(tournamentInfo);
            expect(tournament.levelsAndBreaks.length).toBe(3);
        });
        it('4 levels and 2 breaks should be 6 total levels and breaks', () => {
            let levels: any[] = [
                { level: 1,  levelTime: 20, smallBlind: 5,   bigBlind: 10,  ante: 0, breakTime: 20 },
                { level: 2,  levelTime: 20, smallBlind: 10,  bigBlind: 20,  ante: 0, breakTime: 0  },
                { level: 3,  levelTime: 20, smallBlind: 15,  bigBlind: 30,  ante: 0, breakTime: 20 },
                { level: 4,  levelTime: 20, smallBlind: 20,  bigBlind: 40,  ante: 0, breakTime: 0  },
            ];
            let tournamentInfo = {
                title: title,
                description: description,
                buyIn: buyIn,
                rebuyAmount: rebuyAmount,
                rebuyThroughLevel: rebuyThroughLevel,
                levels: levels,
                payouts: onePayout
            };
            let tournament = new Tournament(tournamentInfo);
            expect(tournament.levelsAndBreaks.length).toBe(6);
        });
    });
    describe('Pause / Resume', () => {
        let tournament = new Tournament(simpleTournamentInfo);
        it('Initial state should be start-pending', () => {
            expect(tournament.state).toBe('start-pending');
        });
        it('Pause while start-pending should remain start-pending', () => {
            tournament.pause();
            expect(tournament.state).toBe('start-pending');
        });
        it('Resume while start-pending should remain start-pending', () => {
            tournament.resume();
            expect(tournament.state).toBe('start-pending');
        });
        it('Start while start-pending should transition to running', () => {
            tournament.start();
            expect(tournament.state).toBe('running');
        });
        it('Start while running should remain running', () => {
            tournament.start();
            expect(tournament.state).toBe('running');
        });
        it('Resume while running should remain running', () => {
            tournament.resume();
            expect(tournament.state).toBe('running');
        });
        it('Pause while running should transition to paused', () => {
            tournament.pause();
            expect(tournament.state).toBe('paused');
        });
        it('Start while paused should remain paused', () => {
            tournament.start();
            expect(tournament.state).toBe('paused');
        });
        it('Pause while paused should remain paused', () => {
            tournament.pause();
            expect(tournament.state).toBe('paused');
        });
        it('Resume while paused should transition to running', () => {
            tournament.resume();
            expect(tournament.state).toBe('running');
        });
        it('Stop while running should transition to stopped', () => {
            tournament.stop();
            expect(tournament.state).toBe('stopped');
        });
        it('Stop while start-pending should transition to stopped', () => {
            tournament = new Tournament(simpleTournamentInfo);
            tournament.stop();
            expect(tournament.state).toBe('stopped');
        });
        it('Stop while paused should transition to stopped', () => {
            tournament = new Tournament(simpleTournamentInfo);
            tournament.start();
            expect(tournament.state).toBe('running');
            tournament.pause();
            expect(tournament.state).toBe('paused');
            tournament.stop();
            expect(tournament.state).toBe('stopped');
        });
    });
    describe('Number of Entrants', () => {
        let tournament = new Tournament(simpleTournamentInfo);
        it('0 entrants, add entrant should be 1 entrant', () => {
            tournament.entrantPlus();
            expect(tournament.numberOfEntrants).toBe(1);
        });
        it('1 entrant, subtract entrant should be 0 entrants', () => {
            tournament.entrantMinus();
            expect(tournament.numberOfEntrants).toBe(0);
        });
        it('0 entrants, subtract entrant should be 0 entrants', () => {
            tournament.entrantMinus();
            expect(tournament.numberOfEntrants).toBe(0);
        });
    });
    describe('Number of Players Remaining', () => {
        let tournament = new Tournament(simpleTournamentInfo);
        it('0 entrants, add entrant should be 1 player remaining', () => {
            tournament.entrantPlus();
            expect(tournament.numberOfPlayersRemaining).toBe(1);
        });
        it('1 entrant, subtract entrant should be 0 players remaining', () => {
            tournament.entrantMinus();
            expect(tournament.numberOfPlayersRemaining).toBe(0);
        });
        it('0 players remaining, subtract player should be 0 players remaining', () => {
            tournament.playerMinus();
            expect(tournament.numberOfPlayersRemaining).toBe(0);
        });
        it('1 entrant, 1 player remaining, add player should be 1 player remaining', () => {
            tournament.entrantPlus();
            tournament.playerPlus()
            expect(tournament.numberOfPlayersRemaining).toBe(1);
        });
        it('1 entrant, 1 player remaining, subtract player should be 0 players remaining', () => {
            tournament.playerMinus()
            expect(tournament.numberOfPlayersRemaining).toBe(0);
        });
        it('1 entrant, 0 players remaining, add player should be 1 player remaining', () => {
            tournament.playerPlus()
            expect(tournament.numberOfPlayersRemaining).toBe(1);
        });
    });
    describe('Number of Rebuys', () => {
        let tournament = new Tournament(simpleTournamentInfo);
        it('0 rebuys, add rebuy should be 1 rebuy', () => {
            tournament.rebuyPlus();
            expect(tournament.numberOfRebuys).toBe(1);
        });
        it('1 rebuy, subtract rebuy should be 0 rebuys', () => {
            tournament.rebuyMinus();
            expect(tournament.numberOfRebuys).toBe(0);
        });
        it('0 rebuys, subtract rebuy should be 0 rebuys', () => {
            tournament.rebuyMinus();
            expect(tournament.numberOfRebuys).toBe(0);
        });
    });
    describe('Level Control', () => {
        let levels: any[] = [
            { level: 1,  levelTime: 20, smallBlind: 5,   bigBlind: 10,  ante: 0, breakTime: 0 },
            { level: 2,  levelTime: 20, smallBlind: 10,  bigBlind: 20,  ante: 0, breakTime: 0 },
            { level: 3,  levelTime: 20, smallBlind: 15,  bigBlind: 30,  ante: 0, breakTime: 0 },
            { level: 4,  levelTime: 20, smallBlind: 20,  bigBlind: 40,  ante: 0, breakTime: 0 },
        ];
        let tournamentInfo = {
            title: title,
            description: description,
            buyIn: buyIn,
            rebuyAmount: rebuyAmount,
            rebuyThroughLevel: rebuyThroughLevel,
            levels: levels,
            payouts: onePayout
        };
        let tournament = new Tournament(tournamentInfo);
        it('Level decrement while start-pending should remain at level 1', () => {
            tournament.previousLevel();
            expect(tournament.currentLevelIndex).toBe(0);
            expect(tournament.state).toBe('start-pending');
        });
        it('Level increment while start-pending should remain at level 1', () => {
            tournament.nextLevel();
            expect(tournament.currentLevelIndex).toBe(0);
            expect(tournament.state).toBe('start-pending');
        });
        it('Level decrement while at level 1 should remain at level 1', () => {
            tournament.start();
            tournament.previousLevel();
            expect(tournament.currentLevelIndex).toBe(0);
            expect(tournament.state).toBe('running');
        });
        it('Level increment while at level 1 should transition to level 2', () => {
            tournament.nextLevel();
            expect(tournament.currentLevelIndex).toBe(1);
            expect(tournament.state).toBe('paused');
        });
        it('Level decrement while at level 2 should transition to level 1', () => {
            tournament.previousLevel();
            expect(tournament.currentLevelIndex).toBe(0);
            expect(tournament.state).toBe('paused');
        });
        it('Level increment while at level 4 should remain at level 4', () => {
            tournament.nextLevel();
            tournament.nextLevel();
            tournament.nextLevel();
            tournament.nextLevel();
            expect(tournament.currentLevelIndex).toBe(3);
            expect(tournament.state).toBe('paused');
        });
    });
});