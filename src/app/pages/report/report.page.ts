import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {ProfileService} from '../../utils/services/profile.service';
import {MarketplaceService} from '../../utils/services/marketplace.service';
import {UtilsService} from '../../utils/services/utils.service';

@Component({
  selector: 'report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {
  @Input() type: string;
  @Input() extra: any;
  description: string;

  constructor(private modalCtrl: ModalController,
              private profileService: ProfileService,
              private marketplaceService: MarketplaceService,
              private utils: UtilsService) { }

  ngOnInit() {}

  closeReportPage() {
    this.modalCtrl.dismiss();
  }

  onSubmitReport() {
    switch (this.type) {
      case 'User':
        this.profileService.reportUser(this.extra.user.user_id, this.description)
          .then((res: string) => this.utils.presentToast(res, 'success'))
          .catch(error => this.utils.presentToast(error.error.message, 'danger'));
        this.closeReportPage();
        break;
      case 'Task':
        this.marketplaceService.mainMarketplaceReportTask(this.extra.id, this.description)
          .then((res: string) => this.utils.presentToast(res, 'success'))
          .catch(error => this.utils.presentToast(error.error.message, 'danger'));
        this.closeReportPage();
        break;
    }
  }
}
