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
export class WebLayoutComponent implements OnInit, OnDestroy {

  navType: string;
  Role = Role;
  selected = '';
  selectedClass = 'ml-8 inline-flex items-center px-1 pt-1 border-b-2 border-red-500 text-sm font-medium leading-5 text-gray-900 focus:outline-none focus:border-red-700 transition duration-150 ease-in-out';
  idleClass = 'ml-8 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out';

  constructor(
    private storage: Storage,
    private events: Events,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.storage.get(StorageKeys.PROFILE)
      .then((prof: Profile) => {
        this.navType = prof.user.role;
      });
    this.events.subscribe('currentPageUrl', (url: string) => {
      this.selected = url;
      this.changeRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.events.unsubscribe('currentPageUrl');
  }
}
