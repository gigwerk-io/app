import { Component, OnInit } from '@angular/core';
import {Storage} from '@ionic/storage';
import {StorageKeys} from '../../../../providers/constants';
import {PreferencesService} from '../../../../utils/services/preferences.service';
import {ProfileService} from '../../../../utils/services/profile.service';
import {UtilsService} from '../../../../utils/services/utils.service';

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
              private utils: UtilsService,
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
        this.storage.set(StorageKeys.PROFILE, result.data.user).then(response => {
          this.utils.presentToast('<strong>Success</strong> Your profile has been updated.', 'success');
        });
      });
    }).catch(err => {
      this.utils.presentToast('<strong>Error!</strong> An error has occurred while updating your profile', 'danger');
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
