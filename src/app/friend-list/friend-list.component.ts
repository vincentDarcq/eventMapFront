import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../shared/models/user.model';
import { ChatService } from '../shared/services/chat.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit, OnDestroy {

  @Output() friend = new EventEmitter();
  public subscription: Subscription;
  show: boolean = true;
  user: User;

  constructor(
    private userService: UserService,
    private chatService: ChatService
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.userService.currentUser.subscribe((user: User) => {
      if (user != null) {
        this.user = new User(user._id, user.email, user.name, user.profile_type, user.amis);
      } else {
        this.user = null;
      }
    });
  }

  addChat(friend: string) {
    this.friend.emit(friend);
  }

  showList() {
    this.show = !this.show;
  }

  getHeight(length: number) {
    return `${length * 10}px;`
  }

  ngOnDestroy(): void {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

}
