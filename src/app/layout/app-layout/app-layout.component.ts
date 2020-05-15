import { Component, OnInit } from '@angular/core';
import {Capacitor, Device, Plugins, StatusBarStyle} from '@capacitor/core';
import {StorageKeys} from '../../providers/constants';
import {Platform} from '@ionic/angular';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {Storage} from '@ionic/storage';
import {toggleDarkTheme} from '../../app.component';

const {StatusBar, SplashScreen} = Plugins;

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent implements OnInit {

  statusBarAvailable = Capacitor.isPluginAvailable('StatusBar');
  splashScreenAvailable = Capacitor.isPluginAvailable('SplashScreen');

  constructor(
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.initializeApp();
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

      Device.getInfo()
        .then(device => {
          if (device.operatingSystem === 'ios'
            || device.operatingSystem === 'android') {
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
          }
        });
    });
  }

}
