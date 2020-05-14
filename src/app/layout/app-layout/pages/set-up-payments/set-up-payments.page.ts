import {Component, OnDestroy, OnInit} from '@angular/core';
import { Stripe } from '@ionic-native/stripe/ngx';
import {STRIPE_PUBLIC} from '../../../../providers/constants';
import {FinanceService} from '../../../../utils/services/finance.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import { CreditCardValidator } from 'angular-cc-library';
import {Validators} from '@angular/forms';
import {MainMarketplaceTask} from '../../../../utils/interfaces/main-marketplace/main-marketplace-task';
import {MarketplaceService} from '../../../../utils/services/marketplace.service';
import {Router} from '@angular/router';
import {Events} from '../../../../utils/services/events';
import {UtilsService} from '../../../../utils/services/utils.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'set-up-payments',
  templateUrl: './set-up-payments.page.html',
  styleUrls: ['./set-up-payments.page.scss'],
})
export class SetUpPaymentsPage implements OnInit, OnDestroy {
  form: FormGroup;
  submitted = false;
  task: MainMarketplaceTask = undefined;

  constructor(private stripe: Stripe,
              private financeService: FinanceService,
              private alertController: AlertController,
              private marketplaceService: MarketplaceService,
              private router: Router,
              private fb: FormBuilder,
              private events: Events,
              private loadCtrl: LoadingController,
              private utils: UtilsService) {
    this.events.subscribe('task-request', (taskRequest) => {
      this.task = taskRequest;
    });
  }

  ngOnInit() {
    this.stripe.setPublishableKey(STRIPE_PUBLIC);
    this.form = this.fb.group({
      creditCard: ['', [CreditCardValidator.validateCCNumber as any]],
      expirationDate: ['', [CreditCardValidator.validateExpDate as any]],
      cvc: ['', [Validators.required as any, Validators.minLength(3) as any, Validators.maxLength(4) as any]]
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('task-request');
  }

  async onSubmit(form) {
    const loadingCtrl = await this.loadCtrl.create({
      message: 'Please Wait',
      translucent: true
    });

    await loadingCtrl.present();

    this.submitted = true;
    let date = this.form.get('expirationDate').value;
    date = date.split('/');
    const card = {
      number: this.form.get('creditCard').value,
      expMonth: (date[0] !== undefined) ? date[0].trim() : null,
      expYear: (date[1] !== undefined) ? date[1].trim() : null,
      cvc: this.form.get('cvc').value
    };

    if (this.form.valid) {
      this.stripe.createCardToken(card).then(token => {
        const body = {stripeToken: token.id};
        this.financeService.saveCreditCard(body).then(res => {
          if (this.task) {
            setTimeout(() => {
              this.marketplaceService.createMainMarketplaceRequest(this.task);
            }, 1000);
            this.router.navigateByUrl('app/tabs/marketplace');
            this.events.unsubscribe('task-request');
          } else {
            this.utils.presentToast(res.message, 'success');
          }
        });
      });
    }

    await loadingCtrl.dismiss();
  }

  async presentAlert() {
    await this.alertController.create({
      header: 'Missing Field(s)',
      message: 'Please fill out all form inputs.',
      buttons: ['OK']
    }).then(alert => alert.present());
  }
}
