import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {Storage} from '@ionic/storage';
import {AuthResponse, SignOutResponse, ValidateTokenResponse} from '../interfaces/auth/auth-response';
import {AuthorizationToken, UserOptions, UserRegistrationOptions} from '../interfaces/user-options';
import {API_ADDRESS, StorageKeys} from '../../providers/constants';
import {RESTService} from './rest.service';
import {UtilsService} from './utils.service';
import {NavController} from '@ionic/angular';
import {PushNotificationService} from './push-notification.service';
import {Device, DeviceInfo} from '@capacitor/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends RESTService {
  authSubject = new BehaviorSubject(false);

  constructor(
    public httpClient: HttpClient,
    public storage: Storage,
    private utils: UtilsService,
    private navCtrl: NavController,
    private router: Router,
    private pushNotificationService: PushNotificationService
  ) {
    super(httpClient, storage);
  }

  register(user: UserRegistrationOptions): Promise<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${API_ADDRESS}/register`, user).pipe(
      tap(async (res: AuthResponse) => {

        if (res) {
          await this.storage.set(StorageKeys.ACCESS_TOKEN, res.data.token);
          this.authSubject.next(true);
        }
      })
    ).toPromise();
  }

  login(user: UserOptions): Promise<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${API_ADDRESS}/login`, user)
      .toPromise()
      .then((res: AuthResponse) => {
        this.storage.set(StorageKeys.ACCESS_TOKEN, res.data.token);
        this.storage.set(StorageKeys.PROFILE, res.data.profile)
          .then(() => {
            if (res.success) {
              this.pushNotificationService.registerPushNotifications();
              Device.getInfo().then((device: DeviceInfo) => {
                if (device.operatingSystem === 'ios'
                  || device.operatingSystem === 'android') {
                  this.navCtrl.navigateRoot('/app/tabs/marketplace');
                } else {
                  this.router.navigateByUrl('/main/marketplace');
                }
              });
            }
          });
        this.authSubject.next(true);
        return res;
      })
      .catch((error: HttpErrorResponse) => {
        console.log(error);
        if (error.error) {
          this.utils.presentToast(error.error.message, 'danger');
        }

        return {success: false};
      });
  }

  logout(): Promise<SignOutResponse> {
    return this.makeHttpRequest<SignOutResponse>(`/logout`, 'GET')
      .then(httpRes => httpRes
        .toPromise()
        .then((res: SignOutResponse) => {
          console.log(res);
          if (res.success) {
            this.utils.presentToast('You have been logged out.', 'success');
            this.storage.remove(StorageKeys.PROFILE);
            this.storage.remove(StorageKeys.ACCESS_TOKEN);
            this.authSubject.next(false);
          }
          return res;
        }));
  }

  isLoggedIn() {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => token !== null)
      .catch(() => false);
  }

  isValidToken(): Promise<ValidateTokenResponse> {
    return this.makeHttpRequest<ValidateTokenResponse>('validate', 'GET')
      .then(httpRes => httpRes.toPromise().then(res => {
        if (!res.data.validToken) {
          this.authSubject.next(false);
          this.logout()
            .then(logOutRes => {
              if (logOutRes.success) {
                Device.getInfo().then((device: DeviceInfo) => {
                  if (device.operatingSystem === 'ios'
                    || device.operatingSystem === 'android') {
                    this.navCtrl.navigateRoot('/app/login');
                  } else {
                    this.router.navigateByUrl('/login');
                  }
                });
              }
            });
        }

        return res;
      }).catch((error: HttpErrorResponse) => {
        console.log(error);
        if (error.error) {
          this.utils.presentToast(error.error.message, 'danger');
        }

        return {success: false};
      }));
  }

  forgotPassword(email): Promise<SignOutResponse> {
    return this.httpClient.post<SignOutResponse>(`${API_ADDRESS}/forgot-password`, {email}).toPromise();
  }
}
