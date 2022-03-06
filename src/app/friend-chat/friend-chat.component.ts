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
import { MessageChat } from '../shared/models/messageChat';
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
  public subFetch: Subscription;
  public subMessagesSize: Subscription;
  messageSize: number;
  roomName: string;
  message: string = "";
  messages: Array<MessageChat> = new Array<MessageChat>();
  public isEmojiPickerVisible: boolean;
  mini: boolean = false;
  confirm: boolean = false;
  messageToDelete: MessageChat;
  refreshed: boolean = false;

  @ViewChild("input") input: ElementRef;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private sanitizer: DomSanitizer
  ) {
  }

  minimize() {
    this.mini = !this.mini;
  }

  ngDoCheck(): void {
    this.fetchMessages();
    if (this.messages.length > 0 && document.getElementById('messages-box') !== null && this.refreshed) {
      document.getElementById('messages-box').scrollTop = document.getElementById('messages-box').scrollHeight;
      this.refreshed = false;
    }
  }

  ngAfterViewInit(): void {
    this.input.nativeElement.focus();
  }

  ngOnInit(): void {
    this.subCurrentUser = this.userService.currentUser.subscribe((user: User) => {
      this.user = new User(user._id, user.email, user.name, user.profile_type, user.amis, user.pri);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.inputFriend !== 'undefined' && !this.friend) {
      this.friend = new User();
      this.friend.name = changes.inputFriend.currentValue;
      this.subUser = this.userService.getUser(this.friend.name).subscribe((user: User) => {
        this.friend = user;
        this.subMessagesSize = this.chatService.messagesSize.subscribe((map: Map<string, number>) => {
          this.messageSize = map.get(this.friend.name);
        });
        const sub = this.chatService.rooms.subscribe((mapRooms: Map<string, string>) => {
          this.roomName = mapRooms.get(this.friend.name);
          this.chatService.initTimerMessagesChat(this.friend.name, this.roomName);
        });
      })
    }
  }

  private fetchMessages() {
    if (!this.subFetch) {
      this.subFetch = this.chatService.messages.subscribe((messages: Map<string, Array<MessageChat>>) => {
        const msgs = messages.get(this.friend.name);
        if (this.messages.length === 0) {
          if (msgs) {
            msgs.forEach(m => this.messages.push(m))
          }
        } else {
          if (this.messageSize < msgs.length) {
            const lastMessage = this.messages[this.messages.length - 1];
            const indexLast = msgs.indexOf(lastMessage);
            for (let i = indexLast + 1; i <= msgs.length - 1; i++) {
              this.messages.push(msgs[i]);
            }
          }
        }
        this.refreshed = true;
      });
    }
  }

  public addEmoji(event) {
    this.message = `${this.message}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
    this.input.nativeElement.focus();
  }

  public async sendMessage() {
    this.chatService.createMessageChat(
      this.message,
      this.user.name,
      this.friend.name,
      this.friend.pub,
      this.roomName
    );
    this.message = "";
  }

  enter(event: KeyboardEvent) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      this.sendMessage();
    }
  }

  confirmSupression() {
    this.socket.emit("deleteOne", { id: this.messageToDelete._id });
    this.messageToDelete = new MessageChat();
    this.confirm = false;
  }

  annulerSupression() {
    this.messageToDelete = new MessageChat();
    this.confirm = false;
  }

  deleteMessage(message: MessageChat) {
    this.messageToDelete = message;
    this.confirm = true;
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
    if (this.subFetch) { this.subFetch.unsubscribe(); }
    this.chatService.closeChat();
  }

}
