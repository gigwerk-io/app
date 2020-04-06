import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Searchable} from '../../utils/interfaces/searchable';
import {FriendsService} from '../../utils/services/friends.service';
import {Router} from '@angular/router';
import {ChatService} from '../../utils/services/chat.service';
import {IonRouterOutlet, NavController, ToastController} from '@ionic/angular';
import {AuthService} from '../../utils/services/auth.service';
import {Storage} from '@ionic/storage';
import {StorageKeys} from '../../providers/constants';
import {UtilsService} from '../../utils/services/utils.service';

@Component({
  selector: 'friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
  providers: [IonRouterOutlet]
})
export class FriendsPage implements OnInit {
  users: Searchable[];
  title = 'Friends';
  btnClass: string;
  secondButton = false;
  clickType = 'friends';
  noImage = false;
  segment = 'friends';

  constructor(
    private friendService: FriendsService,
    private chatService: ChatService,
    private router: Router,
    private changeRef: ChangeDetectorRef,
    private authService: AuthService,
    private storage: Storage,
    private navCtrl: NavController,
    private routerOutlet: IonRouterOutlet,
    private utils: UtilsService
  ) {
  }

  ngOnInit() {
    this.segmentChanged();
  }

  handleSearch(query) {
    this.btnClass = 'arrow-forward';
    this.secondButton = false;
    this.clickType = 'search';
    this.friendService.searchUsers(query)
      .then(res => {
        this.users = res;
      })
      .catch(error => {
        if (error.status === 401) {
          this.authService.isValidToken().then(res => {
            if (!res.response) {
              this.utils.presentToast('You have been logged out.', 'success');
              this.storage.remove(StorageKeys.PROFILE);
              this.storage.remove(StorageKeys.ACCESS_TOKEN);
              this.navCtrl.navigateRoot('/welcome');
            }
          }).catch(e => this.utils.presentToast(e.message, 'danger'));
        }
      });
  }

  segmentChanged() {
    this.users = null;
    this.clickType = this.segment;
    switch (this.segment) {
      case 'recommended':
        this.showRecommendedFriends();
        break;
      case 'friends':
        this.showMyFriends();
        break;
      case 'new':
        this.showMyFriendRequests();
        break;
      default:
        this.showMyFriends();
    }
  }

  showRecommendedFriends() {
    this.btnClass = 'person-add';
    this.secondButton = false;
    this.friendService.getRecommendedFriends().then(res => {
      this.users = res;
      this.changeRef.detectChanges();
    }).catch(error => {
      if (error.status === 401) {
        this.authService.isValidToken().then(res => {
          if (!res.response) {
            this.utils.presentToast('You have been logged out.', 'success');
            this.storage.remove(StorageKeys.PROFILE);
            this.storage.remove(StorageKeys.ACCESS_TOKEN);
            this.navCtrl.navigateRoot('/welcome');
          }
        });
      }
    });
  }

  showMyFriends() {
    this.btnClass = 'chatbubble';
    this.secondButton = false;
    this.friendService.getMyFriends()
      .then(res => {
        this.users = res;
        this.changeRef.detectChanges();
      })
      .catch(error => {
        if (error.status === 401) {
          this.authService.isValidToken().then(res => {
            if (!res.response) {
              this.utils.presentToast('You have been logged out.', 'success');
              this.storage.remove(StorageKeys.PROFILE);
              this.storage.remove(StorageKeys.ACCESS_TOKEN);
              this.navCtrl.navigateRoot('/welcome');
            }
          });
        }
      });
  }

  showMyFriendRequests() {
    this.btnClass = 'checkmark';
    this.secondButton = true;
    this.friendService.getFriendRequests()
      .then(res => {
        this.users = res;
        this.changeRef.detectChanges();
      })
      .catch(error => {
        if (error.status === 401) {
          this.authService.isValidToken().then(res => {
            if (!res.response) {
              this.utils.presentToast('You have been logged out.', 'success');
              this.storage.remove(StorageKeys.PROFILE);
              this.storage.remove(StorageKeys.ACCESS_TOKEN);
              this.navCtrl.navigateRoot('/welcome');
            }
          });
        }
      });
  }

  goToUserProfile(id) {
    this.router.navigate(['/app/profile', id]);
  }

  startChat(username) {
    this.chatService.startChat(username).then(res => {
      this.router.navigate(['/app/room', res.id]);
    });
  }

  sendFriendRequest(id) {
    this.friendService.sendFriendRequest(id).then(res => {
      this.utils.presentToast(res, 'success');
    }).catch(error => this.utils.presentToast(error.message, 'danger'));
  }

  acceptFriendRequest(id) {
    this.friendService.acceptFriendRequest(id).then(res => {
      this.utils.presentToast(res, 'success');
      this.showMyFriendRequests();
    }).catch(error => this.utils.presentToast(error.message, 'danger'));
  }

  rejectFriendRequest(id) {
    this.friendService.rejectFriendRequest(id).then(res => {
      this.utils.presentToast(res, 'success');
      this.showMyFriendRequests();
    }).catch(error => this.utils.presentToast(error.message, 'danger'));
  }

  handleClick(user, i) {
    switch (this.clickType) {
      case 'friends':
        this.startChat(user.username);
        break;
      case 'recommended':
        this.users.splice(i);
        this.sendFriendRequest(user.id);
        break;
      case 'new':
        this.users.splice(i);
        this.acceptFriendRequest(user.id);
        break;
      case 'search':
        this.goToUserProfile(user.id);
        break;
      default:
        this.startChat(user.username);
    }
  }
}
