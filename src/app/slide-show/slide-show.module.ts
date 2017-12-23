import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideShowComponent } from './slide-show.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SlideShowComponent
  ],
  exports: [
    SlideShowComponent
  ]
})
export class SlideShowModule { }
