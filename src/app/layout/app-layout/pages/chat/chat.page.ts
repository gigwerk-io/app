import { Component, OnInit } from '@angular/core';
import {Room} from '../../../../utils/interfaces/chat/room';
import {ChatService} from '../../../../utils/services/chat.service';
import {Storage} from '@ionic/storage';
import {StorageKeys} from '../../../../providers/constants';
import {Router} from '@angular/router';
import {SearchPage} from '../search/search.page';
import {IonRouterOutlet, ModalController} from '@ionic/angular';
import { Response } from '../../../../utils/interfaces/response';

@Component({
  selector: 'chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  rooms: Room[];
  userId: number;

  constructor(private roomService: ChatService,
              private storage: Storage,
              private modalCtrl: ModalController,
              public routerOutlet: IonRouterOutlet,
              private router: Router) { }

  ngOnInit() {
    this.getRooms();
    this.storage.get(StorageKeys.PROFILE)
      .then(profile => {
        this.userId = profile.user_id;
      });
  }

  public getRooms() {
    this.roomService.getChatRooms()
      .then((res: Response<Room[]>) => this.rooms = res.data)
      .catch(() => this.rooms = []);
  }

  public getUserProfileImage(members) {
    for (const member of members) {
      if (member.id !== this.userId) {
        return member.profile.image;
      }
    }
  }

  public getUserName(members) {
    for (const member of members) {
      if (member.id !== this.userId) {
        return member.first_name + ' ' + member.last_name;
      }
    }
  }

  public getLastMessage(room: Room) {
    if (room.last_message != null) {
      return room.last_message.text;
    }  else {
      return 'Say Hello!';
    }
  }

  public goToChatRoom(uuid) {
    this.router.navigate(['/app/room', uuid]);
  }

  doRefresh(event) {
    this.getRooms();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async openSearchModal() {
    const modal = await this.modalCtrl.create({
      component: SearchPage,
      componentProps: {isModal: true, isChat: true},
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      cssClass: 'transparent-modal',
      // enterAnimation: (this.platform.is('mobile') || this.platform.is('pwa')) ? popInAnimation : undefined,
      // leaveAnimation: (this.platform.is('mobile') || this.platform.is('pwa')) ? popOutAnimation : undefined
    });

    await modal.present();
  }
}
