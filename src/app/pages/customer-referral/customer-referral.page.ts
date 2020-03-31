import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {ReferralService} from '../../utils/services/referral.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'customer-referral',
  templateUrl: './customer-referral.page.html',
  styleUrls: ['./customer-referral.page.scss'],
})
export class CustomerReferralPage implements OnInit {
  name;
  location;
  image;
  username;
  newReferral = {
    email: undefined
  };
  submitted = false;
  constructor(private activatedRoute: ActivatedRoute,
              private referralService: ReferralService,
              private router: Router,
              private toastController: ToastController) { }

  ngOnInit() {
    this.getReferralProfile();
  }

  async presentToast(message) {
    await this.toastController.create({
      message,
      position: 'top',
      duration: 2500,
      color: 'dark',
      buttons: [
        {
          text: 'Done',
          role: 'cancel'
        }
      ]
    }).then(toast => toast.present());
  }

  public getReferralProfile() {
    this.activatedRoute.params.toPromise().then(param => {
      this.referralService.getCustomerReferralProfile(param.username).then(res => {
        this.name = res.data.name;
        this.location = res.data.city.city + ', ' + res.data.city.state;
        this.image = res.data.profile.image;
        this.username = res.data.username;
      }, error => {
        if (error.status === 400) {
          this.presentToast(error.error.message);
          this.router.navigateByUrl('welcome');
        }
      });
    });
  }

  public submitReferral(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.referralService.submitCustomerReferral(this.newReferral, this.username).then(res => {
        this.presentToast(res.message);
        this.router.navigateByUrl('welcome');
      });
    }
  }
}
