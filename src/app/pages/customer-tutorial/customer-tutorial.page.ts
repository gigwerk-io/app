import { Component, OnInit } from '@angular/core';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../utils/services/auth.service';
import {Router} from '@angular/router';
import {LoadingController, MenuController, ModalController} from '@ionic/angular';
import {StorageKeys} from '../../providers/constants';
import {RequestPage} from '../request/request.page';

@Component({
  selector: 'customer-tutorial',
  templateUrl: './customer-tutorial.page.html',
  styleUrls: ['./customer-tutorial.page.scss'],
})
export class CustomerTutorialPage implements OnInit {

  showSkip = true;
  constructor(public router: Router,
              public storage: Storage,
              private modalCtrl: ModalController,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onSlideChangeStart(event) {
    event.target.isEnd().then(isEnd => {
      this.showSkip = !isEnd;
    });
  }

  goToRequestForm() {
    this.storage.set(StorageKeys.CUSTOMER_TUTORIAL, true);
    this.modalCtrl.dismiss();
    setTimeout(async () => {
      const modal = await this.modalCtrl.create({
        component: RequestPage,
        componentProps: {'isModal': true}
      });

      const loadingRequestPage = await this.loadingCtrl.create({
        message: 'Please wait...',
        translucent: true
      });

      await loadingRequestPage.present();

      await modal.present()
        .then(() => {

          return loadingRequestPage.dismiss();
        });
    }, 0);
  }
}
