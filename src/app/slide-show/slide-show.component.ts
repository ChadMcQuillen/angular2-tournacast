import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Image } from '../core/image';
import { ImageService } from '../core/image.service';
import { TournamentControlService } from '../core/tournament.control.service';

@Component({
    selector: 'app-slide-show',
    templateUrl: './slide-show.component.html',
    styleUrls: ['./slide-show.component.css'],
})
export class SlideShowComponent implements OnInit, OnDestroy {

    public images: Image[] = [ ];
    public currentImage: Image;

    private currentImageIndex: number;
    private timerSubscription: Subscription;

    constructor(private router: Router,
                private imageService: ImageService,
                private tournamentControlService: TournamentControlService) {
        this.tournamentControlService.command.subscribe(
            value => {
                if (value.command === 'tournament') {
                    this.router.navigate(['/tournament']);
                }
            }
        );
        const imagesLoadedSubscription = this.imageService.imagesLoaded.subscribe(
            value => {
                this.images = this.imageService.images;
            }
        )
        this.images = this.imageService.images;
        this.currentImage = this.images[0];
        this.currentImageIndex = 0;

        let timer = Observable.timer(60000, 60000);
        this.timerSubscription = timer.subscribe(t=> {
            this.showNextImage();
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.timerSubscription.unsubscribe();
        this.timerSubscription = null;
    }

    private showNextImage() {
        this.currentImageIndex += 1;
        if (this.currentImageIndex === this.images.length) {
            this.currentImageIndex = 0;
        }
        this.currentImage = this.images[this.currentImageIndex];
    }
}
