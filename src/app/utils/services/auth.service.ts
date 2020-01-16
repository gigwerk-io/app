import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import {AuthResponse, SignOutResponse, ValidateTokenResponse} from '../interfaces/auth/auth-response';
import {AuthorizationToken, UserOptions, UserRegistrationOptions} from '../interfaces/user-options';
import {API_ADDRESS, StorageKeys} from '../../providers/constants';
import {from} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authSubject  =  new  BehaviorSubject(false);

  constructor(private  httpClient:  HttpClient,
              private  storage:  Storage) { }

  register(user: UserRegistrationOptions): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${API_ADDRESS}/register`, user).pipe(
      tap(async (res:  AuthResponse ) => {

        if (res) {
          await this.storage.set(StorageKeys.ACCESS_TOKEN, res.token);
          this.authSubject.next(true);
        }
      })
    );
  }

  login(user: UserOptions): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${API_ADDRESS}/login`, user).pipe(
      tap(async (res: AuthResponse) => {
        if (res) {
          await this.storage.set(StorageKeys.ACCESS_TOKEN, res.token);
          await this.storage.set(StorageKeys.PROFILE, res.profile);
          this.authSubject.next(true);
        }
      })
    );
  }

  logout(token: AuthorizationToken): Observable<SignOutResponse> {
    return this.httpClient.get<SignOutResponse>(`${API_ADDRESS}/logout`, token).pipe(
      tap(async (res: SignOutResponse) => {
        if (res) {
          this.storage.remove(StorageKeys.PROFILE);
          this.storage.remove(StorageKeys.ACCESS_TOKEN);
          this.authSubject.next(false);
        }
      })
    );
  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }

  isValidToken() {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<ValidateTokenResponse>(API_ADDRESS + '/validate', authHeader)
            .toPromise()
            .then((res) => res);
        })
    );
  }

  forgotPassword(email): Observable<SignOutResponse> {
    return this.httpClient.post<SignOutResponse>(`${API_ADDRESS}/forgot-password`, {email: email});
  }
}
