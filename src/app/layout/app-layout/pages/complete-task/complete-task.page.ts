import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {MarketplaceService} from '../../../../utils/services/marketplace.service';
import {TaskAction, TaskStatus} from '../../../../providers/constants';
import {Events} from '../../../../utils/services/events';
import {UtilsService} from '../../../../utils/services/utils.service';

@Component({
  selector: 'complete-task',
  templateUrl: './complete-task.page.html',
  styleUrls: ['./complete-task.page.scss'],
})
export class CompleteTaskPage {
  @Input() taskID: number;
  @Input() isFreelancer: boolean;
  rate: number;
  description: string;

  constructor(private modalCtrl: ModalController,
              private marketplaceService: MarketplaceService,
              private toastCtrl: ToastController,
              private utils: UtilsService,
              private events: Events) { }

  freelancerCompleteTask() {
    this.marketplaceService.freelancerCompleteTask(this.taskID, {rating: this.rate, review: this.description})
      .then(() => this.closeCompleteTaskPage());
  }

  customerCompleteTask() {
    this.marketplaceService.customerCompleteTask(this.taskID, {rating: this.rate, review: this.description})
      .then(() => this.closeCompleteTaskPage());
  }

  closeCompleteTaskPage() {
    this.modalCtrl.dismiss();
  }
}
