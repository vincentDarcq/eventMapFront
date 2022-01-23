import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs';
import * as io from 'socket.io-client';
import { MessageChat } from '../shared/models/messageChat';
import { RoomChat } from '../shared/models/roomChat';
import { User } from '../shared/models/user.model';
import { ChatService } from '../shared/services/chat.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-friend-chat',
  templateUrl: './friend-chat.component.html',
  styleUrls: ['./friend-chat.component.css']
})
export class FriendChatComponent implements OnInit, OnDestroy, OnChanges {
  friend: string;
  user: User;
  @Input() inputFriend;
  @Output() close = new EventEmitter();
  socket: SocketIOClient.Socket;
  public subCurrentUser: Subscription;
  public subChat: Subscription;
  roomName: string;
  message: string;
  messages: Array<MessageChat> = new Array<MessageChat>();

  constructor(
    private userService: UserService,
    private chatService: ChatService
  ) {
  }

  ngOnInit(): void {
    if (typeof this.socket == 'undefined') {
      this.socket = io.connect();
    }
    this.socket.on("message", (message) => {
      this.messages.push(message);
    })
    this.subCurrentUser = this.userService.currentUser.subscribe((user: User) => {
      this.user = new User(user._id, user.email, user.name, user.profile_type, user.amis);
      this.chatService.getRoomChat(this.user.name, this.friend).subscribe((roomChat: RoomChat) => {
        this.subChat = this.chatService.initChat(roomChat.roomName).subscribe(res => {
          this.roomName = roomChat.roomName;
          this.socket = io(`/${this.roomName}`);
          console.log(this.socket)
          this.socket.emit('joinRoom', { roomName: this.roomName });
          this.socket.on('history', (messages: Array<MessageChat>) => {
            this.messages = messages;
          })
          this.socket.on('message', (message: MessageChat) => {
            this.messages.push(message);
          })
        });
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.inputFriend !== 'undefined') {
      this.friend = changes.inputFriend.currentValue;
    }
  }

  sendMessage() {
    this.socket.emit("message", { message: this.message, user: this.user.name, friend: this.friend, roomName: this.roomName });
    this.message = "";
  }

  messageStyle(message: MessageChat) {
    return message.user === this.user.name ? 'right' : 'left';
  }

  setFriend(friend: string) {
    this.friend = friend;
  }

  closeChat(friend: string) {
    this.close.emit(friend);
  }

  ngOnDestroy(): void {
    if (this.subCurrentUser) { this.subCurrentUser.unsubscribe(); }
    if (this.subChat) { this.subChat.unsubscribe(); }
    this.socket.emit("leaveRoom", this.roomName);
    const ns = this.socket.off(`/${this.roomName}`);
    ns.emit('disconnect');
    this.socket.close();
  }
}
