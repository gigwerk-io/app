import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppLayoutComponent} from './app-layout.component';
import {RouterModule, Routes} from '@angular/router';
import {CheckTutorial} from '../../providers/check-tutorial.service';
import {AppCheckAuth} from '../../providers/app-check-auth.service';
import {IonicModule} from '@ionic/angular';
import {TabsModule} from './pages/tabs-page/tabs-page.module';
import {RequestPageModule} from './pages/request/request.module';
import {SearchPageModule} from './pages/search/search.module';
import {CustomerTutorialPageModule} from './pages/customer-tutorial/customer-tutorial.module';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'tabs',
        loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
      },
      {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'signup',
        loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignUpModule)
      },
      {
        path: 'forgot-password',
        loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
      },
      {
        path: 'tutorial',
        loadChildren: () => import('./pages/tutorial/tutorial.module').then(m => m.TutorialModule),
        canLoad: [CheckTutorial]
      },
      {
        path: 'welcome',
        loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule)
      },
      {
        path: 'r/:username',
        loadChildren: () => import('./pages/referral/referral.module').then(m => m.ReferralPageModule)
      },
      {
        path: 'customer-referral/:username',
        loadChildren: () => import('./pages/customer-referral/customer-referral.module').then(m => m.CustomerReferralPageModule)
      },
      {
        path: 'profile/:id',
        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'marketplace-detail/:id',
        loadChildren: () => import('./pages/marketplace-detail/marketplace-detail.module').then(m => m.MarketplaceDetailPageModule)
      },
      {
        path: 'room/:uuid',
        loadChildren: () => import('./pages/messages/messages.module').then(m => m.MessagesPageModule)
      },
      {
        path: 'edit-profile',
        loadChildren: () => import('./pages/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
      },
      {
        path: 'edit-task',
        loadChildren: () => import('./pages/request/request.module').then(m => m.RequestPageModule)
      },
      {
        path: 'notification-preferences',
        loadChildren: () => import('./pages/notification-preferences/notification-preferences.module')
          .then(m => m.NotificationPreferencesPageModule)
      },
      {
        path: 'privacy-preferences',
        loadChildren: () => import('./pages/privacy-preferences/privacy-preferences.module')
          .then(m => m.PrivacyPreferencesPageModule)
      },
      {
        path: 'saved-locations',
        loadChildren: () => import('./pages/saved-locations/saved-locations.module')
          .then(m => m.SavedLocationsPageModule),
      },
      {
        path: 'add-location',
        loadChildren: () => import('./pages/add-location/add-location.module')
          .then(m => m.AddLocationPageModule),
      },
      {
        path: 'reset-password',
        loadChildren: () => import('./pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule),
      },
      {
        path: 'account-options',
        loadChildren: () => import('./pages/account-options/account-options.module').then(m => m.AccountOptionsPageModule),
      },
      {
        path: 'manage-cards',
        loadChildren: () => import('./pages/manage-cards/manage-cards.module').then(m => m.ManageCardsPageModule),
      },
      {
        path: 'set-up-payments',
        loadChildren: () => import('./pages/set-up-payments/set-up-payments.module').then(m => m.SetUpPaymentsPageModule),
      },
      {
        path: 'credit-amount',
        loadChildren: () => import('./pages/credit-amount/credit-amount.module').then(m => m.CreditAmountPageModule),
      },
      {
        path: 'redeem-code',
        loadChildren: () => import('./pages/redeem-code/redeem-code.module').then(m => m.RedeemCodePageModule),
      },
      {
        path: 'remembered-devices',
        loadChildren: () => import('./pages/remembered-devices/remembered-devices.module').then(m => m.RememberedDevicesPageModule),
      },
      {
        path: 'remembered-devices',
        loadChildren: () => import('./pages/remembered-devices/remembered-devices.module').then(m => m.RememberedDevicesPageModule),
      },
      {
        path: 'connect-bank-account',
        loadChildren: () => import('./pages/connect-bank-account/connect-bank-account.module')
          .then(m => m.ConnectBankAccountPageModule),
      },
      {
        path: 'current-balance',
        loadChildren: () => import('./pages/current-balance/current-balance.module').then(m => m.CurrentBalancePageModule),
      },
      {
        path: 'past-transfers',
        loadChildren: () => import('./pages/past-transfers/past-transfers.module').then(m => m.PastTransfersPageModule),
      },
      {
        path: 'past-payments',
        loadChildren: () => import('./pages/past-payments/past-payments.module').then(m => m.PastPaymentsPageModule),
      },
      {
        path: 'search',
        loadChildren: () => import('./pages/search/search.module').then(m => m.SearchPageModule),
      },
      {
        path: 'select-city',
        loadChildren: () => import('./pages/select-city/select-city.module').then(m => m.SelectCityPageModule),
      },
      {
        path: 'report',
        loadChildren: () => import('./pages/report/report.module').then(m => m.ReportPageModule),
      },
      {
        path: 'customer-tutorial',
        loadChildren: () => import('./pages/customer-tutorial/customer-tutorial.module').then(m => m.CustomerTutorialPageModule),
      },
      {
        path: 'refer-a-worker',
        loadChildren: () => import('./pages/refer-a-worker/refer-a-worker.module').then(m => m.ReferAWorkerPageModule)
      },
      {
        path: 'refer-a-customer',
        loadChildren: () => import('./pages/refer-a-customer/refer-a-customer.module').then(m => m.ReferACustomerPageModule)
      }
    ]
  }
  /**
   * make 404 not found
   */
  // {
  //   path: '**',
  //   redirectTo: '/tutorial'
  // }
];

@NgModule({
  declarations: [AppLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    IonicModule,
    TabsModule,
    CustomerTutorialPageModule,
    RequestPageModule,
    SearchPageModule,
  ],
  exports: [RouterModule],
  providers: [AppCheckAuth]
})
export class AppLayoutModule { }
