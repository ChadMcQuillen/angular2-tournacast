import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export abstract class TimerTickService {
    public timerTickObservable: Observable<number>;
}
