import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PastTransfersPage } from './past-transfers.page';
import {CommonComponentsModule} from '../../utils/components/common-components.module';
import {MomentModule} from 'ngx-moment';

const routes: Routes = [
  {
    path: '',
    component: PastTransfersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MomentModule
  ],
  declarations: [PastTransfersPage]
})
export class PastTransfersPageModule {}
