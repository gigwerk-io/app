import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ChatService} from '../../utils/services/chat.service';
import {Room} from '../../utils/interfaces/chat/room';
import {StorageKeys} from '../../providers/constants';
import {Storage} from '@ionic/storage';
import {PusherServiceProvider} from '../../providers/pusher.service';
import {ActionSheetController, Events, IonContent, IonTextarea} from '@ionic/angular';


@Component({
  selector: 'messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  // @ts-ignore
  @ViewChild('chatDisplay') content: IonContent;
  // @ts-ignore
  @ViewChild('chatBox') textarea: IonTextarea;

  room: Room;
  user_id: Number;
  messages: any; // TODO create types
  toUser: string;
  uuid: string;
  pendingMessage = '';
  sending = false;
  didScrollToBottomOnInit = false;
  rooms: Room[];

  constructor(private activatedRoute: ActivatedRoute,
              private chatService: ChatService,
              private storage: Storage,
              private pusher: PusherServiceProvider,
              private actionSheetCtrl: ActionSheetController,
              private router: Router
  ) {}

  ngOnInit() {
    this.getRooms();
    this.activatedRoute.paramMap.subscribe(data => {
      this.uuid = data.get('uuid');
      // Initial Messages
      this.getMessages();
    });
    this.storage.get(StorageKeys.PROFILE)
      .then(profile => {
        this.user_id = profile.user_id;
      });
    window.addEventListener('keyboardDidShow', (event) => {
      // console.log('Keyboard opened');
      setTimeout(() => this.content.scrollToBottom(300), 1);
    });
  }

  ionViewDidLeave() {
    window.removeEventListener('keyboardDidShow', () => {
      // console.log('page destroyed');
    });
  }

  public getRooms() {
    this.chatService.getChatRooms().subscribe(res => {
      this.rooms = res;
    });
  }

  getUserProfileImage(members?: Room[]) {
    if (members) {
      // tslint:disable-next-line
      for(let member of members) {
        if (member.id !== this.user_id) {
          return member.profile.image;
        }
      }
    } else {
      for (const member of this.room.members) {
        if (member.id !== this.user_id) {
          return member.profile.image;
        }
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

  getToUser() {
    const members = this.room.members;
    // tslint:disable-next-line
    for(let member of members) {
      if (member.id !== this.user_id) {
        return member.first_name + ' ' + member.last_name;
      }
    }
  }

  goToUserProfile() {
    const members = this.room.members;
    for (const member of members) {
      if (member.id !== this.user_id) {
        this.router.navigate(['/app/profile', member.id]);
      }
    }
  }

  getMessages() {
    this.chatService.getChatRoom(this.uuid).subscribe(res => {
      this.room = res;
      this.messages = this.room.messages;
      this.toUser = this.getToUser();
      const channel = this.pusher.init(this.uuid);
      console.log('Pusher: ' + channel);
      channel.bind('new-message', data => {
        this.messages.push(data.message);
        this.scrollToBottomOnInit();
        // console.log(data);
        this.sending = false;
      });
    });
  }

  sendMessage() {
    this.textarea.setFocus();
    this.sending = true;
    this.chatService.sendMessage(this.uuid, this.pendingMessage);
    this.pendingMessage = '';
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
}
