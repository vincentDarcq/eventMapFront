import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../shared/models/user.model';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit {

  @Output() friend = new EventEmitter();
  public subscription: Subscription;
  show: boolean = true;
  user: User;

  constructor(private userService: UserService) {
    this.user = new User();
  }

  ngOnInit(): void {
    this.subscription = this.userService.currentUser.subscribe((user: User) => {
      this.user = new User(user._id, user.email, user.name, user.profile_type, user.amis);
    });
  }

  addChat(friend: string) {
    this.friend.emit(friend);
  }

  showList() {
    this.show = !this.show;
  }

}
