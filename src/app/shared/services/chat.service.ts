import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageChat } from '../models/messageChat';
import { MessageEvent } from '../models/messageEvent';
import { RoomChat } from '../models/roomChat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http: HttpClient
  ) { }

  public getRoomChat(user1: string, user2: string) {
    return this.http.get<RoomChat>('/api/chat/getRoomChat', {
      params: {
        user1: user1,
        user2: user2
      }
    })
  }

  public getMessages(eventId: string): Observable<Array<MessageEvent>> {
    return this.http.get<Array<MessageEvent>>('/api/event/getMessages', {
      params: {
        eventId: eventId
      }
    });
  }
}
