import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Role, StorageKeys} from '../../providers/constants';
import {Profile} from '../../utils/interfaces/user';
import {Events} from '../../utils/services/events';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-web-layout',
  templateUrl: './web-layout.component.html',
  styleUrls: ['./web-layout.component.scss'],
})
export class WebLayoutComponent {
}
