import {Component, OnInit} from '@angular/core';
import {ReferralService} from '../../../../utils/services/referral.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReferralProfile} from '../../../../utils/interfaces/referrals/ReferralProfile';
import {ToastController} from '@ionic/angular';
import {NgForm} from '@angular/forms';
import {UtilsService} from '../../../../utils/services/utils.service';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private referralService: ReferralService,
    private router: Router,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    this.getReferralProfile();
  }

  public getReferralProfile() {
    this.activatedRoute.params.toPromise().then(param => {
      this.referralService.getReferralProfile(param.username).then(res => {
        this.name = res.data.name;
        this.location = res.data.city.city + ', ' + res.data.city.state;
        this.image = res.data.profile.image;
        this.username = res.data.username;
      }).catch(error => {
        if (error.status === 400) {
          this.utils.presentToast(error.error.message, 'danger');
          this.router.navigateByUrl('welcome');
        }
      });
    });
  }

  public submitReferral(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.referralService.submitWorkerReferral(this.newReferral, this.username).then(res => {
        this.utils.presentToast(res.message, 'success');
        this.router.navigateByUrl('welcome');
      }).catch(error => this.utils.presentToast(error.message, 'danger'));
    }
  }
}
