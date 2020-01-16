import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {API_ADDRESS, StorageKeys} from '../../providers/constants';
import {from} from 'rxjs/index';
import {Storage} from '@ionic/storage';
import {AuthorizationToken} from '../interfaces/user-options';
import {CreateChatResponse, Room} from '../interfaces/chat/room';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient, private storage: Storage) { }

  public getChatRooms(): Observable<Room[]> {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.http.get<Room[]>(API_ADDRESS + '/rooms', authHeader)
            .toPromise()
            .then((res: Room[]) => res);
        })
    );
  }

  public getChatRoom(uuid): Observable<Room> {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.http.get<Room>(`${API_ADDRESS}/room/${uuid}`, authHeader)
            .toPromise()
            .then((res: Room) => res);
        })
    );
  }

  public sendMessage(uuid, text) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.http.post(`${API_ADDRESS}/message/${uuid}`, { message: text }, authHeader)
            .toPromise()
            .then((res) => res);
        })
    );
  }

  public startChat(username) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.http.get<CreateChatResponse>(`${API_ADDRESS}/chat/${username}`, authHeader)
            .toPromise()
            .then((res) => res);
        })
    );
  }
}
