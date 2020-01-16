import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RequestPage } from './request.page';
import {CommonComponentsModule} from '../../utils/components/common-components.module';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {Camera} from '@ionic-native/camera/ngx';

const routes: Routes = [
  {
    path: '',
    component: RequestPage
  }
];

const MODULES = [
  CommonModule,
  CommonComponentsModule,
  FormsModule,
  IonicModule,
  RouterModule.forChild(routes)
];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [RequestPage],
  providers: [
    Camera,
    ImagePicker
  ]
})
export class RequestPageModule {}
