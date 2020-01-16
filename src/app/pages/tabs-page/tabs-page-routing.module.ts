import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/app/tabs/marketplace',
        pathMatch: 'full'
      },
      {
        path: 'marketplace',
        children: [
          {
            path: '',
            loadChildren: () => import('../marketplace/marketplace.module').then(m => m.MarketplacePageModule)
          },
          {
            path: 'task-complete/:id',
            loadChildren: () => import('../complete-task/complete-task.module').then(m => m.CompleteTaskPageModule)
          }
        ]
      },
      {
        path: 'friends',
        children: [
          {
            path: '',
            loadChildren: () => import('../friends/friends.module').then(m => m.FriendsPageModule)
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
          }
        ]
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: () =>  import('../notifications/notifications.module').then(m => m.NotificationsPageModule)
          }
        ]
      }
    ]
  },
  {
    path: 'profile/:id',
    loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'marketplace-detail/:id',
    loadChildren: () => import('../marketplace-detail/marketplace-detail.module').then(m => m.MarketplaceDetailPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('../chat/chat.module').then(m => m.ChatPageModule)
  },
  {
    path: 'room/:uuid',
    loadChildren: () => import('../messages/messages.module').then(m => m.MessagesPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule),
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('../edit-profile/edit-profile.module').then(m => m.EditProfilePageModule),
  },
  {
    path: 'edit-task',
    loadChildren: () => import('../request/request.module').then(m => m.RequestPageModule),
  },
  {
    path: 'notification-preferences',
    // tslint:disable-next-line:max-line-length
    loadChildren: () => import('../notification-preferences/notification-preferences.module').then(m => m.NotificationPreferencesPageModule),
  },
  {
    path: 'privacy-preferences',
    // tslint:disable-next-line:max-line-length
    loadChildren: () => import('../privacy-preferences/privacy-preferences.module').then(m => m.PrivacyPreferencesPageModule),
  },
  {
    path: 'saved-locations',
    // tslint:disable-next-line:max-line-length
    loadChildren: () => import('../saved-locations/saved-locations.module').then(m => m.SavedLocationsPageModule),
  },
  {
    path: 'add-location',
    loadChildren: () => import('../add-location/add-location.module').then(m => m.AddLocationPageModule),
  },
  {
    path: 'reset-password',
    loadChildren: () => import('../reset-password/reset-password.module').then(m => m.ResetPasswordPageModule),
  },
  {
    path: 'account-options',
    loadChildren: () => import('../account-options/account-options.module').then(m => m.AccountOptionsPageModule),
  },
  {
    path: 'manage-cards',
    loadChildren: () => import('../manage-cards/manage-cards.module').then(m => m.ManageCardsPageModule),
  },
  {
    path: 'set-up-payments',
    loadChildren: () => import('../set-up-payments/set-up-payments.module').then(m => m.SetUpPaymentsPageModule),
  },
  {
    path: 'credit-amount',
    loadChildren: () => import('../credit-amount/credit-amount.module').then(m => m.CreditAmountPageModule),
  },
  {
    path: 'redeem-code',
    loadChildren: () => import('../redeem-code/redeem-code.module').then(m => m.RedeemCodePageModule),
  },
  {
    path: 'remembered-devices',
    loadChildren: () => import('../remembered-devices/remembered-devices.module').then(m => m.RememberedDevicesPageModule),
  },
  {
    path: 'remembered-devices',
    loadChildren: () => import('../remembered-devices/remembered-devices.module').then(m => m.RememberedDevicesPageModule),
  },
  {
    path: 'connect-bank-account',
    loadChildren: () => import('../connect-bank-account/connect-bank-account.module').then(m => m.ConnectBankAccountPageModule),
  },
  {
    path: 'current-balance',
    loadChildren: () => import('../current-balance/current-balance.module').then(m => m.CurrentBalancePageModule),
  },
  {
    path: 'past-transfers',
    loadChildren: () => import('../past-transfers/past-transfers.module').then(m => m.PastTransfersPageModule),
  },
  {
    path: 'past-payments',
    loadChildren: () => import('../past-payments/past-payments.module').then(m => m.PastPaymentsPageModule),
  },
  {
    path: 'search',
    loadChildren: () => import('../search/search.module').then(m => m.SearchPageModule),
  },
  {
    path: 'select-city',
    loadChildren: () => import('../select-city/select-city.module').then(m => m.SelectCityPageModule),
  },
  {
    path: 'report',
    loadChildren: () => import('../report/report.module').then(m => m.ReportPageModule),
  },
  {
    path: 'customer-tutorial',
    loadChildren: () => import('../customer-tutorial/customer-tutorial.module').then(m => m.CustomerTutorialPageModule),
  },
  {
    path: 'refer-a-worker',
    loadChildren: () => import('../refer-a-worker/refer-a-worker.module').then(m => m.ReferAWorkerPageModule)
  },
  {
    path: 'refer-a-customer',
    loadChildren: () => import('../refer-a-customer/refer-a-customer.module').then(m => m.ReferACustomerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

