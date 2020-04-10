import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {IonSlides, NavController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {AuthService} from '../../utils/services/auth.service';
import {StorageKeys} from '../../providers/constants';
import {Subscription} from 'rxjs';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  styleUrls: ['./tutorial.scss'],
})
export class TutorialPage implements OnInit {
  showSkip = true;

  @ViewChild('slides', { static: true }) slides: IonSlides;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private router: Router,
    private storage: Storage
  ) {}

  startApp() {
    this.authService.isLoggedIn().toPromise().then(loggedIn => {
      if (loggedIn) {
        this.navCtrl.navigateRoot('/app/tabs/marketplace')
          .then(() => this.storage.set(StorageKeys.PLATFORM_TUTORIAL, true));
      } else {
        this.navCtrl.navigateRoot('/welcome')
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
        this.authService.isLoggedIn().toPromise().then(loggedIn => {
          if (loggedIn) {
            this.navCtrl.navigateRoot('/app/tabs/marketplace');
          } else {
            this.navCtrl.navigateRoot('/welcome');
          }
        });
      }
    });
  }
}
