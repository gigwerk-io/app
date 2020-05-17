import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Storage} from '@ionic/storage';
import {StorageKeys} from '../../../providers/constants';

@Component({
  selector: 'favr-nav',
  templateUrl: './favr-nav.component.html',
  styleUrls: ['./favr-nav.component.scss']
})
export class FavrNavComponent implements OnInit {

  showDropdown = false;

  constructor(
    private authService: AuthService,
    private storage: Storage
  ) { }

  ngOnInit(): void {
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  signOut() {
    // this.authService.logout();
  }
}
