import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule, IonRouterOutlet} from '@ionic/angular';

import { TabsPage } from './tabs-page';
import { TabsPageRoutingModule } from './tabs-page-routing.module';
import { MarketplacePageModule } from '../marketplace/marketplace.module';
import {FriendsPageModule} from '../friends/friends.module';
import {SettingsPageModule} from '../settings/settings.module';
import {MarketplaceDetailPageModule} from '../marketplace-detail/marketplace-detail.module';
import {CompleteTaskPageModule} from '../complete-task/complete-task.module';
import {ReportPageModule} from '../report/report.module';
import {RequestPage} from '../request/request.page';

const MODULES = [
  CommonModule,
  CompleteTaskPageModule,
  FriendsPageModule,
  IonicModule,
  MarketplaceDetailPageModule,
  ReportPageModule,
  SettingsPageModule,
  TabsPageRoutingModule,
];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    TabsPage,
  ]
})
export class TabsModule { }
