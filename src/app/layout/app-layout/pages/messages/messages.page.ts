import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ChatService} from '../../../../utils/services/chat.service';
import {Room} from '../../../../utils/interfaces/chat/room';
import {StorageKeys} from '../../../../providers/constants';
import {Storage} from '@ionic/storage';
import {PusherServiceProvider} from '../../../../providers/pusher.service';
import {ActionSheetController, IonContent, IonTextarea} from '@ionic/angular';
import {Subscription} from 'rxjs';
import { Response } from '../../../../utils/interfaces/response';


@Component({
  selector: 'messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit, OnDestroy {
  // @ts-ignore
  @ViewChild('chatDisplay') content: IonContent;
  // @ts-ignore
  @ViewChild('chatBox') textarea: IonTextarea;

  room: Room;
  userId: number;
  messages: any; // TODO create types
  toUser: string;
  uuid: string;
  pendingMessage = '';
  sending = false;
  didScrollToBottomOnInit = false;
  rooms: Room[];
  noImage = false;
  getChatRoomsSub: Subscription;
  activatedRouteSub: Subscription;
  footerHeight = '61px';

  constructor(private activatedRoute: ActivatedRoute,
              private chatService: ChatService,
              private storage: Storage,
              private pusher: PusherServiceProvider,
              private actionSheetCtrl: ActionSheetController,
              private router: Router,
              private changeRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getRooms();
    this.activatedRouteSub = this.activatedRoute.paramMap.subscribe(data => {
      this.uuid = data.get('uuid');
      // Initial Messages
      this.getMessages();
    });
    this.storage.get(StorageKeys.PROFILE)
      .then(profile => {
        this.userId = profile.user_id;
      });
    window.addEventListener('keyboardDidShow', (event) => {
      // console.log('Keyboard opened');
      setTimeout(() => this.content.scrollToBottom(300), 1);
    });
  }

  ngOnDestroy() {
    window.removeEventListener('keyboardDidShow', () => {
      // console.log('page destroyed');
    });
    this.activatedRouteSub.unsubscribe();
    this.getChatRoomsSub.unsubscribe();
  }

  public getRooms() {
    this.chatService.getChatRooms().then((res: Response<Room[]>) => this.rooms = res.data);
  }

  getUserProfileImage(members?: Room[]) {
    if (members) {
      // tslint:disable-next-line
      for(let member of members) {
        if (member.id !== this.userId) {
          return member.profile.image;
        }
      }
    } else {
      for (const member of this.room.members) {
        if (member.id !== this.userId) {
          return member.profile.image;
        }
      }
    }
  }

  public getUserName(members) {
    // tslint:disable-next-line
    for(let member of members) {
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

  getToUser() {
    const members = this.room.members;
    // tslint:disable-next-line
    for(let member of members) {
      if (member.id !== this.userId) {
        return member.first_name + ' ' + member.last_name;
      }
    }
  }

  goToUserProfile() {
    const members = this.room.members;
    for (const member of members) {
      if (member.id !== this.userId) {
        this.router.navigate(['/app/profile', member.id]);
      }
    }
  }

  getMessages() {
    this.getChatRoomsSub = this.chatService.getChatRoom(this.uuid).subscribe((res: Response<Room>) => {
      this.room = res.data;
      this.messages = this.room.messages;
      this.toUser = this.getToUser();
      this.changeRef.detectChanges();
      this.pusher.listenToChatMessages(this.uuid).then(chatChannel => {
        chatChannel.bind('new-message', data => {
          this.changeRef.detectChanges();
          const message = {
            sender_id: data.sender.id,
            text: data.message,
            sender: data.sender
          };
          this.messages.push(message);
          this.scrollToBottomOnInit();
          this.sending = false;
        });
      });
    });
  }

  sendMessage() {
    this.textarea.setFocus().then(() => this.footerHeight = 'inherit');
    this.sending = true;
    this.chatService.sendMessage(this.uuid, this.pendingMessage);
    this.pendingMessage = '';
    this.changeRef.detectChanges();
  }

  scrollToBottomOnInit() {
    this.content.scrollToBottom(300);
    this.didScrollToBottomOnInit = true;
  }

  onFocus() {
    this.content.scrollToBottom(300);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'User Actions',
      buttons: [{
        text: 'View Profile',
        icon: 'person',
        handler: () => {
          this.goToUserProfile();
        }
      }, {
        text: 'Close',
        role: 'cancel',
        handler: () => {
          // console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  doRefresh(event) {
    this.getMessages();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  setFooterHeight() {
    console.log(this.footerHeight);
    this.textarea.getInputElement().then(el => this.footerHeight = `${el.clientHeight + 5}px`);
  }
}
