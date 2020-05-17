import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {WebLayoutComponent} from './web-layout.component';
import {CommonComponentsModule} from '../../utils/components/common-components.module';
import {LoginComponent} from './pages/login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {WebCheckAuth} from '../../providers/web-check-auth.service';

const routes: Routes = [
  {
    path: 'main',
    loadChildren: () => import('./web-main/web-main.module').then(m => m.WebMainModule),
    canActivate: [WebCheckAuth]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [WebCheckAuth]
  }
];

@NgModule({
  declarations: [
    WebLayoutComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ],
  exports: [RouterModule]
})
export class WebLayoutModule { }
