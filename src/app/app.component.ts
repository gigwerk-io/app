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

import {Device} from '@capacitor/core';
import {filter, pairwise} from 'rxjs/operators';
import {PreviousRouteService} from './providers/previous-route.service';

export function toggleDarkTheme(shouldAdd) {
  document.body.classList.toggle('dark', shouldAdd);
}

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
    Device.getInfo()
      .then(device => {
        console.log(device);
        this.platformIsMobile = device.operatingSystem === 'ios'
          || device.operatingSystem === 'android';

        this.previousRouteSub = this.router.events
          .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
          .subscribe((events: RoutesRecognized[]) => {
            // console.log('previous url', events[0].urlAfterRedirects);
            // console.log('current url', events[1].urlAfterRedirects);
            this.previousRouteService.setPreviousUrl(events[0].urlAfterRedirects);
            this.previousRouteService.setCurrentUrl(events[1].urlAfterRedirects);
          });

        return this.platformIsMobile;
      })
      .then((platformIsMobile: boolean) => {
        if (platformIsMobile) {
          this.router.navigate(['/app']);
        } else {
          this.router.navigate(['/web']);
        }
      });
  }
}
