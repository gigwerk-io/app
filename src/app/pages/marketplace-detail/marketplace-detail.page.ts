import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonRouterOutlet,
  LoadingController,
  ModalController,
  NavController
} from '@ionic/angular';
import {MainMarketplaceTask} from '../../utils/interfaces/main-marketplace/main-marketplace-task';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {ActivatedRoute, Router} from '@angular/router';
import {MarketplaceService} from '../../utils/services/marketplace.service';
import {Storage} from '@ionic/storage';
import {Role, StorageKeys, TaskActions, TaskStatus} from '../../providers/constants';
import {Events} from '../../utils/services/events';
import {CompleteTaskPage} from '../complete-task/complete-task.page';
import {LaunchNavigator, LaunchNavigatorOptions} from '@ionic-native/launch-navigator/ngx';
import {ReportPage} from '../report/report.page';
import {FavrDataService} from '../../utils/services/favr-data.service';
import {RequestPage} from '../request/request.page';
import {FinanceService} from '../../utils/services/finance.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {MainCategory} from '../../utils/interfaces/main-marketplace/main-category';
import {Subscription} from 'rxjs';
import {UtilsService} from '../../utils/services/utils.service';
import {PreviousRouteService} from '../../providers/previous-route.service';

@Component({
  selector: 'marketplace-detail',
  templateUrl: './marketplace-detail.page.html',
  styleUrls: ['./marketplace-detail.page.scss'],
  providers: [PhotoViewer, LaunchNavigator, IonRouterOutlet]
})
export class MarketplaceDetailPage implements OnInit, OnDestroy {

  taskID: number;
  mainMarketplaceTask: MainMarketplaceTask;
  page = 'main';
  taskStatusDisplay: string;
  isOwner: boolean;
  isFreelancer: boolean;
  userRole: string;
  Categories: MainCategory[];
  TaskStatus = TaskStatus;
  credit: number;
  activatedRouteSub: Subscription;

  constructor(private modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              private storage: Storage,
              private router: Router,
              private photoViewer: PhotoViewer,
              private activatedRoute: ActivatedRoute,
              private navCtrl: NavController,
              private marketplaceService: MarketplaceService,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private events: Events,
              private launchNavigator: LaunchNavigator,
              private favrService: FavrDataService,
              private financeService: FinanceService,
              private geolocation: Geolocation,
              public routerOutlet: IonRouterOutlet,
              private previousRoute: PreviousRouteService,
              private utils: UtilsService) {
    this.favrService.getCategories().then(res => this.Categories = res.categories);
    this.events.subscribe('task-action', (action) => this.doRefresh());
  }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then(res => {
      const coords = {lat: res.coords.latitude, long: res.coords.longitude};
      // Get job details with location
      this.getJobDetails(coords);
    }).catch(err => this.getJobDetails());
    this.getCreditBalance();
  }


  ngOnDestroy() {
    this.activatedRouteSub.unsubscribe();
    this.events.unsubscribe('task-action');
  }

  getJobDetails(coords?: any) {
    this.activatedRouteSub = this.activatedRoute.paramMap.subscribe(data => {
      this.taskID = parseInt(data.get('id'), 10);
      this.marketplaceService.getSingleMainMarketplaceRequest(this.taskID, coords)
        .then((task: MainMarketplaceTask) => {
          this.mainMarketplaceTask = task;
          this.taskStatusDisplay = (this.mainMarketplaceTask.status === TaskStatus.PAID)
            ? 'Freelancer En-Route'
            : this.mainMarketplaceTask.status;
          this.storage.get(StorageKeys.PROFILE)
            .then(prof => {
              this.userRole = prof.user.role;
              this.isOwner = prof.user_id === task.customer_id;
              this.isFreelancer = (this.userRole === Role.VERIFIED_FREELANCER)
                ? this.marketplaceService.checkIsTaskFreelancer(prof.user_id, this.mainMarketplaceTask)
                : false;
            });
          console.log(this.mainMarketplaceTask);
        });
    });
  }

  getCreditBalance() {
    this.financeService.getCreditBalance().then(res => {
      this.credit = parseInt(res.credit.toString().replace('$', ''), 10);
    });
  }

  viewAttachedPhoto(url: string, photoTitle?: string): void {
    this.photoViewer.show(url, (photoTitle) ? photoTitle : '');
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Task Actions',
      buttons: [{
        text: 'Report Task',
        role: 'destructive',
        icon: 'flag',
        handler: () => {
          setTimeout(async () => {
            const reportUserModal = await this.modalCtrl.create({
              component: ReportPage,
              componentProps: {type: 'Task', extra: this.mainMarketplaceTask},
              swipeToClose: true,
              presentingElement: this.routerOutlet.nativeEl
            });

            await reportUserModal.present();
          }, 0);
        }
      }, {
        text: 'Close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  startChat(username) {
    this.utils.startChat(username);
  }

  async freelancerAcceptTask() {
    const freelancerAcceptedTask = await this.marketplaceService.freelancerAcceptMainMarketplaceRequest(this.mainMarketplaceTask.id)
      .then((res: string) => res)
      .catch((err: any) => err.error.message);
    this.utils.presentToast(freelancerAcceptedTask)
      .then(() => this.events.publish('task-action', TaskActions.FREELANCER_ACCEPT_TASK, this.mainMarketplaceTask.id));
  }

  async freelancerWithdrawTask() {
    const freelancerWithdrawTask = await this.marketplaceService.freelancerWithdrawMainMarketplaceRequest(this.mainMarketplaceTask.id)
      .then((res: string) => res)
      .catch((err: any) => err.error.message);
    this.utils.presentToast(freelancerWithdrawTask)
      .then(() => this.events.publish('task-action', TaskActions.FREELANCER_WITHDRAW_TASK, this.mainMarketplaceTask.id));
  }

  async freelancerArriveTask() {
    const freelancerArriveTask = await this.marketplaceService.freelancerArrivedAtTaskSite(this.mainMarketplaceTask.id)
      .then((res: string) => res)
      .catch((err: any) => err.error.message);
    this.utils.presentToast(freelancerArriveTask)
      .then(() => this.events.publish('task-action', TaskActions.FREELANCER_ARRIVE_TASK, this.mainMarketplaceTask.id));
  }

  async customerCancelTask() {
    const cancelTask = await this.marketplaceService.customerCancelMainMarketplaceRequest(this.mainMarketplaceTask.id)
      .then((res: string) => res)
      .catch((err: any) => err.error.message);
    this.utils.presentToast(cancelTask)
      .then(() => {
        this.events.publish('task-action', TaskActions.CUSTOMER_CANCEL_TASK, this.mainMarketplaceTask.id);
        this.navCtrl.back();
      });
  }

  async customerAcceptFreelancer(freelancerID: number) {
    const customerApproveFreelancer = await this.marketplaceService.customerAcceptFreelancer(this.mainMarketplaceTask.id, freelancerID)
      .then((res: string) => res)
      .catch((err: any) => err.error.message);
    this.utils.presentToast(customerApproveFreelancer)
      .then(() => this.events.publish('task-action', TaskActions.CUSTOMER_ACCEPT_FREELANCER, this.mainMarketplaceTask.id));
  }

  async customerRejectFreelancer(freelancerID: number) {
    const customerDenyFreelancer = await this.marketplaceService.customerDenyFreelancer(this.mainMarketplaceTask.id, freelancerID)
      .then((res: string) => res)
      .catch((err: any) => err.error.message);
    this.utils.presentToast(customerDenyFreelancer)
      .then(() => this.events.publish('task-action', TaskActions.FREELANCER_ACCEPT_TASK, this.mainMarketplaceTask.id));
  }

  async openCompleteTaskModal(isFreelancer: boolean) {
    const modal = await this.modalCtrl.create({
      component: CompleteTaskPage,
      componentProps: {taskID: this.mainMarketplaceTask.id, isFreelancer},
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });

    await modal.present();
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

  async editTaskRequest(task: MainMarketplaceTask) {
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
      await loadingPage.dismiss();
    });

    await modal.present()
      .then(() => {
        this.events.publish('task-edit', task);
        return loadingRequestPage.dismiss();
      });
  }

  async doRefresh(event?) {
    setTimeout(() => {
      this.marketplaceService.getSingleMainMarketplaceRequest(this.taskID)
        .then((task: MainMarketplaceTask) => {
          this.mainMarketplaceTask = task;
          this.taskStatusDisplay = (this.mainMarketplaceTask.status === 'Paid') ? 'Freelancer En-Route' : this.mainMarketplaceTask.status;
          this.storage.get(StorageKeys.PROFILE)
            .then(prof => {
              this.userRole = prof.user.role;
              this.isOwner = prof.user_id === task.customer_id;
              this.isFreelancer = (this.userRole === Role.VERIFIED_FREELANCER)
                ? this.marketplaceService.checkIsTaskFreelancer(prof.user_id, this.mainMarketplaceTask)
                : false;
            });
        });
      if (event) {
        event.target.complete();
      }
    }, 1000);
  }

  openLocation() {
   const locationAddress = this.mainMarketplaceTask.locations[0].street_address + ', '
      + this.mainMarketplaceTask.locations[0].city + ', '
      + this.mainMarketplaceTask.locations[0].state + ', '
      + this.mainMarketplaceTask.locations[0].zip;

   const options: LaunchNavigatorOptions = {};

   this.launchNavigator.navigate(locationAddress, options)
      .then(success => {})
      .catch(error => window.open('https://maps.google.com/?q=' + locationAddress));
  }

  navigateBack() {
    const prevRoute = this.previousRoute.getPreviousUrl();
    this.navCtrl.navigateBack((prevRoute) ? prevRoute : 'app/tabs/marketplace');
  }
}
