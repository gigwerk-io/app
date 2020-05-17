import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../../../../utils/services/auth.service';
import {UserOptions} from '../../../../utils/interfaces/user-options';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  signInForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.warn(this.signInForm.value);
    if (this.signInForm.valid) {
      if (this.signInForm.value.username.includes('@')) { // user inputed an email address instead
        const userOption: UserOptions = {
          email: this.signInForm.value.username,
          password: this.signInForm.value.password
        };
        this.authService.login(userOption);
      } else {
        this.authService.login(this.signInForm.value);
      }
    }
  }
}
