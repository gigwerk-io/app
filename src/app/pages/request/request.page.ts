import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  ActionSheetController, AlertController,
  Events,
  IonContent,
  IonSlides, LoadingController,
  ModalController,
  NavController,
  Platform,
  ToastController
} from '@ionic/angular';
import {MainCategory} from '../../utils/interfaces/main-marketplace/main-category';
import {MainMarketplaceTask} from '../../utils/interfaces/main-marketplace/main-marketplace-task';
import {State} from '../../utils/interfaces/locations/state';
import {STATES} from '../../utils/mocks/states.mock';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {Camera} from '@ionic-native/camera/ngx';
import {MarketplaceService} from '../../utils/services/marketplace.service';
import {Router} from '@angular/router';
import {LocationAddress} from '../../utils/interfaces/settings/preferences';
import {PreferencesService} from '../../utils/services/preferences.service';
import {PreviousRouteService} from '../../providers/previous-route.service';
import {TaskActions} from '../../providers/constants';
import {FavrDataService} from '../../utils/services/favr-data.service';
import {PageStack} from '../signup/signup';
import {FinanceService} from '../../utils/services/finance.service';

@Component({
  selector: 'request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss']
})
export class RequestPage implements OnInit, OnDestroy {
  @Input() isModal = false;
  @ViewChild(IonSlides, {static: false}) slides: IonSlides;
  @ViewChild(IonContent, {static: false}) content: IonContent;
  @ViewChild('file', {static: false}) file: ElementRef;

  isMobileOnly: boolean;
  taskRequest: MainMarketplaceTask = {
    description: undefined,
    freelancer_count: 1,
    date: undefined,
    street_address: undefined,
    city: undefined,
    state: undefined,
    zip: undefined,
    category_id: undefined,
    intensity: undefined,
    price: undefined,
    image_one: undefined,
    image_two: undefined,
    image_three: undefined
  };
  taskImages = {
    image_one: undefined,
    image_two: undefined,
    image_three: undefined
  };
  isMobileWebOrDesktop = false;
  isTaskEdit = false;

  minYear: number = (new Date()).getFullYear();
  maxYear: number = this.minYear + 1;

  categories: MainCategory[];
  pageTitle = 'Request';
  states: State[] = STATES;
  progress = 0;
  submitted = false;
  locations: LocationAddress[] = [];
  subPage = 'request-index';
  subPageTitle = 'Request';
  pageStack: PageStack[] = [
    {
      pageTitle: 'Request',
      page: 'request-index'
    }
  ];
  backPage: string;
  credit: number;

  constructor(private modalCtrl: ModalController,
              private imagePicker: ImagePicker,
              private camera: Camera,
              private marketplaceService: MarketplaceService,
              private toastController: ToastController,
              private router: Router,
              private events: Events,
              private preferences: PreferencesService,
              private actionSheetCtrl: ActionSheetController,
              private previousRoute: PreviousRouteService,
              private navCtrl: NavController,
              public platform: Platform,
              private favrService: FavrDataService,
              private financeService: FinanceService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {
    this.favrService.getCategories().subscribe(res => {
      this.categories = res.categories;
    });
    this.events.subscribe('task-edit', (taskRequest: MainMarketplaceTask) => {
      if (taskRequest) {
        this.isTaskEdit = true;
        this.taskRequest = taskRequest;
        this.taskRequest.date = taskRequest.isoFormat;
        taskRequest.locations.forEach((location) => {
          this.taskRequest.street_address = location.street_address;
          this.taskRequest.city = location.city;
          this.taskRequest.state = location.state;
          this.taskRequest.zip = location.zip;
        });

        this.taskImages.image_one = taskRequest.image_one;
        this.taskImages.image_two = taskRequest.image_two;
        this.taskImages.image_three = taskRequest.image_three;
      }
    });
  }

  ngOnInit() {
    if  (this.platform.is('mobileweb') || this.platform.is('desktop') || this.platform.is('pwa')) {
      this.isMobileWebOrDesktop = true;
    }
    this.isMobileOnly = this.platform.is('android') || this.platform.is('ios');
    this.getLocations();
    this.getCreditBalance();
  }

  ngOnDestroy(): void {
    this.events.unsubscribe('task-edit');
  }

  getCreditBalance() {
    this.financeService.getCreditBalance().then(res => {
      this.credit = parseInt(res.credit.toString().replace('$', ''), 10);
    });
  }

  async alertConfirmClose() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      // tslint:disable-next-line:max-line-length
      message: 'You are about to <strong>close</strong> the request process while in the middle of your task request. Your request will <strong>NOT be saved</strong>.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Yes, close',
          handler: () => {
            this.closeRequestPage();
          }
        }
      ]
    });

    await alert.present();
  }

  async closeRequestPage(): Promise<boolean> {
    return await this.modalCtrl.dismiss();
  }

  getLocations() {
    this.preferences.getMyLocations().subscribe(res => {
      this.locations = res.locations;
    });
  }

  async presentActionSheet(location?: LocationAddress) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Set Location',
      buttons: [{
        text: 'Use Location',
        icon: 'checkmark',
        handler: () => {
          this.taskRequest.street_address = location.street_address;
          this.taskRequest.city = location.city;
          this.taskRequest.state = location.state;
          this.taskRequest.zip = location.zip;

          this.presentToast('Location set!');
        }
      }, {
        text: 'Remove',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.preferences.deleteLocation(location.id).subscribe(res => {
            this.getLocations();
            this.presentToast(res.message);
          });
        }
      }, {
        text: 'Close',
        role: 'cancel',
        handler: () => {}
      }]
    });
    await actionSheet.present();
  }

  onSlideChange() {
    this.content.scrollToTop(500);
  }

  selectCategory(category: MainCategory) {
    this.taskRequest.category_id = category.id;
    setTimeout(() => {
      this.updateProgress();
      this.openSubPage('task-information');
    }, 500);
  }

  onTextboxChange() {
    this.updateProgress();
  }

  updateProgress() {
    this.progress = setProgress([
      this.taskRequest.category_id,
      this.taskRequest.description,
      this.taskRequest.date,
      this.taskRequest.description,
      this.taskRequest.street_address,
      this.taskRequest.city,
      this.taskRequest.state,
      this.taskRequest.zip,
      this.taskRequest.intensity,
      (this.taskRequest.price >= 5) ? this.taskRequest.price : this.taskRequest.id
    ]);
  }

  async onSubmitTaskRequest() {
    this.submitted = true;

    const loadingPage = await this.loadingCtrl.create({
      message: 'Please wait...',
      translucent: true
    });

    await loadingPage.present();

    if (this.progress === 1) {
      this.marketplaceService.createMainMarketplaceRequest(this.taskRequest)
        .then((res) => {
          this.closeRequestPage()
            .then(() => {
              this.presentToast(res);
              if (this.previousRoute.getCurrentUrl() !== '/app/tabs/marketplace') {
                this.router.navigateByUrl('app/tabs/marketplace');
              }
            });
          loadingPage.dismiss();
        })
        .catch(error => {
          this.closeRequestPage()
            .then(() => {
              this.router.navigateByUrl('app/set-up-payments')
                .then(() => {
                  this.events.publish('task-request', this.taskRequest);
                  this.presentToast(error.error.message);
                });
            });
          loadingPage.dismiss();
        });
    }
  }

  setDifficulty(intensity: string) {
    this.taskRequest.intensity = intensity;
    this.updateProgress();
  }

  async presentToast(message) {
    await this.toastController.create({
      message: message,
      position: 'top',
      duration: 2500,
      color: 'dark',
      showCloseButton: true
    }).then(toast => {
      toast.present();
    });
  }

  async onUpdateTaskRequest() {
    this.submitted = true;

    const loadingPage = await this.loadingCtrl.create({
      message: 'Please wait...',
      translucent: true
    });

    await loadingPage.present();

    this.marketplaceService.editMainMarketplaceRequest(this.taskRequest)
      .then((res) => {
        this.closeRequestPage();
        this.presentToast(res);
        this.navCtrl.navigateBack(`app/marketplace-detail/${this.taskRequest.id}`);
        this.events.publish('task-action', TaskActions.CUSTOMER_UPDATE_TASK);
        loadingPage.dismiss();
      })
      .catch(error => {
        this.closeRequestPage();
        this.presentToast(error.error.message);
        loadingPage.dismiss();
      });
  }

  goBack() {
    this.pageStack.pop(); // remove current page
    const prevPage = this.pageStack[this.pageStack.length - 1];
    this.backPage = prevPage.page;
    this.subPage = prevPage.page;
    this.subPageTitle = prevPage.pageTitle;
  }

  openSubPage(page: string) {
    switch (page) {
      case 'select-category':
        this.subPageTitle = 'Select Category';
        break;
      case 'task-information':
        this.subPageTitle = 'Task Information';
        break;
      case 'location':
        this.subPageTitle = 'Location';
        break;
      case 'attach-images':
        this.subPageTitle = 'Attach Images';
        break;
      case 'task-intensity':
        this.subPageTitle = 'Task Difficulty';
        break;
      case 'set-price':
        this.subPageTitle = 'Set Price';
        break;
    }
    this.pageStack.push({pageTitle: this.subPageTitle, page: page});
    this.subPage = page;
    this.backPage = this.pageStack[this.pageStack.length - 2].page;
  }

  removeImage(index: number) {
    this.file.nativeElement.value = '';
    switch (index) {
      case 0:
        this.taskImages.image_one = undefined;
        this.taskRequest.image_one = undefined;
        break;
      case 1:
        this.taskImages.image_two = undefined;
        this.taskRequest.image_two = undefined;
        break;
      case 2:
        this.taskImages.image_three = undefined;
        this.taskRequest.image_three = undefined;
        break;
    }
  }

  uploadImage(event: any) {
    if (event.target.files) {
      if (event.target.files[0]) {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent) => {
          this.taskImages.image_one = (<FileReader>e.target).result;
          this.taskRequest.image_one = (<FileReader>e.target).result.toString().split(',')[1];
        };
        reader.readAsDataURL(event.target.files[0]);
      }

      if (event.target.files[1]) {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent) => {
          this.taskImages.image_two = (<FileReader>e.target).result;
          this.taskRequest.image_two = (<FileReader>e.target).result.toString().split(',')[1];
        };
        reader.readAsDataURL(event.target.files[1]);
      }

      if (event.target.files[2]) {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent) => {
          this.taskImages.image_three = (<FileReader>e.target).result;
          this.taskRequest.image_three = (<FileReader>e.target).result.toString().split(',')[1];
        };
        reader.readAsDataURL(event.target.files[2]);
      }
    }
  }
}

export function setProgress(formFields: any[], initProgress: number = 0): number {
  const progressRatio: number = (1  / formFields.length);
  const fields: number[] = formFields.map((field) => (field) ? progressRatio : 0);
  const progress: number = initProgress + fields.reduce((totalProgress, currProgress) => totalProgress + currProgress);
  return (progress < 0.999) ? progress : 1;
}
