import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs/Rx';
import { TimerTickService } from './timer-tick.service';

@Injectable()
export class OneSecondTimerTickService extends TimerTickService {
    private timerSubscription: Subscription;

    constructor() {
        super();
        this.timerTickObservable = Observable.create(observer => {
            let timer = Observable.timer(1000, 1000);
            this.timerSubscription = timer.subscribe(t=> {
                observer.next(0);
            });
            return () => {
                this.timerSubscription.unsubscribe();
                this.timerSubscription = null;
            };
        });
    }
}
