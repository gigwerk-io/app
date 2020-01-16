import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ManageCardsPage } from './manage-cards.page';
import {CommonComponentsModule} from '../../utils/components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: ManageCardsPage
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
  declarations: [ManageCardsPage]
})
export class ManageCardsPageModule {}
