import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { HttpClient} from '@angular/common/http';
import {from} from 'rxjs';
import {Storage} from '@ionic/storage';
import {CreateChatResponse, Room} from '../interfaces/chat/room';
import {RESTService} from './rest.service';
import { Response } from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends RESTService {
  constructor(public http: HttpClient, public storage: Storage) {
    super(http, storage);
  }

  public getChatRooms(): Promise<Response<Room[]>>{
    return this.makeHttpRequest<Response<Room[]>>('rooms', 'GET')
      .then(httpRes => httpRes.toPromise().then((res: Response<Room[]>) => res));
  }

  public getChatRoom(uuid): Observable<Response<Room>> {
    return from(
      this.makeHttpRequest<Response<Room>>(`room/${uuid}`, 'GET')
        .then(httpRes => httpRes.toPromise().then((res: Response<Room>) => res))
    );
  }
  // public getChatRoom(uuid): Observable<Room> {
  //   return from(
  //     this.makeHttpRequest<Room>(`room/${uuid}`, 'GET')
  //       .then(httpRes => httpRes.toPromise().then((res: Room) => res))
  //   );
  // }

  public sendMessage(uuid, text) {
    return from(
      this.makeHttpRequest(`message/${uuid}`, 'POST', {message: text})
        .then(httpRes => httpRes.toPromise().then(res => res))
    );
  }

  public startChat(username): Promise<CreateChatResponse> {
    return this.makeHttpRequest<CreateChatResponse>(`chat/${username}`, 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }
}
