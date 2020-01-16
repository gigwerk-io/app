import { Component, OnInit } from '@angular/core';
import {ReferralService} from '../../utils/services/referral.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReferralProfile} from '../../utils/interfaces/referrals/ReferralProfile';
import {ToastController} from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'referral',
  templateUrl: './referral.page.html',
  styleUrls: ['./referral.page.scss'],
})
export class ReferralPage implements OnInit {
  name;
  location;
  image;
  newReferral = {
    email: undefined
  };
  submitted = false;
  username;

  constructor(private activatedRoute: ActivatedRoute,
              private referralService: ReferralService,
              private router: Router,
              private toastController: ToastController) {}

  ngOnInit() {
    this.getReferralProfile();
  }

  public getReferralProfile() {
    this.activatedRoute.params.subscribe(param => {
      this.referralService.getReferralProfile(param.username).subscribe(res => {
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

  async presentToast(message) {
    await this.toastController.create({
      message: message,
      position: 'top',
      duration: 2500,
      color: 'dark',
      showCloseButton: true
    }).then(toast => toast.present());
  }

  public submitReferral(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.referralService.submitWorkerReferral(this.newReferral, this.username).subscribe(res => {
        this.presentToast(res.message);
        this.router.navigateByUrl('welcome');
      });
    }
  }
}
