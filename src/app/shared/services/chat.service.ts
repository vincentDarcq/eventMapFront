import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageChat } from '../models/messageChat';
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

  public initChat(roomName: string) {
    return this.http.get<String>('/api/chat/initChat', {
      params: {
        roomName: roomName
      }
    });
  }

  public getMessages(eventId: string): Observable<Array<MessageChat>> {
    return this.http.get<Array<MessageChat>>('/api/event/getMessages', {
      params: {
        eventId: eventId
      }
    });
  }

  public saveMessage(message: MessageChat): Observable<MessageChat> {
    return this.http.post<MessageChat>('/api/event/saveMessage', message);
  }

  public deleteEvent(messageId: string): Observable<MessageChat> {
    return this.http.delete<MessageChat>('/api/chat/deleteMessage', {
      params: {
        messageId: messageId
      }
    });
  }
}
