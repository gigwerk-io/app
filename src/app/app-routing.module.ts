import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './providers/check-tutorial.service';
import {CheckAuth} from './providers/check-auth.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tutorial',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
    canActivate: [CheckAuth]
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignUpModule),
    canActivate: [CheckAuth]
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule),
    canActivate: [CheckAuth]
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule),
    canActivate: [CheckAuth]
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then(m => m.TutorialModule),
    canLoad: [CheckTutorial]
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule),
    canActivate: [CheckAuth]
  },
  {
    path: 'r/:username',
    loadChildren: () => import('./pages/referral/referral.module').then(m => m.ReferralPageModule)
  },
  {
    path: 'customer-referral/:username',
    loadChildren: () => import('./pages//customer-referral/customer-referral.module').then(m => m.CustomerReferralPageModule)
  },
  {
    path: '**',
    redirectTo: '/tutorial'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CheckAuth]
})
export class AppRoutingModule {}
