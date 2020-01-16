import { Component, OnInit } from '@angular/core';
import {Room} from '../../utils/interfaces/chat/room';
import {ChatService} from '../../utils/services/chat.service';
import {Storage} from '@ionic/storage';
import {StorageKeys} from '../../providers/constants';
import {Router} from '@angular/router';

@Component({
  selector: 'chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  rooms: Room[];
  user_id: Number;
  constructor(private roomService: ChatService, private storage: Storage, private router: Router) { }

  ngOnInit() {
    this.getRooms();
    this.storage.get(StorageKeys.PROFILE)
      .then(profile => {
        this.user_id = profile.user_id;
      });
  }

  public getRooms() {
    this.roomService.getChatRooms().subscribe(res => {
      this.rooms = res;
    });
  }

  public getUserProfileImage(members) {
    // tslint:disable-next-line
    for(let member of members) {
      if (member.id !== this.user_id) {
        return member.profile.image;
      }
    }
  }

  public getUserName(members) {
    // tslint:disable-next-line
    for(let member of members) {
      if (member.id !== this.user_id) {
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

}
