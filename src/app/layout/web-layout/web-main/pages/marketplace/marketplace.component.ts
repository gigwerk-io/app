import { Component, OnInit } from '@angular/core';
import {Events} from '../../../../../utils/services/events';
import {MainMarketplaceTask} from '../../../../../utils/interfaces/main-marketplace/main-marketplace-task';
import {MarketplaceService} from '../../../../../utils/services/marketplace.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent implements OnInit {
  marketplaceTasks: MainMarketplaceTask[];

  constructor(
    private events: Events,
    private marketplaceService: MarketplaceService
  ) { }

  ngOnInit(): void {
    this.events.publish('currentPageUrl', '/app/marketplace');
    this.marketplaceService.getMainMarketplaceRequests('all')
      .then(res => this.marketplaceTasks = res.data);
  }

}
