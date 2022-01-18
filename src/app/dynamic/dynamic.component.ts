import { Component, ComponentFactoryResolver, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { FriendChatComponent } from '../friend-chat/friend-chat.component';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.css']
})
export class DynamicComponent implements OnInit {

  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  constructor(
    private compFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {
  }

  public addComponent(ngItem: Type<FriendChatComponent>, friend: string): FriendChatComponent {
    let factory = this.compFactoryResolver.resolveComponentFactory(ngItem);
    const ref = this.container.createComponent(factory);
    const newItem: FriendChatComponent = ref.instance;
    newItem.setFriend(friend);
    return newItem;
  }

}
