import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, RoutesRecognized} from '@angular/router';
import {SwUpdate} from '@angular/service-worker';

import {Config, IonRouterOutlet, MenuController, ModalController, Platform, ToastController} from '@ionic/angular';

import {Storage} from '@ionic/storage';
import {StorageKeys} from './providers/constants';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {TabsPage} from './layout/app-layout/pages/tabs-page/tabs-page';
import {SearchPage} from './layout/app-layout/pages/search/search.page';
import {CustomerTutorialPage} from './layout/app-layout/pages/customer-tutorial/customer-tutorial.page';
import {Subscription} from 'rxjs';

import {Capacitor, Device, Plugins, StatusBarStyle} from '@capacitor/core';
import {filter, pairwise} from 'rxjs/operators';
import {PreviousRouteService} from './providers/previous-route.service';

export function toggleDarkTheme(shouldAdd) {
  document.body.classList.toggle('dark', shouldAdd);
}

const {StatusBar, SplashScreen} = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ScreenOrientation, TabsPage, IonRouterOutlet, SearchPage, CustomerTutorialPage],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {

  statusBarAvailable = Capacitor.isPluginAvailable('StatusBar');
  splashScreenAvailable = Capacitor.isPluginAvailable('SplashScreen');

  profileId: number;
  profileImage: string;
  swUpdateSub: Subscription;
  previousRouteSub: Subscription;
  platformIsMobile: boolean = undefined;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
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
    if (this.splashScreenAvailable) {
      SplashScreen.hide();
    }

    Device.getInfo()
      .then(device => {
        console.log(device);
        this.platformIsMobile = device.operatingSystem === 'ios'
          || device.operatingSystem === 'android';

        return this.platformIsMobile;
      })
      .then((platformIsMobile: boolean) => {
        if (platformIsMobile) {
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

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
          this.router.navigate(['/app'])
            .then(() => {
              this.previousRouteSub = this.router.events
                .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
                .subscribe((events: RoutesRecognized[]) => {
                  this.previousRouteService.setCurrentUrl(window.location.pathname);
                });
            });
        } else {
          document.body.classList.add('web-body-layout');
        }
      });
  }
}
