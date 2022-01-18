import { Component, ViewChild } from '@angular/core';
import { DynamicComponent } from './dynamic/dynamic.component';
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
  public elements: Array<FriendChatComponent> = [];
  title = 'EventMap';
  @ViewChild(DynamicComponent) dynamicComponent: DynamicComponent;


  constructor(
    private authService: AuthService,
    private metaAndTitleService: MetaAndTitleService
  ) {
  }

  openChat(friend: string) {
    let ref = this.dynamicComponent.addComponent(FriendChatComponent, friend);
    this.elements.push(ref);
  }

  closeChat(friend: string) {
    const index = this.elements.findIndex(e => e.friend === friend);
    this.elements.splice(index, 1);
  }
}
