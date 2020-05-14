import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {AlertController, IonRouterOutlet, ModalController, NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {StorageKeys} from '../../../providers/constants';
import {SearchPage} from '../../../layout/app-layout/pages/search/search.page';
import {ProfileService} from '../../services/profile.service';

@Component({
  selector: 'favr-page-header',
  templateUrl: './favr-page-header.component.html',
  styleUrls: ['./favr-page-header.component.scss']
})
export class FavrPageHeaderComponent implements OnInit {

  @Input() pageTitle: string;
  @Input() showSearchBar = false;
  @Input() isModal = false;
  @Input() showProfile = true;
  @Input() showBackButton = false;
  @Input() progress: number;
  @Input() routerOutlet: IonRouterOutlet;

  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() navigateForward: EventEmitter<boolean> = new EventEmitter<boolean>();

  profileImage: string;
  profileId: number;

  constructor(private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private navCtrl: NavController,
              private profileService: ProfileService,
              private storage: Storage) { }

  ngOnInit() {
    this.storage.get(StorageKeys.PROFILE)
      .then(profile => {
        if (profile) {
          this.profileId = profile.user_id;
          this.profileService.getProfileImage(this.profileId)
            .then((profileImage) => {
              this.profileImage = profileImage;
            });
        }
      });
  }

  closePage(): void {
    if (this.isModal) {
      return this.close.emit(true);
    } else {
      return this.close.emit(false);
    }
  }

  navigateToChat() {
    this.navCtrl.navigateForward('/app/chat');
    this.navigateForward.emit(true);
  }

  navigateToProfile() {
    this.navCtrl.navigateForward(`/app/profile/${this.profileId}`);
    this.navigateForward.emit(true);
  }

  async openSearchModal() {
    const modal = await this.modalCtrl.create({
      component: SearchPage,
      componentProps: {isModal: true},
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      cssClass: 'transparent-modal',
      // enterAnimation: (this.platform.is('mobile') || this.platform.is('pwa')) ? popInAnimation : undefined,
      // leaveAnimation: (this.platform.is('mobile') || this.platform.is('pwa')) ? popOutAnimation : undefined
    });

    await modal.present();
  }
}
