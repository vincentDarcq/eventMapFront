import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  DoCheck
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import * as io from 'socket.io-client';
import { MessageChat } from '../shared/models/messageChat';
import { RoomChat } from '../shared/models/roomChat';
import { User } from '../shared/models/user.model';
import { ChatService } from '../shared/services/chat.service';
import { OpenpgpService } from '../shared/services/openpgp.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-friend-chat',
  templateUrl: './friend-chat.component.html',
  styleUrls: ['./friend-chat.component.css']
})
export class FriendChatComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit, DoCheck {
  friend: User;
  user: User;
  @Input() inputFriend;
  @Output() close = new EventEmitter();
  ioClient: SocketIOClient.Socket;
  socket: SocketIOClient.Socket;
  public subCurrentUser: Subscription;
  public subUser: Subscription;
  public subRoomChat: Subscription;
  public subChat: Subscription;
  roomName: string;
  message: string;
  messages: Array<MessageChat> = new Array<MessageChat>();

  @ViewChild("input") input: ElementRef;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private openpgpService: OpenpgpService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngDoCheck(): void {
    if (this.messages.length > 0) {
      document.getElementById('messages-box').scrollTop = document.getElementById('messages-box').scrollHeight;
    }
  }

  ngAfterViewInit(): void {
    this.input.nativeElement.focus();
  }

  ngOnInit(): void {
    this.ioClient = io({
      reconnection: false,
    });
    this.subCurrentUser = this.userService.currentUser.subscribe((user: User) => {
      this.user = new User(user._id, user.email, user.name, user.profile_type, user.amis, user.pri);
      this.subRoomChat = this.chatService.getRoomChat(this.user.name, this.friend.name).subscribe((roomChat: RoomChat) => {
        this.initChat(roomChat);
      });
    });
  }

  private initChat(roomChat: RoomChat) {
    this.roomName = roomChat.roomName;
    this.socket = io(`/${this.roomName}`);
    this.socket.on('history', (messages: Array<MessageChat>) => {
      for (let message of messages) {
        this.pushMessage(message);
      }
      document.getElementById('messages-box').scrollTop = document.getElementById('messages-box').scrollHeight;
    });
    this.socket.on('message', (message: MessageChat) => {
      this.pushMessage(message);
      document.getElementById('messages-box').scrollTop = document.getElementById('messages-box').scrollHeight;
    });
  }

  private pushMessage(message: MessageChat) {
    message.user === this.user.name ?
      this.openpgpService.decryptMessage(this.friend.pri, message.message).then(res => {
        message.message = res;
        const link = this.containsLink(message.message);
        if (link !== -1) {
          message.message = this.insertLink(message, link);
        }
        this.messages.push(message);
      }) :
      this.openpgpService.decryptMessage(this.user.pri, message.message).then(res => {
        message.message = res;
        const link = this.containsLink(message.message);
        if (link !== -1) {
          message.message = this.insertLink(message, link);
        }
        this.messages.push(message);
      });
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
    }
    if (indexEnd === -1) {
      return message.user === this.user.name ?
        message.message.substring(0, index) + '<a href="' + message.message.substring(index) + '" target="_blank" style="color: white;">' + message.message.substring(index) + '</a>' :
        message.message.substring(0, index) + '<a href="' + message.message.substring(index) + '" target="_blank">' + message.message.substring(index) + '</a>'
    } else {
      return message.user === this.user.name ?
        message.message.substring(0, index) + '<a href="' + message.message.substring(index, indexEnd) + '" target="_blank" style="color: white;">' + message.message.substring(index, indexEnd) + '</a>' + message.message.substring(indexEnd, message.message.length) :
        message.message.substring(0, index) + '<a href="' + message.message.substring(index, indexEnd) + '" target="_blank">' + message.message.substring(index, indexEnd) + '</a>' + message.message.substring(indexEnd, message.message.length);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.inputFriend !== 'undefined' && !this.friend) {
      this.friend = new User();
      this.friend.name = changes.inputFriend.currentValue;
      this.subUser = this.userService.getUser(this.friend.name).subscribe((user: User) => {
        this.friend = user;
      })
    }
  }

  public async sendMessage() {
    const encrypt = await this.openpgpService.encryptMessage(this.message, this.friend.pub);
    this.socket.emit("message", { message: encrypt, user: this.user.name, friend: this.friend, roomName: this.roomName });
    this.message = "";
  }

  enter(event: KeyboardEvent) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      this.sendMessage();
    }
  }

  setFriend(friend: string) {
    this.friend.name = friend;
  }

  closeChat(friend: string) {
    this.close.emit(friend);
  }

  classForParagraphe(message: MessageChat) {
    return message.user === this.user.name ? "messageUser" : "messageFriend";
  }

  ngOnDestroy(): void {
    if (this.subCurrentUser) { this.subCurrentUser.unsubscribe(); }
    if (this.subChat) { this.subChat.unsubscribe(); }
    if (this.subUser) { this.subUser.unsubscribe(); }
    if (this.subRoomChat) { this.subRoomChat.unsubscribe(); }
    this.socket.emit("close", this.user.name);
  }

}
