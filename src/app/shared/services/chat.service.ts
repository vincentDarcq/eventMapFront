import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageChat } from '../models/message-chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http: HttpClient
  ) { }

  public roomChatExist(room: string) {
    return this.http.get<String>('/api/chat/getRoomExist', {
      params: {
        room: room
      }
    })
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
