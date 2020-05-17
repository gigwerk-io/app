import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Storage} from '@ionic/storage';
import {StorageKeys} from '../../../providers/constants';
import {Router} from '@angular/router';

@Component({
  selector: 'favr-nav',
  templateUrl: './favr-nav.component.html',
  styleUrls: ['./favr-nav.component.scss']
})
export class FavrNavComponent implements OnInit {

  showDropdown = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  signOut() {
    this.authService.logout()
      .then(res => {
        if (res.success) {
          this.router.navigateByUrl('/login');
        }
      });
  }
}
