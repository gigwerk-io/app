import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {ProfileService} from '../../utils/services/profile.service';
import {MarketplaceService} from '../../utils/services/marketplace.service';

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
              private toastCtrl: ToastController,
              private profileService: ProfileService,
              private marketplaceService: MarketplaceService) { }

  ngOnInit() {}

  async presentToast(message) {
    await this.toastCtrl.create({
      message: message,
      position: 'top',
      duration: 2500,
      color: 'dark',
      showCloseButton: true
    }).then(t => {
      t.present();
    });
  }

  closeReportPage() {
    this.modalCtrl.dismiss();
  }

  onSubmitReport() {
    switch (this.type) {
      case 'User':
        this.profileService.reportUser(this.extra.user.user_id, this.description)
          .then((res: string) => this.presentToast(res));
        this.closeReportPage();
        break;
      case 'Task':
        this.marketplaceService.mainMarketplaceReportTask(this.extra.id, this.description)
          .then((res: string) => this.presentToast(res));
        this.closeReportPage();
        break;
    }
  }
}
