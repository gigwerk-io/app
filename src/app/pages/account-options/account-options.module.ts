import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AccountOptionsPage } from './account-options.page';
import {CommonComponentsModule} from '../../utils/components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: AccountOptionsPage
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
  declarations: [AccountOptionsPage]
})
export class AccountOptionsPageModule {}
