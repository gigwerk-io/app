import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from '../../utils/services/auth.service';
import {Storage} from '@ionic/storage';
import {Role, StorageKeys} from '../../providers/constants';
import {AuthorizationToken} from '../../utils/interfaces/user-options';
import {ActionSheetController, IonRouterOutlet, NavController, Platform} from '@ionic/angular';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {environment} from '../../../environments/environment';

import {
  Plugins,
  StatusBarStyle,
  Capacitor
} from '@capacitor/core';

const {StatusBar} = Plugins;

@Component({
  selector: 'settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  providers: [IonRouterOutlet]
})
export class SettingsPage implements OnInit {

  seeCredit: boolean;
  darkMode = true;
  isFreelancer: boolean;
  COPY_YEAR = (new Date()).getFullYear();
  VERSION = environment.version;
  statusBarAvailable = Capacitor.isPluginAvailable('StatusBar');

  constructor(private authService: AuthService,
              private storage: Storage,
              private  navCtrl: NavController,
              private platform: Platform,
              private iab: InAppBrowser,
              private changeRef: ChangeDetectorRef,
              private actionSheetController: ActionSheetController,
              public routerOutlet: IonRouterOutlet) {}

  ngOnInit() {
    this.storage.get(StorageKeys.THEME_PREFERENCE)
      .then((prefersDark: boolean) => {
        this.darkMode = prefersDark;
        this.changeRef.detectChanges();
      });

    this.storage.get(StorageKeys.PROFILE).then(profile => {
      this.seeCredit = profile.user.organization_id === null;
      if (profile.user.role === Role.VERIFIED_FREELANCER) {
        this.isFreelancer = true;
      }
    });
  }

  onLogout() {
    this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => {
        const authHeaders: AuthorizationToken = {
          headers: {
            Authorization: token
          }
        };
        this.authService.logout(authHeaders)
          .then(res => {
            this.storage.remove(StorageKeys.ACCESS_TOKEN);
            this.storage.remove(StorageKeys.PROFILE);
            this.storage.clear();
            this.navCtrl.navigateRoot('/welcome');
          })
          .catch(error => {
            this.storage.remove(StorageKeys.ACCESS_TOKEN);
            this.storage.remove(StorageKeys.PROFILE);
          });
      });
  }

  openTerms() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const browser = this.iab.create('https://app.termly.io/document/terms-of-use-for-online-marketplace/ccc0e79c-9dbe-4198-9203-95382505f3d6');
      browser.show();
    } else {
      window.open('https://app.termly.io/document/terms-of-use-for-online-marketplace/ccc0e79c-9dbe-4198-9203-95382505f3d6');
    }
  }

  openPrivacy() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const browser = this.iab.create('https://app.termly.io/document/privacy-policy/f48f5cbe-6359-43b5-804f-4d8b82429fe6');
      browser.show();
    } else {
      window.open('https://app.termly.io/document/privacy-policy/f48f5cbe-6359-43b5-804f-4d8b82429fe6');
    }
  }

  async inviteFriends() {
    const message = 'Get $10 off your first FAVR job when you use my signup link!';
    const url = 'https://askfavr.com/10off/';
    const buttons = [
      {
        text: 'Share via Facebook',
        icon: 'logo-facebook',
        handler: () => {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
        }
      },  {
        text: 'Share via Text',
        icon: 'text',
        handler: () => {
          window.open(`sms://?&body=${message + ' ' + url}`);
        }
      }, {
        text: 'Share via Twitter',
        icon: 'logo-twitter',
        handler: () => {
          window.open(`https://twitter.com/intent/tweet?url=${url}&text=${message + ' ' + url}`);
        }
      }, {
        text: 'Share via Email',
        icon: 'mail',
        handler: () => {
          window.open(`mailto:?&subject=${'Invitation To FAVR!'}&body=${message + ' ' + url}`);
        }
      }, {
        text: 'Close',
        role: 'cancel',
        handler: () => {
        }
      }];
    if (!this.platform.is('mobile')) {
      buttons.splice(1, 1); // remove text option if not mobile
    }
    const actionSheet = await this.actionSheetController.create({
      header: 'Earn $5 For Each Friend You Invite To FAVR!',
      buttons
    });
    await actionSheet.present();
  }

  setDarkMode() {
    switch (this.darkMode) {
      case true:
        if (this.statusBarAvailable) {
          StatusBar.setBackgroundColor({color: '#222428'});
        }
        break;
      case false:
        if (this.statusBarAvailable) {
          StatusBar.setBackgroundColor({color: '#fff'});
        }
        break;
    }
    this.storage.set(StorageKeys.THEME_PREFERENCE, this.darkMode)
      .then(() => toggleDarkTheme(this.darkMode));
  }
}

export function toggleDarkTheme(shouldAdd) {
  document.body.classList.toggle('dark', shouldAdd);
}
