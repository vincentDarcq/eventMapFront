import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FriendChatComponent } from './friend-chat/friend-chat.component';
import { User } from './shared/models/user.model';
import { AuthService } from './shared/services/auth.service';
import { MetaAndTitleService } from './shared/services/meta-and-title.service';
import { UserService } from './shared/services/user.service';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  entryComponents: [FriendChatComponent]
})
export class AppComponent implements OnInit {
  public friends: Array<String> = [];
  title = 'EventMap';
  public subCurrentUser: Subscription;
  screenHeight: number;
  screenWidth: number;

  constructor(
    private authService: AuthService,
    private metaAndTitleService: MetaAndTitleService,
    private userService: UserService
  ) {
    this.getScreenSize();
  }

  ngOnInit(): void {
    this.subCurrentUser = this.userService.currentUser.subscribe((user: User) => {
      if (user === null) {
        this.friends = new Array();
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  openChat(friend: string) {
    if (this.screenWidth < 600) {
      this.friends = new Array();
    }
    this.friends.push(friend);
  }

  closeChat(friend: string) {
    const index = this.friends.findIndex(e => e === friend);
    this.friends.splice(index, 1);
  }
}
