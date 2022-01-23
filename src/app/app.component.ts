import { Component } from '@angular/core';
import { FriendChatComponent } from './friend-chat/friend-chat.component';
import { AuthService } from './shared/services/auth.service';
import { MetaAndTitleService } from './shared/services/meta-and-title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  entryComponents: [FriendChatComponent]
})
export class AppComponent {
  public friends: Array<String> = [];
  title = 'EventMap';

  constructor(
    private authService: AuthService,
    private metaAndTitleService: MetaAndTitleService
  ) {
  }

  openChat(friend: string) {
    this.friends.push(friend);
  }

  closeChat(friend: string) {
    const index = this.friends.findIndex(e => e === friend);
    this.friends.splice(index, 1);
  }
}
