import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
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
  public subscription: Subscription;
  public messagesSize: BehaviorSubject<Map<string, number>> = new BehaviorSubject(new Map<string, number>());

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
              this.messagesSize.next(new Map<string, number>().set(friend, messages.length))
              this.mapMessages.set(friend, messages);
              this.decryptMessages();
              this.messages.next(this.mapMessages);
            });
          }
        }
      });
    });
  }

  public initTimerMessagesChat(friend: string, roomName: string) {
    this.subscription = timer(1000, 1500).pipe(
      switchMap(() => {
        const array = this.mapMessages.get(friend);
        const createdAt = array[array.length - 1].createdAt;
        return this.http.get<Array<MessageChat>>('/api/chat/getMessageChat', {
          params: {
            roomName: roomName,
            date: createdAt
          }
        }).pipe(
          tap((messages: Array<MessageChat>) => {
            if (messages.length > 0) {
              messages.forEach(async m => {
                this.subUser = this.userService.getUser(friend).subscribe(async (f: User) => {
                  const msg = m.user === this.user.name ?
                    await this.decryptMessage(m, f.pri) : await this.decryptMessage(m, this.user.pri);
                  if (this.mapMessages.get(friend).indexOf(msg) === -1) {
                    this.mapMessages.get(friend).push(msg);
                    this.messages.next(this.mapMessages);
                  }
                })
              });
            }
          }
          ))
      })
    ).subscribe(() => { }, err => { });
  }

  public async createMessageChat(
    message: string,
    user: string,
    friend: string,
    pub: string,
    roomName: string
  ) {
    const encryptedMessage = await this.openpgpService.encryptMessage(message, pub);
    const msg = new MessageChat();
    msg.message = encryptedMessage;
    msg.user = user;
    msg.friend = friend;
    msg.roomName = roomName;
    this.http.post<MessageChat>('/api/chat/createMessageChat', msg).subscribe(() => { })
  }

  public closeChat() {
    this.subscription.unsubscribe();
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

  private async decryptMessage(message: MessageChat, pri: string): Promise<MessageChat> {
    const ms = await this.openpgpService.decryptMessage(pri, message.message);
    const msg = new MessageChat(message._id, ms, message.user, message.friend, message.createdAt)
    const link = this.containsLink(msg.message);
    if (link !== -1) {
      msg.message = this.insertLink(msg, link);
    }
    return msg;
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

  public delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
