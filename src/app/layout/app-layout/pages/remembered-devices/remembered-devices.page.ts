import { Component, OnInit } from '@angular/core';
import {SecurityService} from '../../../../utils/services/security.service';
import {Sessions, SessionResponse} from '../../../../utils/interfaces/auth/sessions';
import {ToastController} from '@ionic/angular';
import {UtilsService} from '../../../../utils/services/utils.service';
import { Response } from '../../../../utils/interfaces/response';

@Component({
  selector: 'remembered-devices',
  templateUrl: './remembered-devices.page.html',
  styleUrls: ['./remembered-devices.page.scss'],
})
export class RememberedDevicesPage implements OnInit {

  sessions: SessionResponse;

  constructor(
    private securityService: SecurityService,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    this.getSessions();
  }

  getSessions() {
    this.securityService.getSessions().then((devices: Response<SessionResponse>) => this.sessions = devices.data);
  }

  killAll() {
    this.securityService.killAll().then(res => {
      this.utils.presentToast('<strong>Success!</strong> all other sessions destroyed.', 'success');
      this.getSessions();
    });
  }
}
