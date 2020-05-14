import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../utils/services/auth.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {UtilsService} from '../../../../utils/services/utils.service';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  email;
  submitted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private utils: UtilsService
  ) {
  }

  ngOnInit() {
  }

  submitEmail(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.authService.forgotPassword(this.email).then(res => {
        this.utils.presentToast(res.message).then(() => {
          this.router.navigateByUrl('login');
        });
      }).catch(error => {
        if (error.status === 422) {
          this.utils.presentToast(error.error.email[0], 'danger');
        } else {
          this.utils.presentToast(error.error.message, 'danger');
        }
      });
    }
  }
}
