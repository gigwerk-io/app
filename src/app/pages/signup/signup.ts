import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserRegistrationOptions} from '../../utils/interfaces/user-options';
import {AuthService} from '../../utils/services/auth.service';
import {IonContent, IonSlides, Platform, ToastController} from '@ionic/angular';
import {setProgress} from '../request/request.page';
import {Push, PushObject, PushOptions} from '@ionic-native/push/ngx';
import {NotificationService} from '../../utils/services/notification.service';
import {PreferencesService} from '../../utils/services/preferences.service';
import {City} from '../../utils/interfaces/locations/city';
import {Router} from '@angular/router';
import {FavrDataService} from '../../utils/services/favr-data.service';
import {PhonePipe} from '../../utils/pipes/phone.pipe';
import {
  Plugins,
  Capacitor, PushNotificationToken
} from '@capacitor/core';
import {SwPush} from '@angular/service-worker';

const {PushNotifications, Device} = Plugins;
import {environment} from '../../../environments/environment';
import {UtilsService} from '../../utils/services/utils.service';

export interface PageStack {
  pageTitle: string;
  page: string;
}

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss']
})
export class SignupPage {

  @ViewChild(IonSlides, {static: false}) slides: IonSlides;
  @ViewChild(IonContent, {static: false}) content: IonContent;

  pushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
  signup: UserRegistrationOptions = {
    first_name: undefined,
    last_name: undefined,
    username: undefined,
    email: undefined,
    phone: undefined,
    birthday: undefined,
    password: undefined,
    confirm_password: undefined,
    freelancer: false,
    city_id: undefined,
    street_address: undefined,
    city: undefined,
    state: undefined,
    zip: undefined
  };
  submitted = false;
  maxYear = (new Date()).getFullYear() - 13;
  cities: City[];
  progress = 0;

  pageTitle = 'Sign Up';
  subPageTitle = 'Sign Up';
  subPage = 'signup-index';
  backPage: string;
  pageStack: PageStack[] = [
    {
      pageTitle: 'Sign Up',
      page: 'signup-index'
    }
  ];

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private push: Push,
    private notificationService: NotificationService,
    private platform: Platform,
    private preferencesService: PreferencesService,
    private router: Router,
    private favrService: FavrDataService,
    private phonePipe: PhonePipe,
    private swPush: SwPush,
    private utils: UtilsService
  ) {
    this.favrService.getCities().then(res => {
      this.cities = res.cities;
    });
  }

  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.authService.register(this.signup)
        .then(() => {
          this.authService.login({username: this.signup.username, password: this.signup.password}).then(() => {
            this.router.navigateByUrl('/app/tabs/marketplace').then(() => {
              this.initPushNotification();
            });
          });
        })
        .catch(error => {
          this.utils.presentToast(error.error.message, 'danger');
        });
    }
  }

  updateProgress() {
    this.signup.phone = (this.signup.phone) ? this.phonePipe.transform(this.signup.phone) : undefined;
    this.progress = setProgress([
      this.signup.first_name,
      this.signup.last_name,
      this.signup.email,
      this.signup.username,
      this.signup.password,
      this.signup.confirm_password,
      this.signup.phone,
      this.signup.city_id
    ]);
  }

  selectCity(city: City) {
    this.signup.city_id = city.id;
    this.updateProgress();
    setTimeout(() => this.openSubPage('signup-index'), 600);
  }

  initPushNotification() {
    if (this.pushNotificationsAvailable) {
      PushNotifications.requestPermission().then(permission => {
        if (permission.granted) {
          PushNotifications.register();
        }
      });

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration', (token: PushNotificationToken) => {
        Device.getInfo().then(info => {
          if (info.operatingSystem === 'ios') {
            this.notificationService.saveAPNToken({device_token: token.value});
          } else {
            this.notificationService.saveFCMToken({device_token: token.value});
          }
        });
      });

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
        (notification) => {
          console.log(notification);
        }
      );

    } else {
      this.swPush.requestSubscription({
        serverPublicKey: environment.publicKey
      }).then(token => {
        console.log(token);
        this.notificationService.saveFCMToken({device_token: token});
      }).catch(err => console.error('Could not register notifications', err));

    }
  }

  navigateBack() {
    this.pageStack.pop(); // remove current page
    const prevPage = this.pageStack[this.pageStack.length - 1];
    this.backPage = prevPage.page;
    this.subPage = prevPage.page;
    this.subPageTitle = prevPage.pageTitle;
  }

  openSubPage(page: string) {
    switch (page) {
      case 'signup-index':
        this.subPageTitle = 'Sign Up';
        break;
      case 'personal-info':
        this.subPageTitle = 'Personal Information';
        break;
      case 'set-up-password':
        this.subPageTitle = 'Set Up Password';
        break;
      case 'select-city':
        this.subPageTitle = 'Select City';
        break;
    }
    this.pageStack.push({pageTitle: this.subPageTitle, page});
    this.subPage = page;
    this.backPage = this.pageStack[this.pageStack.length - 2].page;
  }
}
