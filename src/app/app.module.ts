import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from './core/core.module';
import { SlideShowModule } from './slide-show/slide-show.module';
import { SplashScreenModule } from './splash-screen/splash-screen.module';
import { TournamentModule } from './tournament/tournament.module';
import { SlideShowComponent } from './slide-show/slide-show.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { TournamentComponent } from './tournament/tournament.component';

import { AppComponent } from './app.component';

const appRoutes: Routes = [
    { path: 'tournament', component: TournamentComponent },
    { path: 'slideshow', component: SlideShowComponent },
    { path: 'splashscreen', component: SplashScreenComponent },
    { path: '', redirectTo: '/splashscreen', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    CoreModule,
    SlideShowModule,
    SplashScreenModule,
    TournamentModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
