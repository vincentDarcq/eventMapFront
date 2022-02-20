import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MessageChat } from '../models/messageChat';
import { MessageEvent } from '../models/messageEvent';
import { RoomChat } from '../models/roomChat';
import { User } from '../models/user.model';
import { OpenpgpService } from './openpgp.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  user: User;
  public subUser: Subscription;
  public subCurrentUser: Subscription;
  public rooms: BehaviorSubject<Map<string, string>> = new BehaviorSubject(new Map<string, string>());
  private mapRooms: Map<string, string> = new Map<string, string>();
  public messages: BehaviorSubject<Map<string, Array<MessageChat>>> = new BehaviorSubject(new Map<string, Array<MessageChat>>());
  private mapMessages: Map<string, Array<MessageChat>> = new Map<string, Array<MessageChat>>();

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private openpgpService: OpenpgpService
  ) {
    this.subCurrentUser = this.userService.currentUser.subscribe((user: User) => {
      this.user = new User(user._id, user.email, user.name, user.profile_type, user.amis, user.pri);
      if (this.user.amis) {
        this.initRooms();
      }
    });
  }

  public initRooms() {
    this.mapRooms = new Map<string, string>();
    this.user.amis.forEach((ami: string) => {
      const subRoomChat = this.roomChat(this.user.name, ami).subscribe((roomChat: RoomChat) => {
        if (subRoomChat) { subRoomChat.unsubscribe(); }
        this.mapRooms.set(ami, roomChat.roomName);
        this.rooms.next(this.mapRooms);
        if (this.rooms.value.size === this.user.amis.length) {
          for (let friend of this.rooms.value.keys()) {
            const subMessagesChat = this.messagesChat(this.rooms.value.get(friend)).subscribe((messages: Array<MessageChat>) => {
              if (subMessagesChat) { subMessagesChat.unsubscribe(); }
              this.mapMessages.set(friend, messages);
              if (this.mapMessages.size === this.rooms.value.size) {
                this.decryptMessages();
                this.messages.next(this.mapMessages);
              }
            });
          }
        }
      });
    });
  }

  public getMessagesEvent(eventId: string): Observable<Array<MessageEvent>> {
    return this.http.get<Array<MessageEvent>>('/api/event/getMessages', {
      params: {
        eventId: eventId
      }
    });
  }

  private messagesChat(roomName: string): Observable<Array<MessageChat>> {
    return this.http.get<Array<MessageChat>>('/api/chat/getMessagesChat', {
      params: {
        roomName: roomName
      }
    })
  }

  private roomChat(user: string, ami: string): Observable<RoomChat> {
    return this.http.get<RoomChat>('/api/chat/getRoomChat', {
      params: {
        user1: user,
        user2: ami
      }
    })
  }

  private decryptMessages() {
    for (let friend of this.mapMessages.keys()) {
      this.subUser = this.userService.getUser(friend).subscribe((f: User) => {
        let messages = new Array<MessageChat>();
        for (let msg of this.mapMessages.get(friend)) {
          msg.user === this.user.name ?
            this.openpgpService.decryptMessage(f.pri, msg.message).then(res => {
              msg.message = res;
              const link = this.containsLink(msg.message);
              if (link !== -1) {
                msg.message = this.insertLink(msg, link);
              }
              messages.push(msg);
            }) :
            this.openpgpService.decryptMessage(this.user.pri, msg.message).then(res => {
              msg.message = res;
              const link = this.containsLink(msg.message);
              if (link !== -1) {
                msg.message = this.insertLink(msg, link);
              }
              messages.push(msg);
            });
        }
        this.mapMessages.set(friend, messages);
      });
    }
  }

  private containsLink(message: string): number {
    if (message.indexOf("http") !== -1 || message.indexOf("https")) {
      let index = message.indexOf("http");
      if (index === -1) {
        index = message.indexOf("https");
        return index;
      }
      return index;
    }
  }

  private insertLink(message: MessageChat, index: number): string {
    const indexEnd = message.message.substring(index, message.message.length).indexOf(" ");
    if (index === 0 && indexEnd === -1) {
      return message.user === this.user.name ?
        '<a href="' + message.message + '" target="_blank" style="color: white;">' + message.message + '</a>' :
        '<a href="' + message.message + '" target="_blank">' + message.message + '</a>';
    } else if (indexEnd === -1) {
      return message.user === this.user.name ?
        message.message.substring(0, index) + '<a href="' + message.message.substring(index) + '" target="_blank" style="color: white;">' + message.message.substring(index) + '</a>' :
        message.message.substring(0, index) + '<a href="' + message.message.substring(index) + '" target="_blank">' + message.message.substring(index) + '</a>'
    } else {
      return message.user === this.user.name ?
        message.message.substring(0, index) + '<a href="' + message.message.substring(index, indexEnd) + '" target="_blank" style="color: white;">' + message.message.substring(index, indexEnd) + '</a>' + message.message.substring(indexEnd, message.message.length) :
        message.message.substring(0, index) + '<a href="' + message.message.substring(index, indexEnd) + '" target="_blank">' + message.message.substring(index, indexEnd) + '</a>' + message.message.substring(indexEnd, message.message.length);
    }
  }

}
