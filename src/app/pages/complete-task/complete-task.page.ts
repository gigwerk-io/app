import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {MarketplaceService} from '../../utils/services/marketplace.service';
import {TaskActions, TaskStatus} from '../../providers/constants';
import {Events} from '../../utils/services/events';

@Component({
  selector: 'complete-task',
  templateUrl: './complete-task.page.html',
  styleUrls: ['./complete-task.page.scss'],
})
export class CompleteTaskPage implements OnInit {
  @Input() taskID: number;
  @Input() isFreelancer: boolean;
  rate: number;
  description: string;

  constructor(private modalCtrl: ModalController,
              private marketplaceService: MarketplaceService,
              private toastCtrl: ToastController,
              private events: Events) { }

  ngOnInit() {}

  async presentToast(message) {
    return await this.toastCtrl.create({
      message,
      position: 'top',
      duration: 2500,
      color: 'dark',
      buttons: [
        {
          text: 'Done',
          role: 'cancel'
        }
      ]
    }).then(toast => {
      toast.present();
    });
  }

  async freelancerCompleteTask() {
    // tslint:disable-next-line
    const freelancerCompleteTask = await this.marketplaceService.freelancerCompleteTask(this.taskID, {rating: this.rate, review: this.description})
      .then((res: string) => res)
      .catch((err: any) => err.error.message);
    this.presentToast(freelancerCompleteTask)
      .then(() => {
        this.closeCompleteTaskPage();
        this.events.publish('task-action', TaskActions.FREELANCER_COMPLETE_TASK, this.taskID);
      });
  }

  async customerCompleteTask() {
    // tslint:disable-next-line
    const customerCompleteTask = await this.marketplaceService.customerCompleteTask(this.taskID, {rating: this.rate, review: this.description})
      .then((res: string) => res)
      .catch((err: any) => err.error.message);
    this.presentToast(customerCompleteTask)
      .then(() => {
        this.closeCompleteTaskPage();
        this.events.publish('task-action', TaskActions.CUSTOMER_COMPLETE_TASK, this.taskID);
      });
  }

  closeCompleteTaskPage() {
    this.modalCtrl.dismiss();
  }
}
