import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import {Config, Events, MenuController, ModalController, Platform, ToastController} from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Storage } from '@ionic/storage';

import { UserData } from './providers/user-data';
import {StorageKeys} from './providers/constants';
import {toggleDarkTheme} from './pages/settings/settings.page';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import {TabsPage} from './pages/tabs-page/tabs-page';
import {RequestPage} from './pages/request/request.page';
import {SearchPage} from './pages/search/search.page';
import {popInAnimation} from './utils/animations/enter.animation';
import {popOutAnimation} from './utils/animations/leave.animation';
import {CustomerTutorialPage} from './pages/customer-tutorial/customer-tutorial.page';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ScreenOrientation, TabsPage, RequestPage, SearchPage, CustomerTutorialPage],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  profileId: number;
  profileImage: string;

  constructor(
    private events: Events,
    private menu: MenuController,
    private platform: Platform,
    public router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private userData: UserData,
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
    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        showCloseButton: true,
        position: 'bottom',
        closeButtonText: `Reload`
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.splashScreen.hide();
      this.storage.get(StorageKeys.THEME_PREFERENCE)
        .then((prefersDark: boolean) => {
          if (prefersDark == null) {
            this.statusBar.backgroundColorByHexString('#222428');
            this.storage.set(StorageKeys.THEME_PREFERENCE, true)
              .then(() => toggleDarkTheme(true));
          } else {
            if (prefersDark) {
              this.statusBar.backgroundColorByHexString('#222428');
              toggleDarkTheme(prefersDark);
            } else {
              this.statusBar.backgroundColorByHexString('#ff6500');
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
      componentProps: {'isModal': true},
      cssClass: 'transparent-modal',
      enterAnimation: (this.platform.is('mobile') || this.platform.is('pwa')) ? popInAnimation : undefined,
      leaveAnimation: (this.platform.is('mobile') || this.platform.is('pwa')) ? popOutAnimation : undefined
    });

    modal.present();
  }
}
