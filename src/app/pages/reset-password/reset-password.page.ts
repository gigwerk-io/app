import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {SecurityService} from '../../utils/services/security.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  old_password;
  new_password;
  confirm_password;
  constructor(private securityService: SecurityService,
              private toastController: ToastController) { }

  ngOnInit() {
  }

  updatePassword(form: NgForm) {
    if (form.valid) {
      if (this.new_password === this.confirm_password) {
        const body = {
          old_password: this.old_password,
          new_password: this.new_password
        };
        this.securityService.updatePassword(body).subscribe(res => {
          this.presentToast(res.message);
        }, error => {
          this.presentToast(error.error.message, 'danger');
        });
      } else {
        this.presentToast('Passwords do not match!', 'danger');
      }
    }
  }

  async presentToast(message, color = 'dark') {
    await this.toastController.create({
      message: message,
      position: 'top',
      duration: 2500,
      color: color,
      showCloseButton: true
    }).then(toast => {
      toast.present();
    });
  }
}
