import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {SwUpdate} from '@angular/service-worker';

import {Config, IonRouterOutlet, MenuController, ModalController, Platform, ToastController} from '@ionic/angular';

import {Storage} from '@ionic/storage';
import {StorageKeys} from './providers/constants';
import {toggleDarkTheme} from './pages/settings/settings.page';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {TabsPage} from './pages/tabs-page/tabs-page';
import {SearchPage} from './pages/search/search.page';
import {CustomerTutorialPage} from './pages/customer-tutorial/customer-tutorial.page';
import {Subscription} from 'rxjs';

import {
  Plugins,
  StatusBarStyle,
  Capacitor
} from '@capacitor/core';

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

  constructor(
    private menu: MenuController,
    private platform: Platform,
    public router: Router,
    private storage: Storage,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private screenOrientation: ScreenOrientation,
    public tabsPage: TabsPage,
    private modalCtrl: ModalController,
    private config: Config
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
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.splashScreenAvailable) {
        SplashScreen.hide();
      }
      this.storage.get(StorageKeys.THEME_PREFERENCE)
        .then((prefersDark: boolean) => {
          if (prefersDark == null) {
            if (this.statusBarAvailable) {
              StatusBar.setStyle({style: StatusBarStyle.Dark});
            }
            this.storage.set(StorageKeys.THEME_PREFERENCE, true)
              .then(() => toggleDarkTheme(true));
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

      if (this.platform.is('cordova')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }
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
