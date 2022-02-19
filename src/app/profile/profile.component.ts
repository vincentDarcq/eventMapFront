import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { User } from '../shared/models/user.model';
import { EventService } from '../shared/services/event.service';
import { Event } from '../shared/models/event';
import { UserService } from '../shared/services/user.service';
import { NetworkService } from '../shared/services/network.service';
import { Ask } from '../shared/models/ask';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user: User;
  events: Array<Event>;
  myAsks: Array<Ask>;
  public subCurrentUser: Subscription;
  public subEvents: Subscription;
  public subNetwork: Subscription;
  serverImg: String = "/upload?img=";

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private networkService: NetworkService
  ) {
    this.events = new Array<Event>();
    this.myAsks = new Array<Ask>();
    this.user = new User();
  }

  ngOnInit(): void {
    this.subCurrentUser = this.userService.currentUser.subscribe((user: User) => {
      this.user = new User(user._id, user.email, user.name, user.profile_type, user.amis);
      this.user.setPicture(user.picture);
      this.subEvents = this.eventService.getEventsByUser(this.user.email).subscribe((events: Array<Event>) => {
        this.events = events;
      })
    });
    this.subNetwork = this.networkService.getAsks().subscribe((asks) => {
      for (let ask of Object.keys(asks)) {
        if (asks[ask].destinataire === this.user.name) {
          this.myAsks.push(new Ask(asks[ask]._id, asks[ask].demandeur, asks[ask].destinataire));
        }
      }
    });
  }

  acceptFriend(index: number) {
    this.networkService.acceptFriend(
      this.myAsks[index].id, this.myAsks[index].destinataire, this.myAsks[index].demandeur).subscribe((res) => {
        this.userService.updateListFriends(this.user, this.myAsks[index].demandeur, "add");
        this.myAsks.splice(this.myAsks.indexOf(res, 1));
      })
  }

  deniedFriend(index: number) {
    this.networkService.deniedFriend(this.myAsks[index].id).subscribe((res) => {
      this.myAsks.splice(this.myAsks.indexOf(res, 1));
    })
  }

  deleteFriend(index: number) {
    this.networkService.deleteFriend(this.user.name, this.user.amis[index]).subscribe((res) => {
      this.userService.updateListFriends(this.user, this.user.amis[index]);
    })
  }

  deleteEvent(eventId: string) {
    this.eventService.deleteEvent(eventId);
  }

  popupToDeleteFriend(index: number) {
    Swal.fire({
      title: 'Supprimer ' + this.user.amis[index] + ' de vos amis ?',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.deleteFriend(index);
      }
    })
  }

  popupToDeleteEvent(eventId: string) {
    Swal.fire({
      title: 'Supprimer cet évènement ?',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.deleteEvent(eventId);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.subCurrentUser) { this.subCurrentUser.unsubscribe(); }
    if (this.subEvents) { this.subEvents.unsubscribe(); }
    if (this.subNetwork) { this.subNetwork.unsubscribe(); }
  }
}
