import { Component, OnInit } from '@angular/core';
import {SecurityService} from '../../utils/services/security.service';
import {Sessions} from '../../utils/interfaces/auth/sessions';
import {ToastController} from '@ionic/angular';
import {UtilsService} from '../../utils/services/utils.service';

@Component({
  selector: 'remembered-devices',
  templateUrl: './remembered-devices.page.html',
  styleUrls: ['./remembered-devices.page.scss'],
})
export class RememberedDevicesPage implements OnInit {

  sessions: Sessions[];

  constructor(
    private securityService: SecurityService,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    this.getSessions();
  }

  getSessions() {
    this.securityService.getSessions().then(res => this.sessions = res.sessions);
  }

  killAll() {
    this.securityService.killAll().then(res => {
      this.utils.presentToast('<strong>Success!</strong> all other sessions destroyed.', 'success');
      this.getSessions();
    });
  }
}
