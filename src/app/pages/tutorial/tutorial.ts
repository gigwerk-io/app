import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router, RoutesRecognized} from '@angular/router';

import {IonSlides, NavController} from '@ionic/angular';

import { Storage } from '@ionic/storage';
import {AuthService} from '../../utils/services/auth.service';
import {StorageKeys} from '../../providers/constants';
import {Subscription} from 'rxjs';
import {filter, pairwise} from 'rxjs/operators';
import {PreviousRouteService} from '../../providers/previous-route.service';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  styleUrls: ['./tutorial.scss'],
})
export class TutorialPage implements OnInit, OnDestroy {
  showSkip = true;

  @ViewChild('slides', { static: true }) slides: IonSlides;
  private authServiceSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private router: Router,
    private storage: Storage,
  ) {  }

  startApp() {
    this.authServiceSub = this.authService.isLoggedIn().subscribe(loggedIn => {
      if (loggedIn) {
        this.navCtrl.navigateRoot('/app/tabs/marketplace')
          .then(() => this.storage.set(StorageKeys.PLATFORM_TUTORIAL, true));
      } else {
        this.navCtrl.navigateRoot('/app/welcome')
          .then(() => this.storage.set(StorageKeys.PLATFORM_TUTORIAL, true));
      }
    });
  }

  onSlideChangeStart(event) {
    event.target.isEnd().then(isEnd => {
      this.showSkip = !isEnd;
    });
  }

  ngOnInit() {
    this.storage.get(StorageKeys.PLATFORM_TUTORIAL).then(res => {
      if (res === true) {
        this.authServiceSub = this.authService.isLoggedIn().subscribe(loggedIn => {
          if (loggedIn) {
            this.navCtrl.navigateRoot('/app/tabs/marketplace');
          } else {
            this.navCtrl.navigateRoot('/app/welcome');
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.authServiceSub.unsubscribe();
  }
}
