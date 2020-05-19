import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  openSignUp() {
    this.navCtrl.navigateForward('/app/signup');
  }

  openLogin() {
    this.navCtrl.navigateForward('/app/login');
  }
}
