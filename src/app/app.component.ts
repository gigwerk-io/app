import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, RoutesRecognized} from '@angular/router';
import {SwUpdate} from '@angular/service-worker';

import {Config, IonRouterOutlet, MenuController, ModalController, Platform, ToastController} from '@ionic/angular';

import {Storage} from '@ionic/storage';
import {StorageKeys} from './providers/constants';
import {toggleDarkTheme} from './layout/app-layout/pages/settings/settings.page';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {TabsPage} from './layout/app-layout/pages/tabs-page/tabs-page';
import {SearchPage} from './layout/app-layout/pages/search/search.page';
import {CustomerTutorialPage} from './layout/app-layout/pages/customer-tutorial/customer-tutorial.page';
import {Subscription} from 'rxjs';

import {
  Capacitor,
  Device,
  Plugins,
  StatusBarStyle
} from '@capacitor/core';
import {filter, pairwise} from 'rxjs/operators';
import {PreviousRouteService} from './providers/previous-route.service';

const {StatusBar, SplashScreen} = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ScreenOrientation, TabsPage, IonRouterOutlet, SearchPage, CustomerTutorialPage],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  profileId: number;
  profileImage: string;
  swUpdateSub: Subscription;
  statusBarAvailable = Capacitor.isPluginAvailable('StatusBar');
  splashScreenAvailable = Capacitor.isPluginAvailable('SplashScreen');
  previousRouteSub: Subscription;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    public router: Router,
    private storage: Storage,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private screenOrientation: ScreenOrientation,
    private modalCtrl: ModalController,
    private config: Config,
    private previousRouteService: PreviousRouteService
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    if (this.platform.is('desktop')) {
      this.config.set('navAnimation', null);
      this.config.set('animated', false);
    }

    this.storage.get(StorageKeys.PROFILE)
      .then(profile => {
        if (profile) {
          this.profileId = profile.user_id;
          this.profileImage = profile.image;
        }
      });
    this.swUpdateSub = this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            text: 'Reload',
            role: 'cancel',
            handler: () => {
              this.initializeApp();
            }
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
  }

  ngOnDestroy() {
    this.swUpdateSub.unsubscribe();
    this.previousRouteSub.unsubscribe();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      Device.getInfo()
        .then(device => {
          console.log(device);
          if (device.operatingSystem === 'ios'
              || device.operatingSystem === 'android') {
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
            if (this.splashScreenAvailable) {
              SplashScreen.hide();
            }
          }
        });
      this.storage.get(StorageKeys.THEME_PREFERENCE)
        .then((prefersDark: boolean) => {
          if (prefersDark == null) {
            if (this.statusBarAvailable) {
              StatusBar.setStyle({style: StatusBarStyle.Light});
            }
            this.storage.set(StorageKeys.THEME_PREFERENCE, false)
              .then(() => toggleDarkTheme(false));
          } else {
            if (prefersDark) {
              if (this.statusBarAvailable) {
                StatusBar.setStyle({style: StatusBarStyle.Dark});
              }
              toggleDarkTheme(prefersDark);
            } else {
              if (this.statusBarAvailable) {
                StatusBar.setStyle({style: StatusBarStyle.Light});
              }
              toggleDarkTheme(false);
            }
          }
        });

      this.previousRouteSub = this.router.events
        .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
        .subscribe((events: RoutesRecognized[]) => {
          // console.log('previous url', events[0].urlAfterRedirects);
          // console.log('current url', events[1].urlAfterRedirects);
          this.previousRouteService.setPreviousUrl(events[0].urlAfterRedirects);
          this.previousRouteService.setCurrentUrl(events[1].urlAfterRedirects);
        });
    });
  }

  async openSearchModal() {
    const modal = await this.modalCtrl.create({
      component: SearchPage,
      componentProps: {isModal: true},
      cssClass: 'transparent-modal',
      // enterAnimation: (this.platform.is('mobile') || this.platform.is('pwa')) ? popInAnimation : undefined,
      // leaveAnimation: (this.platform.is('mobile') || this.platform.is('pwa')) ? popOutAnimation : undefined
    });

    await modal.present();
  }
}
