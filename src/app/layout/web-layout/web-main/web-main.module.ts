import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WebMainComponent} from './web-main.component';
import {RouterModule, Routes} from '@angular/router';
import {CommonComponentsModule} from '../../../utils/components/common-components.module';
import {MarketplaceComponent} from './pages/marketplace/marketplace.component';

const routes: Routes = [
  {
    path: '',
    component: WebMainComponent,
    children: [
      {
        path: '',
        redirectTo: '/main/marketplace',
        pathMatch: 'full'
      },
      {
        path: 'marketplace',
        component: MarketplaceComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    WebMainComponent,
    MarketplaceComponent
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class WebMainModule { }
