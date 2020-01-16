import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SetUpPaymentsPage } from './set-up-payments.page';
import {CommonComponentsModule} from '../../utils/components/common-components.module';
import { CreditCardDirectivesModule } from 'angular-cc-library';

const routes: Routes = [
  {
    path: '',
    component: SetUpPaymentsPage
  }
];

@NgModule({
  imports: [
    CommonComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CreditCardDirectivesModule,
    ReactiveFormsModule
  ],
  declarations: [SetUpPaymentsPage]
})
export class SetUpPaymentsPageModule {}
