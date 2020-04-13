import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MainMarketplaceTask} from '../../interfaces/main-marketplace/main-marketplace-task';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {AlertController, IonRouterOutlet, LoadingController, ModalController, NavController} from '@ionic/angular';
import {Router} from '@angular/router';
import {ChatService} from '../../services/chat.service';
import {MarketplaceService} from '../../services/marketplace.service';
import {TaskActions, TaskStatus} from '../../../providers/constants';
import {PastJob} from '../../interfaces/user';
import {RequestPage} from '../../../pages/request/request.page';
import {Events} from '../../services/events';
import {UtilsService} from '../../services/utils.service';

@Component({
  selector: 'favr-marketplace-card',
  templateUrl: './favr-marketplace-card.component.html',
  styleUrls: ['./favr-marketplace-card.component.scss'],
  providers: [PhotoViewer]
})
export class FavrMarketplaceCardComponent implements OnInit, OnDestroy {

  @Input() mainMarketplaceTask: MainMarketplaceTask;
  @Input() freelancerPastTask: PastJob;
  @Input() routerOutlet: IonRouterOutlet;
  @Output() taskActionTaken: EventEmitter<string> = new EventEmitter();

  mainMarketTask: MainMarketplaceTask;
  pastJob: PastJob;
  TaskStatus = TaskStatus;

  constructor(private photoViewer: PhotoViewer,
              private loadingCtrl: LoadingController,
              private router: Router,
              private marketplaceService: MarketplaceService,
              private chatService: ChatService,
              private utils: UtilsService,
              private changeRef: ChangeDetectorRef,
              private modalCtrl: ModalController,
              private navCtrl: NavController,
              private alertCtrl: AlertController,
              private events: Events) {
    this.events.subscribe('task-action', (action, taskID) => {
      if (this.mainMarketplaceTask.id === taskID) {
        switch (action) {
          case TaskActions.FREELANCER_ACCEPT_TASK:
            this.mainMarketplaceTask.action = 3;
            this.changeRef.detectChanges();
            break;
          case TaskActions.FREELANCER_WITHDRAW_TASK:
            this.mainMarketplaceTask.action = 2;
            this.changeRef.detectChanges();
            break;
          case TaskActions.CUSTOMER_CANCEL_TASK:
            this.taskActionTaken.emit(TaskActions.CUSTOMER_CANCEL_TASK);
            break;
        }
      }
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.mainMarketTask = this.mainMarketplaceTask;
      this.pastJob = this.freelancerPastTask;
    }, 2000);
  }

  ngOnDestroy(): void {
    this.events.unsubscribe('task-action');
  }

  private viewAttachedPhoto(url: string, photoTitle?: string): void {
    this.photoViewer.show(url, (photoTitle) ? photoTitle : '');
  }

  async loadMarketplaceDetail(id: number): Promise<boolean> {
    const loadingMarketplaceDetail = await this.loadingCtrl.create({
      message: 'Please wait...',
      translucent: true
    });

    await loadingMarketplaceDetail.present();

    return this.navCtrl.navigateForward('/app/marketplace-detail/' + id)
      .then(() => loadingMarketplaceDetail.dismiss());
  }

  async alertConfirmCustomerCancel() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      // tslint:disable-next-line:max-line-length
      message: 'You are about to <strong>cancel</strong> this request. Your request <strong>will be DELETED</strong>.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Yes',
          handler: () => {
            this.customerCancelTask();
          }
        }
      ]
    });

    await alert.present();
  }

  startChat(username) {
    this.chatService.startChat(username).then(res => {
      this.navCtrl.navigateForward(['/app/room', res.id]);
    }).catch(error => {
      this.utils.presentToast(error.error.message, 'danger');
    });
  }

  freelancerAcceptTask() {
    this.marketplaceService.freelancerAcceptMainMarketplaceRequest(this.mainMarketplaceTask.id)
      .then((res: string) => {
        this.utils.presentToast(res, 'success')
          .then(() => this.taskActionTaken.emit('freelancerAcceptTask'));
      })
      .catch((err) => {
        this.utils.presentToast(err.error.message, 'danger').then(() => {
          setTimeout(() => this.navCtrl.navigateForward('app/connect-bank-account'), 550);
        });
      });
  }

  async freelancerWithdrawTask() {
    const freelancerWithdrawTask = await this.marketplaceService.freelancerWithdrawMainMarketplaceRequest(this.mainMarketplaceTask.id)
      .then((res: string) => res)
      .catch((err: any) => err.error.message);
    this.utils.presentToast(freelancerWithdrawTask, 'success')
      .then(() => this.taskActionTaken.emit('freelancerWithdrawTask'));
  }

  async customerCancelTask() {
    const cancelTask = await this.marketplaceService.customerCancelMainMarketplaceRequest(this.mainMarketplaceTask.id)
      .then((res: string) => res)
      .catch((err: any) => err.error.message);
    this.utils.presentToast(cancelTask, 'success')
      .then(() => this.taskActionTaken.emit('customerCancelTask'));
  }

  async customerEditTask(task: MainMarketplaceTask) {
    const modal = await this.modalCtrl.create({
      component: RequestPage,
      componentProps: {isModal: true},
      swipeToClose: false,
      presentingElement: this.routerOutlet.nativeEl
    });

    const loadingRequestPage = await this.loadingCtrl.create({
      message: 'Please wait...',
      translucent: true
    });

    await loadingRequestPage.present();

    modal.onDidDismiss().then(async () => {
      const loadingPage = await this.loadingCtrl.create({
        message: 'Please wait...',
        translucent: true
      });

      await loadingPage.present();
      loadingPage.dismiss();
    });

    await modal.present()
      .then(() => {
        this.events.publish('task-edit', task);
        return loadingRequestPage.dismiss();
      });
  }
}
