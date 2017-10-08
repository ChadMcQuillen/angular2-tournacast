import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export abstract class TournamentControlService {
    public command: BehaviorSubject<any>;
}
