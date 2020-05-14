import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ReferralService} from '../../../../utils/services/referral.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {UtilsService} from '../../../../utils/services/utils.service';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private referralService: ReferralService,
    private router: Router,
    private utils: UtilsService) {
  }

  ngOnInit() {
    this.getReferralProfile();
  }

  public getReferralProfile() {
    this.activatedRoute.params.toPromise().then(param => {
      this.referralService.getCustomerReferralProfile(param.username).then(res => {
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
      this.referralService.submitCustomerReferral(this.newReferral, this.username).then(res => {
        this.utils.presentToast(res.message, 'success');
        this.router.navigateByUrl('welcome');
      });
    }
  }
}
