import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ImageService } from '../core/image.service';
import { TournamentControlService } from '../core/tournament.control.service';

@Component({
    selector: 'app-splash-screen',
    templateUrl: './splash-screen.component.html',
    styleUrls: ['./splash-screen.component.css'],
})
export class SplashScreenComponent implements OnInit {

    constructor(private router: Router,
                private imageService: ImageService,
                private tournamentControlService: TournamentControlService) {
        const tournamentControlSubscription = this.tournamentControlService.command.subscribe(
            value => {
                if (value.command === 'tournament') {
                    tournamentControlSubscription.unsubscribe();
                    this.router.navigate(['/tournament']);
                }
            }
        );
        const imagesLoadedSubscription = this.imageService.imagesLoaded.subscribe(
            value => {
                if (value > 0) {
                    imagesLoadedSubscription.unsubscribe();
                    this.router.navigate(['/slideshow']);
                }
            }
        )
    }

    ngOnInit() {
    }
}
