import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PastPaymentsPage } from './past-payments.page';
import {CommonComponentsModule} from '../../utils/components/common-components.module';
import {MomentModule} from 'ngx-moment';

const routes: Routes = [
  {
    path: '',
    component: PastPaymentsPage
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
  declarations: [PastPaymentsPage]
})
export class PastPaymentsPageModule {}
