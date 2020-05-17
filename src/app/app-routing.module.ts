import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './providers/check-tutorial.service';
import {AppCheckAuth} from './providers/app-check-auth.service';
import {AppComponent} from './app.component';
import {AppLayoutModule} from './layout/app-layout/app-layout.module';
import {WebLayoutModule} from './layout/web-layout/web-layout.module';
import {WebCheckAuth} from './providers/web-check-auth.service';

const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'app',
    loadChildren: () => import('./layout/app-layout/app-layout.module').then(m => m.AppLayoutModule),
    canActivate: [AppCheckAuth]
  },
  {
    path: 'web',
    loadChildren: () => import('./layout/web-layout/web-layout.module').then(m => m.WebLayoutModule),
    canActivate: [WebCheckAuth]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
