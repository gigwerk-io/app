import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {FavrMarketplaceCardComponent} from './favr-marketplace-card/favr-marketplace-card.component';
import {FavrPageHeaderComponent} from './favr-page-header/favr-page-header.component';
import {RouterModule} from '@angular/router';
import {FavrCategoryCardButtonsComponent} from './favr-category-card-buttons/favr-category-card-buttons.component';
import {MomentModule} from 'ngx-moment';
import {NgbRatingModule} from '@ng-bootstrap/ng-bootstrap';

const COMPONENTS = [
  FavrCategoryCardButtonsComponent,
  FavrMarketplaceCardComponent,
  FavrPageHeaderComponent
];

const MODULES = [
  CommonModule,
  FormsModule,
  IonicModule,
  MomentModule,
  RouterModule,
  NgbRatingModule
];

@NgModule({
  imports: [...MODULES],
  exports: [...COMPONENTS, ...MODULES],
  declarations: [...COMPONENTS]
})
export class CommonComponentsModule {}
