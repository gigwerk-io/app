import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MainMarketplaceTask} from '../../interfaces/main-marketplace/main-marketplace-task';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {AlertController, IonRouterOutlet, ModalController, NavController} from '@ionic/angular';
import {Router} from '@angular/router';
import {MarketplaceService} from '../../services/marketplace.service';
import {Role, StorageKeys, TaskAction, TaskStatus} from '../../../providers/constants';
import {PastJob, Profile} from '../../interfaces/user';
import {RequestPage} from '../../../layout/app-layout/pages/request/request.page';
import {Events} from '../../services/events';
import {UtilsService} from '../../services/utils.service';
import {Storage} from '@ionic/storage';

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
  @Output() taskActionTaken: EventEmitter<number> = new EventEmitter();

  mainMarketTask: MainMarketplaceTask;
  pastJob: PastJob;
  userProfile: Profile;
  TaskStatus = TaskStatus;
  Role = Role;

  constructor(private photoViewer: PhotoViewer,
              private router: Router,
              private marketplaceService: MarketplaceService,
              private utils: UtilsService,
              private changeRef: ChangeDetectorRef,
              private modalCtrl: ModalController,
              private navCtrl: NavController,
              private alertCtrl: AlertController,
              private events: Events,
              private storage: Storage) {  }

  ngOnInit() {
    setTimeout(() => {
      this.storage.get(StorageKeys.PROFILE)
        .then(prof => {
          this.userProfile = prof;
          this.mainMarketTask = this.mainMarketplaceTask;
          this.pastJob = this.freelancerPastTask;
          this.events.subscribe('task-action', (action, taskID) => {
            if (this.mainMarketplaceTask.id === taskID) {
              switch (action) {
                case TaskAction.JOB_CAN_BE_ACCEPTED:
                  this.mainMarketplaceTask.action = 3;
                  this.changeRef.detectChanges();
                  break;
                case TaskAction.WORKER_IS_WAITING_FOR_CUSTOMER:
                  this.mainMarketplaceTask.action = 2;
                  this.changeRef.detectChanges();
                  break;
                case TaskAction.JOB_IS_EDITABLE:
                  break;
              }
            }
          });
        });
    }, 1000);
  }

  ngOnDestroy(): void {
    this.events.unsubscribe('task-action');
  }

  private viewAttachedPhoto(url: string, photoTitle?: string): void {
    this.photoViewer.show(url, (photoTitle) ? photoTitle : '');
  }

  async openMarketplaceDetail(id: number): Promise<boolean> {
    return this.navCtrl.navigateForward('/app/marketplace-detail/' + id);
  }

  async alertConfirmCustomerCancel() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
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

  async alertConfirmFreelancerWithdrawal() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'You are about to <strong>withdraw</strong> from working on this request.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Yes',
          handler: () => this.freelancerWithdrawTask()
        }
      ]
    });

    await alert.present();
  }

  freelancerAcceptTask() {
    this.marketplaceService.freelancerAcceptMainMarketplaceRequest(this.mainMarketplaceTask.id)
      .then((res) => (res.success) ? this.taskActionTaken.emit(TaskAction.JOB_CAN_BE_ACCEPTED) : undefined)
      .catch(() => setTimeout(() => this.navCtrl.navigateForward('app/connect-bank-account'), 550));
  }

  freelancerWithdrawTask() {
    this.marketplaceService.freelancerWithdrawMainMarketplaceRequest(this.mainMarketplaceTask.id)
      .then(() => this.taskActionTaken.emit(TaskAction.WORKER_IS_WAITING_FOR_CUSTOMER));
  }

  freelancerArriveTask() {
    this.marketplaceService.freelancerArrivedAtTaskSite(this.mainMarketplaceTask.id)
      .then(() => this.taskActionTaken.emit(TaskAction.WORKER_IS_IN_PROGRESS));
  }

  customerCancelTask() {
    this.marketplaceService.customerCancelMainMarketplaceRequest(this.mainMarketplaceTask.id)
      .then(() => this.taskActionTaken.emit(TaskAction.JOB_IS_EDITABLE));
  }

  async customerEditTask(task: MainMarketplaceTask) {
    const requestPageModal = await this.modalCtrl.create({
      component: RequestPage,
      componentProps: {isModal: true},
      swipeToClose: false,
      presentingElement: this.routerOutlet.nativeEl
    });
    await requestPageModal.present()
      .then(() => this.events.publish('task-edit', task));
  }
}
