import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import { MenuController, IonSlides } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import {AuthService} from '../../utils/services/auth.service';
import {StorageKeys} from '../../providers/constants';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  styleUrls: ['./tutorial.scss'],
})
export class TutorialPage implements OnInit, OnDestroy {
  showSkip = true;

  @ViewChild('slides', { static: true }) slides: IonSlides;

  constructor(
    public menu: MenuController,
    public  authService: AuthService,
    public router: Router,
    public storage: Storage
  ) {}

  startApp() {
    this.authService.isLoggedIn().toPromise().then(loggedIn => {
      if (loggedIn) {
        this.router
          .navigateByUrl('/app/tabs/marketplace')
          .then(() => this.storage.set(StorageKeys.PLATFORM_TUTORIAL, true));
      } else {
        this.router
          .navigateByUrl('/welcome')
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
            this.router.navigateByUrl('/app/tabs/marketplace');
          } else {
            this.router.navigateByUrl('/welcome');
          }
        });
      }
    });
  }

  ngOnDestroy() {
  }
}
