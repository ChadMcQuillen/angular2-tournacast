import { TimerFormatPipe } from './timer-format.pipe';

describe('TimerFormatPipe', () => {

    let pipe = new TimerFormatPipe();

    describe('Levels less than one hour', () => {
        it('0 seconds should be 00:00', () => {
            expect(pipe.transform(0, false)).toBe('00:00');
        });
        it('1 second should be 00:01', () => {
            expect(pipe.transform(1, false)).toBe('00:01');
        });
        it('59 seconds should be 00:59', () => {
            expect(pipe.transform(59, false)).toBe('00:59');
        });
        it('60 seconds should be 01:00', () => {
            expect(pipe.transform(60, false)).toBe('01:00');
        });
        it('3599 seconds should be 59:59', () => {
            expect(pipe.transform(3599, false)).toBe('59:59');
        });
    });

    describe('Levels one hour or greater', () => {
        it('0 seconds should be 0:00:00', () => {
            expect(pipe.transform(0, true)).toBe('0:00:00');
        });
        it('1 second should be 0:00:01', () => {
            expect(pipe.transform(1, true)).toBe('0:00:01');
        });
        it('59 seconds should be 0:00:59', () => {
            expect(pipe.transform(59, true)).toBe('0:00:59');
        });
        it('60 seconds should be 0:01:00', () => {
            expect(pipe.transform(60, true)).toBe('0:01:00');
        });
        it('3599 seconds should be 0:59:59', () => {
            expect(pipe.transform(3599, true)).toBe('0:59:59');
        });
        it('3600 seconds should be 1:00:00', () => {
            expect(pipe.transform(3600, true)).toBe('1:00:00');
        });
    });
});
