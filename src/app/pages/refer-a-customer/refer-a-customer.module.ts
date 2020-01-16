import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReferACustomerPage } from './refer-a-customer.page';

const routes: Routes = [
  {
    path: '',
    component: ReferACustomerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReferACustomerPage]
})
export class ReferACustomerPageModule {}
