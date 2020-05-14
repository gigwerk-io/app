import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './providers/check-tutorial.service';
import {CheckAuth} from './providers/check-auth.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/app/tutorial',
    pathMatch: 'full'
  },
  {
    path: 'app',
    loadChildren: () => import('./layout/app-layout/app-layout.module').then(m => m.AppLayoutModule),
  },
  {
    path: 'web',
    loadChildren: () => import('./layout/web-layout/web-layout.module').then(m => m.WebLayoutModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
