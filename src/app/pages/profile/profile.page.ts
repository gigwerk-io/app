import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProfileRouteResponse} from '../../utils/interfaces/user';
import {ProfileService} from '../../utils/services/profile.service';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {Storage} from '@ionic/storage';
import {ActionSheetController, IonRouterOutlet, ModalController, NavController, ToastController} from '@ionic/angular';
import {ChatService} from '../../utils/services/chat.service';
import {FriendsService} from '../../utils/services/friends.service';
import {Role, StorageKeys} from '../../providers/constants';
import {Subscription} from 'rxjs';
import {AuthService} from '../../utils/services/auth.service';
import {MarketplaceService} from '../../utils/services/marketplace.service';
import {ReportPage} from '../report/report.page';
import {UtilsService} from '../../utils/services/utils.service';
import {errorObject} from 'rxjs/internal-compatibility';

@Component({
  selector: 'profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [PhotoViewer]
})
export class ProfilePage implements OnInit, OnDestroy {

  profile: ProfileRouteResponse;
  isOwner: boolean;
  status: {class: string, text: string};
  showFriendButton = true;
  friendButton: any;
  rating: number;
  Role = Role;
  taskFeed = 'customer';
  activatedRouteSub: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private storage: Storage,
              private profileService: ProfileService,
              private chatService: ChatService,
              private friendService: FriendsService,
              private marketplaceService: MarketplaceService,
              private router: Router,
              private photoViewer: PhotoViewer,
              private actionSheetCtrl: ActionSheetController,
              private modalCtrl: ModalController,
              private navCtrl: NavController,
              private authService: AuthService,
              public routerOutlet: IonRouterOutlet,
              private utils: UtilsService) {}

  ngOnInit() {
    this.activatedRouteSub = this.activatedRoute.paramMap.subscribe(data => {
      const id: number = parseInt(data.get('id'), 10);
      this.profileService.getProfile(id)
        .then((profile: ProfileRouteResponse) => {
          this.profile = profile;
          if (profile.user.customer_rating != null) {
            this.rating = profile.user.customer_rating;
          } else if (profile.user.rating != null) {
            this.rating = profile.user.rating;
          }

          this.status = this.showBadge(profile.user.friend_status);
          this.friendButton = this.defineFriendButton(profile.user.friend_status);
          this.storage.get(StorageKeys.PROFILE)
            .then((prof: any) => {
              this.isOwner = (prof.user_id === this.profile.user.user_id);
              if (this.profile.user.user.role !== Role.VERIFIED_FREELANCER || this.isOwner) {
                this.taskFeed = 'customer';
              } else {
                this.taskFeed = 'freelancer';
              }
            });
        }).catch(error => {
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
    });
  }

  ngOnDestroy() {
    this.activatedRouteSub.unsubscribe();
  }

  private viewAttachedPhoto(url: string, photoTitle?: string): void {
    this.photoViewer.show(url, (photoTitle) ? photoTitle : '');
  }


  async presentOwnerActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Task Actions',
      buttons: [{
        text: 'Edit Profile',
        icon: 'create',
        handler: () => {
          this.router.navigateByUrl('app/edit-profile');
        }
      }, {
        text: 'Go to User Settings',
        icon: 'settings',
        handler: () => {
          this.router.navigateByUrl('app/tabs/settings');
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

  async presentActionSheet() {

    const actionButtons = (this.status.text === 'Friends') ? [{
      text: 'Unfriend ' + this.profile.user.user.first_name,
      role: 'destructive',
      icon: 'remove-circle',
      handler: () => {
        this.friendService.unfriend(this.profile.user.user_id)
          .then(message => this.utils.presentToast(message, 'success')
            .then(() => this.doRefresh()))
          .catch(error => this.utils.presentToast(error.message, 'danger'));
      }
    }, {
      text: 'Report User',
      role: 'destructive',
      icon: 'flag',
      handler: () => {
        setTimeout(async () => {
          const reportUserModal = await this.modalCtrl.create({
            component: ReportPage,
            componentProps: {type: 'User', extra: this.profile},
            swipeToClose: true,
            presentingElement: this.routerOutlet.nativeEl
          });

          await reportUserModal.present();
        }, 0);
      }
    }, {
      text: 'Close',
      role: 'cancel',
      handler: () => {
        // console.log('Cancel clicked');
      }
    }] : [{
      text: 'Report User',
      role: 'destructive',
      icon: 'flag',
      handler: () => {
        setTimeout(async () => {
          const reportUserModal = await this.modalCtrl.create({
            component: ReportPage,
            componentProps: {type: 'User', extra: this.profile},
            swipeToClose: true,
            presentingElement: this.routerOutlet.nativeEl
          });

          await reportUserModal.present();
        }, 0);
      }
    }, {
      text: 'Close',
      role: 'cancel',
      handler: () => {
        // console.log('Cancel clicked');
      }
    }];

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'User Actions',
      buttons: [...actionButtons]
    });
    await actionSheet.present();
  }

  startChat(username) {
    this.chatService.startChat(username).then(res => {
      this.router.navigate(['/app/room', res.id]);
    });
  }

  showBadge(status) {
    switch (status) {
      case 'friend':
        return {class: 'success', text: 'Friends'};
      case 'sent':
        return {class: 'dark', text: 'Pending'};
      case 'respond':
        return {class: 'secondary', text: 'Respond'};
      case 'not_friend':
        return {class: 'danger', text: 'Not Friends'};
      case false:
        return {class: 'tertiary', text: 'My Profile'};
    }
  }

  defineFriendButton(status) {
    switch (status) {
      case 'friend':
        this.showFriendButton = false;
        return {class: 'close', disable: false};
      case 'sent':
        return {class: 'person-add', disable: true};
      case 'respond':
        return {class: 'add', disable: false};
      case 'not_friend':
        return {class: 'person-add', disable: false};
      case false:
        this.showFriendButton = false;
        return;
    }
  }

  handleFriendButtonClick() {
    switch (this.profile.user.friend_status) {
      case 'friend':
        break;
      case 'sent':
        break;
      case 'respond':
        this.friendService.acceptFriendRequest(this.profile.user.user_id)
          .then(res => this.utils.presentToast(res, 'success'))
          .catch(error => this.utils.presentToast(error.message, 'danger'));
        break;
      case 'not_friend':
        this.friendButton.disable = true;
        this.friendService.sendFriendRequest(this.profile.user.user_id)
          .then(res => this.utils.presentToast(res, 'success'))
          .catch(error => this.utils.presentToast(error.message, 'danger'));
        break;
    }
  }

  async doRefresh(event?) {
    setTimeout(() => {
      this.profileService.getProfile(this.profile.user.user_id)
        .then((profile: ProfileRouteResponse) => {
          this.profile = profile;
          this.status = this.showBadge(profile.user.friend_status);
          this.friendButton = this.defineFriendButton(profile.user.friend_status);
          this.storage.get(StorageKeys.PROFILE)
            .then((prof: any) => {
              this.isOwner = (prof.user_id === this.profile.user.user_id);
            });
        });
      if (event) {
        if (event.target) {
          event.target.complete();
        }
      }
    }, 1000);
  }
}
