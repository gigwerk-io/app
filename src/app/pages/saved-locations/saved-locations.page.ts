import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PreferencesService} from '../../utils/services/preferences.service';
import {LocationAddress, MyLocationsResponse} from '../../utils/interfaces/settings/preferences';
import {ActionSheetController, ToastController} from '@ionic/angular';
import {UtilsService} from '../../utils/services/utils.service';
import { Response } from '../../utils/interfaces/response';

@Component({
  selector: 'saved-locations',
  templateUrl: './saved-locations.page.html',
  styleUrls: ['./saved-locations.page.scss'],
})
export class SavedLocationsPage implements OnInit {

  locations: LocationAddress[] = [];
  constructor(private preferences: PreferencesService,
              private actionSheetCtrl: ActionSheetController,
              private utils: UtilsService) { }

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
            this.utils.presentToast('<strong>Success!</strong> Location is now default.', 'success');
          }).catch(error => this.utils.presentToast(error.message, 'danger'));
        }
      }, {
        text: 'Remove',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.preferences.deleteLocation(id).then(res => {
            this.getLocations();
            this.utils.presentToast('<strong>Success!</strong> Location is now deleted.', 'success');
          }).catch(error => this.utils.presentToast(error.message, 'danger'));
        }
      }, {
        text: 'Close',
        role: 'cancel',
        handler: () => {}
      }]
    });
    await actionSheet.present();
  }

  getLocations() {
    this.preferences.getMyLocations().then((res: Response<LocationAddress[]>) => {
      this.locations = res.data;
    } );
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
