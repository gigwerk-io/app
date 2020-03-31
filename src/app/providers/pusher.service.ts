import { HttpClient } from '@angular/common/http';
import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {PUSHER_ID} from './constants';
import {Subscription} from 'rxjs';
declare const Pusher: any;
@Injectable()
export class PusherServiceProvider implements OnInit, OnDestroy {
  channel: any;

  constructor(public http: HttpClient) {  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.channel.unsubscribe();
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
