import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'timerFormat'})
export class TimerFormatPipe implements PipeTransform {
    transform(value: number, showHours: boolean): string {
        let seconds: number = value % 60;
        value = Math.trunc(value / 60);
        let minutes: number = value % 60;
        value = Math.trunc(value / 60);
        let hours: number = value % 24;

        var timerText = (showHours ? (hours + ':') : '') +
                        (minutes < 10 ? '0' : '') + minutes +
                        ':' +
                        (seconds < 10 ? '0' : '') + seconds;
        return timerText;
    }
}
