import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CompleteTaskPage } from './complete-task.page';
import {IonicRatingModule} from 'ionic4-rating/dist';

const routes: Routes = [
  {
    path: '',
    component: CompleteTaskPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicRatingModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CompleteTaskPage]
})
export class CompleteTaskPageModule {}
