import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppLayoutComponent} from './app-layout.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: []
  }
];

@NgModule({
  declarations: [AppLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AppLayoutModule { }
