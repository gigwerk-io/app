import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from '@ionic/angular';

import { TabsPage } from './tabs-page';
import { TabsPageRoutingModule } from './tabs-page-routing.module';
import {FriendsPageModule} from '../friends/friends.module';
import {SettingsPageModule} from '../settings/settings.module';
import {MarketplaceDetailPageModule} from '../marketplace-detail/marketplace-detail.module';
import {CompleteTaskPageModule} from '../complete-task/complete-task.module';
import {ReportPageModule} from '../report/report.module';

const MODULES = [
  CommonModule,
  IonicModule,
  TabsPageRoutingModule,
  FriendsPageModule,
  MarketplaceDetailPageModule,
  CompleteTaskPageModule,
  ReportPageModule,
  SettingsPageModule,
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
