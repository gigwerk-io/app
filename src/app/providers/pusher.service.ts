import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {PUSHER_ID} from './constants';
declare const Pusher: any;
@Injectable()
export class PusherServiceProvider {
  channel;
  constructor(public http: HttpClient) {

  }
  public init(uuid) {
    const pusher = new Pusher(PUSHER_ID, {
      cluster: 'us2',
      encrypted: true,
    });
    this.channel = pusher.subscribe(uuid);
    return this.channel;
  }

  public marketplace() {
    const pusher = new Pusher(PUSHER_ID, {
      cluster: 'us2',
      encrypted: true,
    });
    this.channel = pusher.subscribe('marketplace');
    return this.channel;
  }

  public user(id) {
    const pusher = new Pusher(PUSHER_ID, {
      cluster: 'us2',
      encrypted: true,
    });
    this.channel = pusher.subscribe(`users.${id}`);
    return this.channel;
  }
}
