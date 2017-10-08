import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TournamentControlService } from '../core/tournament.control.service';

@Component({
    selector: 'app-splash-screen',
    templateUrl: './splash-screen.component.html',
    styleUrls: ['./splash-screen.component.css'],
})
export class SplashScreenComponent implements OnInit {

    constructor(private router: Router,
                private tournamentControlService: TournamentControlService) {
        this.tournamentControlService.command.subscribe(
            value => {
                if (value.command === 'tournament') {
                    this.router.navigate(['/tournament']);
                }
            }
        );
    }

    ngOnInit() {
    }
}
