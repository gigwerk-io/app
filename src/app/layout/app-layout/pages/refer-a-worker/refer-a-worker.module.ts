import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReferAWorkerPage } from './refer-a-worker.page';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';

const routes: Routes = [
  {
    path: '',
    component: ReferAWorkerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReferAWorkerPage],
  providers: [
    SocialSharing
  ]
})
export class ReferAWorkerPageModule {}
