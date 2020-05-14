import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';

const routes: Routes = [
  {
    path: '',
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
      // {
      //   path: 'friends',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () => import('../friends/friends.module').then(m => m.FriendsPageModule)
      //     }
      //   ]
      // },
      {
        path: 'chat',
        loadChildren: () => import('../chat/chat.module').then(m => m.ChatPageModule)
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

