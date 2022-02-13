import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageEvent } from '../shared/models/messageEvent';
import { User } from '../shared/models/user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../shared/services/user.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-event-chat',
  templateUrl: './event-chat.component.html',
  styleUrls: ['./event-chat.component.css']
})
export class EventChatComponent implements OnInit, OnDestroy {

  @Input() event;
  messages: Array<MessageEvent>;
  message: string
  roomId: string;
  errorOnPublish: string;
  public currentUser: User;
  public subCurrentUser: Subscription;
  public subInitChat: Subscription;
  public subMessages: Subscription;
  ioClient: SocketIOClient.Socket;
  socket: SocketIOClient.Socket;

  @ViewChild("input") input: ElementRef;

  constructor(
    private userService: UserService
  ) {
    this.messages = new Array<MessageEvent>();
  }

  ngOnInit(): void {
    this.subCurrentUser = this.userService.currentUser.subscribe((user: User) => {
      this.currentUser = user;
    });
    this.ioClient = io({
      reconnection: false,
    });
    this.socket = io(`/${this.event._id}`);
    this.socket.on('history', (messages: Array<MessageEvent>) => {
      messages.forEach(message => {
        this.messages.push(this.getMessageWithLocaleDateString(message));
      })
    });
    this.socket.on('message', (message: MessageEvent) => {
      this.messages.push(this.getMessageWithLocaleDateString(message));
    });
    this.socket.on('deleteMessage', (message: MessageEvent) => {
      const index = this.messages.findIndex((msg) => msg._id === message._id);
      this.messages.splice(index, 1);
    })
  }

  submitMessage() {
    if (this.currentUser._id) {
      if (this.message && this.message !== "") {
        const message = new MessageEvent();
        message.setMessage(
          this.message,
          this.currentUser._id,
          this.currentUser.name,
          this.event._id);
        this.socket.emit("message", message);
        this.input.nativeElement.focus();
        this.message = "";
      }
    } else {
      this.errorOnPublish = "Connectez vous pour écrire un post"
    }
  }

  getMessageWithLocaleDateString(message: MessageEvent): MessageEvent {
    return new MessageEvent(message._id, message.message, message.type,
      message.userId, message.userName, message.eventId,
      new Date(message.createdAt).toLocaleDateString() + " - " + new Date(message.createdAt).toLocaleTimeString());
  }

  deleteMessage(id: string) {
    Swal.fire({
      title: 'Supprimer votre commentaire ?',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.socket.emit("deleteMessage", { id: id });
      }
    })
  }

  enter(event: KeyboardEvent) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      this.submitMessage();
    }
  }

  ngOnDestroy(): void {
    if (this.subCurrentUser) { this.subCurrentUser.unsubscribe(); }
    if (this.subInitChat) { this.subInitChat.unsubscribe(); }
    if (this.subMessages) { this.subMessages.unsubscribe(); }
    this.socket.emit("close");
  }
}
