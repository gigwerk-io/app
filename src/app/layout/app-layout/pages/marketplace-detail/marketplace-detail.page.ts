import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonRouterOutlet,
  LoadingController,
  ModalController,
  NavController
} from '@ionic/angular';
import {MainMarketplaceTask} from '../../../../utils/interfaces/main-marketplace/main-marketplace-task';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {ActivatedRoute, Router} from '@angular/router';
import {MarketplaceService} from '../../../../utils/services/marketplace.service';
import {Storage} from '@ionic/storage';
import {Role, StorageKeys, TaskAction, TaskStatus} from '../../../../providers/constants';
import {Events} from '../../../../utils/services/events';
import {CompleteTaskPage} from '../complete-task/complete-task.page';
import {LaunchNavigator, LaunchNavigatorOptions} from '@ionic-native/launch-navigator/ngx';
import {ReportPage} from '../report/report.page';
import {FavrDataService} from '../../../../utils/services/favr-data.service';
import {RequestPage} from '../request/request.page';
import {FinanceService} from '../../../../utils/services/finance.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {MainCategory} from '../../../../utils/interfaces/main-marketplace/main-category';
import {Subscription} from 'rxjs';
import {UtilsService} from '../../../../utils/services/utils.service';
import {PreviousRouteService} from '../../../../providers/previous-route.service';
import {GenericResponse} from '../../../../utils/interfaces/searchable';

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

  Role = Role;
  TaskStatus = TaskStatus;
  TaskAction = TaskAction;

  categories: MainCategory[];
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
              private utils: UtilsService) { }

  ngOnInit() {
    this.favrService.getCategories().then(res => this.categories = res.data);
    this.geolocation.getCurrentPosition().then(res => {
      const coords = {lat: res.coords.latitude, long: res.coords.longitude};
      // Get job details with location
      this.getJobDetails(coords);
    }).catch(err => this.getJobDetails());
    this.getCreditBalance();
    this.events.subscribe('task-action', (action) => {
      console.log(action);
      this.doRefresh();
    });
  }


  ngOnDestroy() {
    this.activatedRouteSub.unsubscribe();
    this.events.unsubscribe('task-action');
  }

  getJobDetails(coords?: any) {
    this.activatedRouteSub = this.activatedRoute.paramMap.subscribe(data => {
      this.taskID = parseInt(data.get('id'), 10);
      this.marketplaceService.getSingleMainMarketplaceRequest(this.taskID, coords)
        .then((res) => {
          console.log(res);
          this.mainMarketplaceTask = res.data;
          this.taskStatusDisplay = (this.mainMarketplaceTask.status === TaskStatus.PAID)
            ? 'Freelancer En-Route'
            : this.mainMarketplaceTask.status;
          this.storage.get(StorageKeys.PROFILE)
            .then(prof => {
              this.userRole = prof.user.role;
              this.isOwner = prof.user_id === this.mainMarketplaceTask.customer_id;
              this.isFreelancer = (this.userRole === Role.VERIFIED_FREELANCER)
                ? this.marketplaceService.checkIsTaskFreelancer(prof.user_id, this.mainMarketplaceTask)
                : false;
            });
        });
    });
  }

  getCreditBalance() {
    this.financeService.getCreditBalance().then(res => {
      this.credit = parseInt(res.data.credit.toString().replace('$', ''), 10);
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

  freelancerAcceptTask() {
    this.marketplaceService.freelancerAcceptMainMarketplaceRequest(this.mainMarketplaceTask.id);
  }

  freelancerWithdrawTask(): Promise<GenericResponse> {
    return this.marketplaceService.freelancerWithdrawMainMarketplaceRequest(this.mainMarketplaceTask.id);
  }

  freelancerArriveTask() {
    this.marketplaceService.freelancerArrivedAtTaskSite(this.mainMarketplaceTask.id);
  }

  customerCancelTask() {
    this.marketplaceService.customerCancelMainMarketplaceRequest(this.mainMarketplaceTask.id)
      .then(() => this.navCtrl.back());
  }

  customerAcceptFreelancer(freelancerID: number) {
    this.marketplaceService.customerAcceptFreelancer(this.mainMarketplaceTask.id, freelancerID);
  }

  customerRejectFreelancer(freelancerID: number) {
    this.marketplaceService.customerDenyFreelancer(this.mainMarketplaceTask.id, freelancerID);
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

  async editTaskRequest(task: MainMarketplaceTask) {
    const requestPageModal = await this.modalCtrl.create({
      component: RequestPage,
      componentProps: {isModal: true},
      swipeToClose: false,
      presentingElement: this.routerOutlet.nativeEl
    });

    await requestPageModal.present()
      .then(() => this.events.publish('task-edit', task));
  }

  async doRefresh(event?) {
    setTimeout(() => {
      this.geolocation.getCurrentPosition().then(res => {
        const coords = {lat: res.coords.latitude, long: res.coords.longitude};
        // Get job details with location
        this.getJobDetails(coords);
      }).catch(err => this.getJobDetails());
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
      .catch(error => window.open('https://maps.google.com/?q=' + locationAddress));
  }

  navigateBack() {
    const prevRoute = this.previousRoute.getPreviousUrl();
    this.navCtrl.navigateBack((prevRoute) ? prevRoute : 'app/tabs/marketplace');
  }
}
