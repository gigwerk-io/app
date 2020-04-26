import {HttpClient} from '@angular/common/http';
import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {PUSHER_ID, StorageKeys} from './constants';
import {Storage} from '@ionic/storage';
import Pusher, {Channel} from 'pusher-js';
import {environment} from '../../environments/environment';
import {UtilsService} from '../utils/services/utils.service';
import {Router} from '@angular/router';

@Injectable()
export class PusherServiceProvider implements OnInit, OnDestroy {
  channel: any;

  constructor(public http: HttpClient, private storage: Storage, private utils: UtilsService, private router: Router) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.channel.unsubscribe();
  }

  /**
   * Listen to a users notifications on a private channel.
   */
  public async listenToUserNotifications(id): Promise<Channel> {
    return await this.storage.get(StorageKeys.ACCESS_TOKEN).then(token => {
      const pusher = new Pusher(PUSHER_ID, {
        cluster: 'us2',
        forceTLS: true,
        authEndpoint: `${environment.apiUrl}/broadcasting/auth`,
        auth: {
          headers: {
            Authorization: token
          },
          params: {}
        }
      });
      return pusher.subscribe('private-user.' + id);
    });
  }

  /**
   * Listen to the marketplace channel, note this is public.
   */
  public async listenToMarketplaceFeed(): Promise<Channel> {
    return await this.storage.get(StorageKeys.PROFILE).then(profile => {
      console.log(profile);
      const pusher = new Pusher(PUSHER_ID, {
        cluster: 'us2',
        forceTLS: true,
      });
      // show job only if users are in same org
      const orgId = (profile.user.organization_id != null) ? profile.user.organization_id : 0;
      console.log(orgId);
      return pusher.subscribe('marketplace.' + orgId);
    });
  }

  /**
   * Listen to a single chat room for messages.
   */
  public async listenToChatMessages(uuid): Promise<Channel> {
    return await this.storage.get(StorageKeys.ACCESS_TOKEN).then(token => {
      const pusher = new Pusher(PUSHER_ID, {
        cluster: 'us2',
        forceTLS: true,
        authEndpoint: `${environment.apiUrl}/broadcasting/auth`,
        auth: {
          headers: {
            Authorization: token
          },
          params: {}
        }
      });
      // show job only if users are in same org
      return pusher.subscribe('room.' + uuid);
    });
  }
}
