import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageChat } from '../shared/models/messageChat';
import { User } from '../shared/models/user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../shared/services/user.service';
import { ChatService } from '../shared/services/chat.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-event-chat',
  templateUrl: './event-chat.component.html',
  styleUrls: ['./event-chat.component.css']
})
export class EventChatComponent implements OnInit, OnDestroy {

  @Input() event;
  messages: Array<MessageChat>;
  message: string
  roomId: string;
  errorOnPublish: string;
  public currentUser: User;
  public subscription: Subscription;

  @ViewChild("input") input: ElementRef;

  constructor(
    private userService: UserService,
    private chatService: ChatService
  ) {
    this.messages = new Array<MessageChat>();
  }

  ngOnInit(): void {
    this.subscription = this.userService.currentUser.subscribe((user: User) => {
      this.currentUser = user;
    });
    // this.chatService.getMessages(this.event._id).subscribe((messages: Array<MessageChat>) => {
    //   for (let message of messages) {
    //     const m = new MessageChat(message._id, message.message, message.type,
    //       message.userId, message.userName, message.eventId,
    //       new Date(message.createdAt).toLocaleDateString() + " - " + new Date(message.createdAt).toLocaleTimeString());
    //     this.messages.push(m);
    //   }
    // })
  }

  submitMessage() {
    // if (this.currentUser._id) {
    //   if (this.message && this.message !== "") {
    //     const message = new MessageChat();
    //     message.setMessage(
    //       this.message,
    //       this.currentUser._id,
    //       this.currentUser.name,
    //       this.event._id);
    //     this.chatService.saveMessage(message).subscribe((message: MessageChat) => {
    //       this.messages.push(message);
    //     });
    //     this.input.nativeElement.focus();
    //     this.message = "";
    //   }
    // } else {
    //   this.errorOnPublish = "Vous devez être connecté avec un compte pour publier"
    // }
  }

  // deleteMessage(id: string) {
  //   Swal.fire({
  //     title: 'Supprimer votre commentaire ?',
  //     showCancelButton: true,
  //     confirmButtonText: 'Ok',
  //     cancelButtonText: 'No'
  //   }).then((result) => {
  //     if (result.value) {
  //       this.chatService.deleteEvent(id).subscribe(() => {
  //         const index = this.messages.findIndex((message) => message._id === id);
  //         this.messages.splice(index, 1);
  //       })
  //     }
  //   })
  // }

  enter(event: KeyboardEvent) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      //this.submitMessage();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
