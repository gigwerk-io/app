import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';

import {UserOptions} from '../../../../utils/interfaces/user-options';
import {AuthService} from '../../../../utils/services/auth.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  login: UserOptions = {
    username: undefined,
    password: undefined
  };
  submitted = false;

  constructor(
    private authService: AuthService,
    public navCtrl: NavController
  ) {  }

  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.authService.login(this.login);
    }
  }
}
