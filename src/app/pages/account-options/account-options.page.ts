import { Component, OnInit } from '@angular/core';
import {SecurityService} from '../../utils/services/security.service';
import {AlertController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';

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
              private toastController: ToastController) { }

  ngOnInit() {
  }
  async deactivateAccount() {
    const alert = await this.alertController.create({
      header: 'Account Deactivation',
      message: 'Are you sure you want to deactivate your account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Yes',
          handler: () => {
            this.securityService.deactivateAccount().subscribe(res => {
              this.storage.clear();
              this.presentToast(res.message);
              this.router.navigateByUrl('welcome');
            });
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
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.securityService.deleteAccount().subscribe(res => {
              this.storage.clear();
              this.presentToast(res.message);
              this.router.navigateByUrl('welcome');
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message) {
    await this.toastController.create({
      message: message,
      position: 'top',
      duration: 2500,
      color: 'dark',
      showCloseButton: true
    }).then(toast => {
      toast.present();
    });
  }
}
