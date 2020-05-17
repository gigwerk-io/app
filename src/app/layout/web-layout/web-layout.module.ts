import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {WebLayoutComponent} from './web-layout.component';
import {CommonComponentsModule} from '../../utils/components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: WebLayoutComponent,
    children: []
  }
];

@NgModule({
  declarations: [WebLayoutComponent],
  imports: [
    CommonModule,
    CommonComponentsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class WebLayoutModule { }
