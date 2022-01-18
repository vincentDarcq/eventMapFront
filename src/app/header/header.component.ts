import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Event } from '../shared/models/event';
import { JwtToken } from '../shared/models/jwt-token.model';
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
  public eventSearch: string;
  public events: Array<Event>;
  public eventsSearched: Array<Event>;
  public results: Array<string>;
  notConnected: boolean = false;
  connected: boolean = false;

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

  search() {
    this.results = new Array<string>();
    this.eventService.getEventsForNameStartWith(this.eventSearch).subscribe(
      (events: Array<Event>) => {
        events.forEach(event => {
          this.results.push(event.name);
          this.eventsSearched.push(event);
        })
      }
    )
    if (this.eventSearch.length === 0) {
      this.results = new Array<string>();
    }
  }

  selectEvent(index: number) {
    let e;
    for (let event of this.eventsSearched) {
      if (event.name === this.results[index]) {
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
    localStorage.removeItem('currentUser');
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
