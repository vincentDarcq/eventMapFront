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
  public subscription: Subscription;

  constructor(
    private userService: UserService,
    private chatService: ChatService
  ) {
  }

  ngOnInit(): void {
    this.socket = io.connect();
    this.subscription = this.userService.currentUser.subscribe((user: User) => {
      this.user = new User(user._id, user.email, user.name, user.profile_type, user.amis);
      this.chatService.roomChatExist(this.user.name + this.friend).subscribe((result: string) => {
        console.log("chatService init")
        console.log(result);
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.inputFriend !== 'undefined') {
      this.friend = changes.inputFriend.currentValue;
    }
  }

  setFriend(friend: string) {
    this.friend = friend;
  }

  closeChat(friend: string) {
    this.close.emit(friend);
  }

  ngOnDestroy(): void {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }
}
