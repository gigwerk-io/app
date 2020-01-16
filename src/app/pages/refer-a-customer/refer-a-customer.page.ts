import { Component, OnInit } from '@angular/core';
import {ReferralService} from '../../utils/services/referral.service';
import {Platform, ToastController} from '@ionic/angular';
import {ORIGIN, StorageKeys} from '../../providers/constants';
import {Storage} from '@ionic/storage';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'refer-a-customer',
  templateUrl: './refer-a-customer.page.html',
  styleUrls: ['./refer-a-customer.page.scss'],
})
export class ReferACustomerPage implements OnInit {

  constructor(private referralService: ReferralService,
              private toastController: ToastController,
              private storage: Storage,
              private platform: Platform,
              private socialSharing: SocialSharing) { }

  ngOnInit() {
  }

  shareReferral() {
    this.platform.ready().then(async () => {
      let username;
      await this.storage.get(StorageKeys.PROFILE)
        .then(profile => username = profile.user.username);

      await this.socialSharing.share(`${ORIGIN}/customer-referral/${username}`).then(() => {
      }).catch((err) => this.copyToClipboard());
    });
  }

  copyToClipboard() {
    this.storage.get(StorageKeys.PROFILE).then(profile => {
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = `${ORIGIN}/customer-referral/${profile.user.username}`;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.presentToast('Copied to clipboard.');
    });
  }

  async presentToast(message) {
    await this.toastController.create({
      message: message,
      position: 'bottom',
      duration: 2500,
      color: 'dark',
      showCloseButton: true
    }).then(toast => toast.present());
  }
}
