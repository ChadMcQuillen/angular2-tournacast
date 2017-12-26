import { Injectable } from '@angular/core';
import { BehaviorSubject }   from 'rxjs/BehaviorSubject';
import { Tournament } from '../tournament/tournament';
import { TournamentControlService } from './tournament.control.service';

declare var cast: any;

@Injectable()
export class TournamentCastReceiverControlService extends TournamentControlService {

    private castReceiverManager: any;
    private messageBus: any;

    constructor() {
        console.log('TournamentCastReceiverControlService constructed');
        super();
        this.command = new BehaviorSubject({});

        this.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
        console.log('Starting Receiver Manager');

        this.castReceiverManager.onReady = (event) => {
            console.log('Received Ready event: ' + JSON.stringify(event.data));
            this.castReceiverManager.setApplicationState("Application status is ready...");
        };

        this.castReceiverManager.onSenderConnected = (event) => {
            console.log('Received Sender Connected event: ' + event.data);
            console.log(this.castReceiverManager.getSender(event.data).userAgent);
        };

        this.castReceiverManager.onSenderDisconnected = (event) => {
            console.log('Received Sender Disconnected event: ' + event.data);
            if (this.castReceiverManager.getSenders().length === 0 &&
                    event.reason === cast.receiver.system.DisconnectReason.REQUESTED_BY_SENDER) {
                window.close();
            }
        };

        this.castReceiverManager.onSystemVolumeChanged = (event) => {
            console.log('Received System Volume Changed event: ' + event.data['level'] + ' ' +
                event.data['muted']);
        };

        this.messageBus =
            this.castReceiverManager.getCastMessageBus(
                'urn:x-cast:com.bannerstonesoftware.pokertournacast');

        this.messageBus.onMessage = (event) => {
            console.log('Message [' + event.senderId + ']: ' + event.data);
            let tournamentCommand = JSON.parse(event.data);
            this.command.next({
                command:tournamentCommand.command,
                parameters:tournamentCommand.parameters
            });
        };

        this.castReceiverManager.start({statusText: "Application is starting"});
        console.log('Receiver Manager started');
    }

    public broadcastTournamentUpdate(tournamentUpdate): void {
        let updateMessage = JSON.stringify(tournamentUpdate);
        console.log(updateMessage);
        this.messageBus.broadcast(updateMessage);
    }
}
