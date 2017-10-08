import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplashScreenComponent } from './splash-screen.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SplashScreenComponent
  ],
  exports: [
    SplashScreenComponent
  ]
})
export class SplashScreenModule { }
