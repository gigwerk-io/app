import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Searchable} from '../../utils/interfaces/searchable';
import {FriendsService} from '../../utils/services/friends.service';
import {Router} from '@angular/router';
import {IonRouterOutlet, NavController} from '@ionic/angular';
import {AuthService} from '../../utils/services/auth.service';
import {Storage} from '@ionic/storage';
import {StorageKeys} from '../../providers/constants';
import {UtilsService} from '../../utils/services/utils.service';
import { Response } from '../../utils/interfaces/response';

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
    private router: Router,
    private changeRef: ChangeDetectorRef,
    private authService: AuthService,
    private storage: Storage,
    private navCtrl: NavController,
    public routerOutlet: IonRouterOutlet,
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
      .then((res: Response<Searchable[]>) => {
        this.users = res.data;
      })
      .catch(error => {
        if (error.status === 401) {
          this.authService.isValidToken();
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
    this.friendService.getRecommendedFriends().then((res: Response<Searchable[]>) => {
      this.users = res.data;
      this.changeRef.detectChanges();
    }).catch(error => {
      if (error.status === 401) {
        this.authService.isValidToken();
      }
    });
  }

  showMyFriends() {
    this.btnClass = 'chatbubble';
    this.secondButton = false;
    this.friendService.getMyFriends()
      .then((res: Response<Searchable[]>) => {
        this.users = res.data;
        this.changeRef.detectChanges();
      })
      .catch(error => {
        if (error.status === 401) {
          this.authService.isValidToken();
        }
      });
  }

  showMyFriendRequests() {
    this.btnClass = 'checkmark';
    this.secondButton = true;
    this.friendService.getFriendRequests()
      .then((res: Response<Searchable[]>) => {
        this.users = res.data;
        this.changeRef.detectChanges();
      })
      .catch(error => {
        if (error.status === 401) {
          this.authService.isValidToken();
        }
      });
  }

  goToUserProfile(id) {
    this.router.navigate(['/app/profile', id]);
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
        this.utils.startChat(user.username);
    }
  }
}
