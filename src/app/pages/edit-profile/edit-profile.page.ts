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
  first_name;
  last_name;
  username;
  email;
  phone;
  description;
  birthday;
  image;
  user_id;
  new_image = false;

  constructor(private storage: Storage,
              private preferences: PreferencesService,
              private toastController: ToastController,
              private profileService: ProfileService) { }

  ngOnInit() {
    this.getProfileInfo();
  }

  getProfileInfo() {
    this.storage.get(StorageKeys.PROFILE).then(profile => {
      this.first_name = profile.user.first_name;
      this.last_name = profile.user.last_name;
      this.username = profile.user.username;
      this.phone = profile.user.phone;
      this.description = profile.description;
      this.email = profile.user.email;
      this.birthday = profile.user.birthday;
      this.image = profile.image;
      this.user_id = profile.user_id;
    });
  }


  updateProfileInfo() {
    const body = {
      description: this.description,
      email: this.email,
      phone: this.phone,
      first_name: this.first_name,
      last_name: this.last_name,
      birthday: this.birthday
    };
    if (this.new_image) {
      body['image'] = this.image.split(',')[1];
    }
    this.preferences.updateProfile(body).subscribe(res => {
      // Get Update Profile Info
      this.profileService.getProfile(this.user_id).subscribe(result => {
        // Update Storage Info
        this.storage.set(StorageKeys.PROFILE, result.user).then(response => {
          this.presentToast(res.message);
        });
      });
    });
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

  uploadImage(event: any) {
    this.new_image = true;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent) => {
        this.image = (<FileReader>e.target).result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
