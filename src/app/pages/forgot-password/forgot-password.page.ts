import { Component, OnInit } from '@angular/core';
import {ToastController} from '@ionic/angular';
import {AuthService} from '../../utils/services/auth.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  email;
  submitted = false;
  constructor(private toastController: ToastController,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  submitEmail(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.authService.forgotPassword(this.email).subscribe(res => {
        this.presentToast(res.message).then(() => {
          this.router.navigateByUrl('login');
        });
      }, error => {
        if (error.status === 422) {
          this.presentToast(error.error.email[0], 'danger');
        } else {
          this.presentToast(error.error.message, 'danger');
        }
      });
    }
  }

  async presentToast(message, color = 'dark') {
    await this.toastController.create({
      message: message,
      position: 'top',
      duration: 3000,
      color: color,
      showCloseButton: true
    }).then(toast => {
      toast.present();
    });
  }
}
