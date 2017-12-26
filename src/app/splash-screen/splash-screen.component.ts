import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ImageService } from '../core/image.service';
import { TournamentService } from '../core/tournament.service';

@Component({
    selector: 'app-splash-screen',
    templateUrl: './splash-screen.component.html',
    styleUrls: ['./splash-screen.component.css'],
})
export class SplashScreenComponent implements OnInit {

    constructor(private router: Router,
                private imageService: ImageService,
                private tournamentService: TournamentService) {
        this.tournamentService.tournamentControl.subscribe(
            value => {
                if (value === 'start-pending') {
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
