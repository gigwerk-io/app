import { Component, OnInit } from '@angular/core';
import {SecurityService} from '../../utils/services/security.service';
import {AlertController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {UtilsService} from '../../utils/services/utils.service';

@Component({
  selector: 'account-options',
  templateUrl: './account-options.page.html',
  styleUrls: ['./account-options.page.scss'],
})
export class AccountOptionsPage implements OnInit {

  constructor(private securityService: SecurityService,
              private alertController: AlertController,
              private storage: Storage,
              private router: Router,
              private utils: UtilsService) { }

  ngOnInit() {
  }

  async deactivateAccount() {
    const alert = await this.alertController.create({
      header: 'Account Deactivation',
      message: 'Are you sure you want to deactivate your account?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: () => {
            this.securityService.deactivateAccount().then(() => {
              this.storage.clear();
              this.utils.presentToast('<strong>Success!</strong> Account is now deactivated. You can reactivate your account by returning within 50 days otherwise you will need to register a new account.', 'success');
              this.router.navigateByUrl('welcome');
            }).catch(error => this.utils.presentToast(error.message, 'danger'));
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: 'This is an irreversible action!!!',
      message: 'Are you sure you want to delete your account?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: () => {
            this.securityService.deleteAccount().then(() => {
              this.storage.clear();
              this.utils.presentToast('<strong>Success!</strong> Your account has been deleted.', 'success');
              this.router.navigateByUrl('welcome');
            }).catch(error => this.utils.presentToast(error.message, 'danger'));
          }
        }
      ]
    });

    await alert.present();
  }
}
