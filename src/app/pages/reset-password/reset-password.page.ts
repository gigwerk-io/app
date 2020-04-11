import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {SecurityService} from '../../utils/services/security.service';
import {ToastController} from '@ionic/angular';
import {UtilsService} from '../../utils/services/utils.service';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  oldPassword;
  newPassword;
  confirmPassword;

  constructor(
    private securityService: SecurityService,
    private utils: UtilsService
  ) { }

  ngOnInit() {
  }

  updatePassword(form: NgForm) {
    if (form.valid) {
      if (this.newPassword === this.confirmPassword) {
        const body = {
          old_password: this.oldPassword,
          new_password: this.newPassword
        };
        this.securityService.updatePassword(body).then(res => {
         this.utils.presentToast('<strong>Success!</strong> Your password has been reset.', 'success');
        }).catch(error => {
         this.utils.presentToast(error.error.message, 'danger');
        });
      } else {
       this.utils.presentToast('Passwords do not match!', 'danger');
      }
    }
  }
}
