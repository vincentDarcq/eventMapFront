import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Event } from '../shared/models/event';
import { JwtToken } from '../shared/models/jwt-token.model';
import { User } from '../shared/models/user.model';
import { AuthService } from '../shared/services/auth.service';
import { EventService } from '../shared/services/event.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public jwtToken: JwtToken;
  public subscription: Subscription;
  public events: Array<Event>;
  public eventsSearched: Array<Event>;
  public eventSearch: string;
  notConnected: boolean = false;
  connected: boolean = false;
  public userSearch: string;
  public usersSearched: Array<User>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private eventService: EventService,
    private userService: UserService
  ) {
    this.eventsSearched = new Array<Event>();
    this.events = new Array<Event>();
  }

  ngOnInit(): void {
    this.subscription = this.authService.jwtToken.subscribe((jwtToken: JwtToken) => {
      this.jwtToken = jwtToken;
    })
    this.eventService.events.subscribe((events: Array<Event>) => {
      this.events = events;
    });
  }

  searchUsers() {
    if (this.userSearch.length !== 0) {
      this.userService.getUsersForNameStartWith(this.userSearch).subscribe(
        (users: Array<User>) => {
          this.usersSearched = new Array<User>();
          users.forEach(user => {
            this.usersSearched.push(user);
          })
        }
      )
    } else {
      this.usersSearched = new Array<User>();
    }
  }

  selectUser(index: number) {
    let u;
    for (let user of this.usersSearched) {
      if (user.name === this.usersSearched[index].name) {
        u = user;
      }
    }
    this.router.navigate(['/otherProfile', { user: u.name }]);
  }

  searchEvents() {
    if (this.eventSearch.length !== 0) {
      this.eventService.getEventsForNameStartWith(this.eventSearch).subscribe(
        (events: Array<Event>) => {
          this.eventsSearched = new Array<Event>();
          events.forEach(event => {
            this.eventsSearched.push(event);
          })
        }
      )
    } else {
      this.eventsSearched = new Array<Event>();
    }
  }

  selectEvent(index: number) {
    let e;
    for (let event of this.eventsSearched) {
      if (event.name === this.eventsSearched[index].name) {
        e = event;
      }
    }
    const url = this.router.url;
    if (url.length !== 1) {
      this.router.navigate(['/eventDetail', { _id: e._id }]);
    } else {
      this.eventService.setEventFromTopBar(e);
    }
  }

  public logout(mode?: string) {
    this.authService.logout();
    this.userService.currentUser.next(null);
    sessionStorage.removeItem('currentUser');
    if (mode) {
      this.displayList(mode);
    }
  }

  displayList(mode: string) {
    if (mode === "notconnected") {
      this.notConnected = !this.notConnected;
    } else {
      this.connected = !this.connected;
    }
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

}
