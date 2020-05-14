import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {WebLayoutComponent} from './web-layout.component';

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
    RouterModule.forChild(routes)
  ]
})
export class WebLayoutModule { }
