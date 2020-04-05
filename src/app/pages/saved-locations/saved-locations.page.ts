import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PreferencesService} from '../../utils/services/preferences.service';
import {LocationAddress} from '../../utils/interfaces/settings/preferences';
import {ActionSheetController, ToastController} from '@ionic/angular';

@Component({
  selector: 'saved-locations',
  templateUrl: './saved-locations.page.html',
  styleUrls: ['./saved-locations.page.scss'],
})
export class SavedLocationsPage implements OnInit {

  locations: LocationAddress[] = [];
  constructor(private preferences: PreferencesService,
              public actionSheetCtrl: ActionSheetController,
              private toastCtrl: ToastController) { }

  ngOnInit() {
    this.getLocations();
  }

  async presentActionSheet(id) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Manage Locations',
      buttons: [{
        text: 'Make Default',
        icon: 'checkmark',
        handler: () => {
          this.preferences.makeDefaultLocation(id).then(res => {
            this.getLocations();
            this.presentToast(res.message);
          });
        }
      }, {
        text: 'Remove',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.preferences.deleteLocation(id).then(res => {
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

  async presentToast(message) {
    await this.toastCtrl.create({
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

  getLocations() {
    this.preferences.getMyLocations().then(res => this.locations = res.locations );
  }

  async doRefresh(event?) {
    setTimeout(() => {
      this.getLocations();

      if (event) {
        if (event.target) {
          event.target.complete();
        }
      }
    }, 1000);
  }
}
