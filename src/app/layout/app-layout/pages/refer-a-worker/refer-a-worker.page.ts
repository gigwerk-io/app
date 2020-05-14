import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ReferralService} from '../../../../utils/services/referral.service';
import {ReferralSteps} from '../../../../utils/interfaces/referrals/ReferralSteps';
import {Platform, ToastController} from '@ionic/angular';
import {ORIGIN, StorageKeys} from '../../../../providers/constants';
import {Storage} from '@ionic/storage';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {UtilsService} from '../../../../utils/services/utils.service';

@Component({
  selector: 'refer-a-worker',
  templateUrl: './refer-a-worker.page.html',
  styleUrls: ['./refer-a-worker.page.scss'],
})
export class ReferAWorkerPage implements OnInit {

  remainingSteps: ReferralSteps = {has_profile_description: false, has_profile_photo: false, has_bank_account: false};

  constructor(
    private referralService: ReferralService,
    private changeRef: ChangeDetectorRef,
    private storage: Storage,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private utils: UtilsService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getSteps();
  }

  getSteps() {
    this.referralService.getStepsToReferWorkers().then(res => this.remainingSteps = res.steps);
  }

  shareReferral() {
    this.platform.ready().then(async () => {
      let username;
      await this.storage.get(StorageKeys.PROFILE)
        .then(profile => username = profile.user.username);

      await this.socialSharing.share(`${ORIGIN}/r/${username}`).then(() => {
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
      selBox.value = `${ORIGIN}/r/${profile.user.username}`;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.utils.presentToast('Copied to clipboard.', 'dark', 'bottom');
    });
  }

  async doRefresh(event?: any) {
    setTimeout(() => {
      this.referralService.getStepsToReferWorkers().then(res => this.remainingSteps = res.steps);
      this.changeRef.detectChanges();
      if (event) {
        if (event.target) {
          event.target.complete();
        }
      }
    }, 1000);
  }
}
