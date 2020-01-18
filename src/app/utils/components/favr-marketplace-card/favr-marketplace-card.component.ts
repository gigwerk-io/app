import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MainMarketplaceTask} from '../../interfaces/main-marketplace/main-marketplace-task';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {Events, LoadingController, ModalController, NavController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {ChatService} from '../../services/chat.service';
import {MarketplaceService} from '../../services/marketplace.service';
import {TaskActions, TaskStatus} from '../../../providers/constants';
import {PastJob} from '../../interfaces/user';
import {RequestPage} from '../../../pages/request/request.page';

@Component({
  selector: 'favr-marketplace-card',
  templateUrl: './favr-marketplace-card.component.html',
  styleUrls: ['./favr-marketplace-card.component.scss'],
  providers: [PhotoViewer]
})
export class FavrMarketplaceCardComponent implements OnInit, OnDestroy {

  @Input() mainMarketplaceTask: MainMarketplaceTask;
  @Input() freelancerPastTask: PastJob;
  @Output() taskActionTaken: EventEmitter<string> = new EventEmitter();

  mainMarketTask: MainMarketplaceTask;
  pastJob: PastJob;
  TaskStatus = TaskStatus;

  constructor(private photoViewer: PhotoViewer,
              private loadingCtrl: LoadingController,
              private router: Router,
              private marketplaceService: MarketplaceService,
              private chatService: ChatService,
              private toastCtrl: ToastController,
              private changeRef: ChangeDetectorRef,
              private modalCtrl: ModalController,
              private navCtrl: NavController,
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

    return this.router.navigateByUrl('/app/marketplace-detail/' + id)
      .then(() => loadingMarketplaceDetail.dismiss());
  }

  async presentToast(message) {
    await this.toastCtrl.create({
      message: message,
      position: 'top',
      duration: 2500,
      color: 'dark',
      showCloseButton: true
    }).then(toast => {
      toast.present();
      this.marketplaceService.getSingleMainMarketplaceRequest(this.mainMarketplaceTask.id)
        .then((task) => {
          this.mainMarketplaceTask = task;
          this.changeRef.detectChanges();
        });
    });
  }

  async errorMessage(message) {
    await this.toastCtrl.create({
      message: message,
      position: 'top',
      duration: 2500,
      color: 'danger',
      showCloseButton: true
    }).then(toast => {
      toast.present();
    });
  }

  startChat(username) {
    this.chatService.startChat(username).subscribe(res => {
      this.router.navigate(['/app/room', res.id]);
    }, error => {
      this.presentToast(error.error.message);
    });
  }

  freelancerAcceptTask() {
    this.marketplaceService.freelancerAcceptMainMarketplaceRequest(this.mainMarketplaceTask.id)
      .then((res: string) => {
        this.presentToast(res)
          .then(() => this.taskActionTaken.emit('freelancerAcceptTask'));
      })
      .catch((err) => {
        this.errorMessage(err.error.message).then(() => {
          setTimeout(() => this.router.navigateByUrl('app/connect-bank-account'), 550);
        });
      });
  }

  async freelancerWithdrawTask() {
    const freelancerWithdrawTask = await this.marketplaceService.freelancerWithdrawMainMarketplaceRequest(this.mainMarketplaceTask.id)
      .then((res: string) => res)
      .catch((err: any) => err.error.message);
    this.presentToast(freelancerWithdrawTask)
      .then(() => this.taskActionTaken.emit('freelancerWithdrawTask'));
  }

  async customerCancelTask() {
    const cancelTask = await this.marketplaceService.customerCancelMainMarketplaceRequest(this.mainMarketplaceTask.id)
      .then((res: string) => res)
      .catch((err: any) => err.error.message);
    this.presentToast(cancelTask)
      .then(() => this.taskActionTaken.emit('customerCancelTask'));
  }

  async customerEditTask(task: MainMarketplaceTask) {
    const modal = await this.modalCtrl.create({
      component: RequestPage,
      componentProps: {'isModal': true}
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
