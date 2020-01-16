import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConnectBankAccountPage } from './connect-bank-account.page';
import {CommonComponentsModule} from '../../utils/components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: ConnectBankAccountPage
  }
];

@NgModule({
  imports: [
    CommonComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConnectBankAccountPage]
})
export class ConnectBankAccountPageModule {}
