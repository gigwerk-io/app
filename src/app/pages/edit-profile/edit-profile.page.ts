import { Component, OnInit } from '@angular/core';
import {Storage} from '@ionic/storage';
import {StorageKeys} from '../../providers/constants';
import {PreferencesService} from '../../utils/services/preferences.service';
import {ToastController} from '@ionic/angular';
import {ProfileService} from '../../utils/services/profile.service';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  firstName;
  lastName;
  username;
  email;
  phone;
  description;
  birthday;
  image;
  userId;
  newImage = false;

  constructor(private storage: Storage,
              private preferences: PreferencesService,
              private toastController: ToastController,
              private profileService: ProfileService) { }

  ngOnInit() {
    this.getProfileInfo();
  }

  getProfileInfo() {
    this.storage.get(StorageKeys.PROFILE).then(profile => {
      this.firstName = profile.user.first_name;
      this.lastName = profile.user.last_name;
      this.username = profile.user.username;
      this.phone = profile.user.phone;
      this.description = profile.description;
      this.email = profile.user.email;
      this.birthday = profile.user.birthday;
      this.image = profile.image;
      this.userId = profile.user_id;
    });
  }


  updateProfileInfo() {
    const body: any = {
      description: this.description,
      email: this.email,
      phone: this.phone,
      first_name: this.firstName,
      last_name: this.lastName,
      birthday: this.birthday,
    };
    if (this.newImage) {
      body.image = this.image;
    }
    this.preferences.updateProfile(body).then(res => {
      // Get Update Profile Info
      this.profileService.getProfile(this.userId).then(result => {
        // Update Storage Info
        this.storage.set(StorageKeys.PROFILE, result.user).then(response => {
          this.presentToast('Your profile has been updated.');
        });
      });
    }).catch(err => {
      this.presentToast('An error has occurred while updating your profile');
    });
  }

  async presentToast(message) {
    await this.toastController.create({
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

  uploadImage(event: any) {
    this.newImage = true;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent) => {
        this.image = (e.target as FileReader).result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
