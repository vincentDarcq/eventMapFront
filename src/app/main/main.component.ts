import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event } from '../shared/models/event';
import { LatLng, LatLngBounds } from 'leaflet';
import { EventService } from '../shared/services/event.service';
import { Events } from '../shared/models/event-list';
import { Dates } from '../shared/models/date-list';
import { FormControl } from '@angular/forms';
import { EventsApiService } from '../shared/services/events-api.service';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  events: Array<Event>;
  eventsOnMap: Array<Event>;
  eventsFromHQ: Array<any>;
  eventToDisplay: Event;
  eventToZoom: LatLng;
  typeEvents = Events;
  dates = Dates;
  filtersType: FormControl;
  filtersDate: FormControl;
  currentDate: Date;
  mapBounds: LatLngBounds;
  user: User;
  public eventSubscription: Subscription;
  public userSubscription: Subscription;

  constructor(
    private userService: UserService,
    private eventService: EventService
  ) {
    this.events = new Array<Event>();
    this.eventsOnMap = new Array<Event>();
    this.eventsFromHQ = new Array<any>();
    this.filtersType = new FormControl();
    this.filtersDate = new FormControl();
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.eventSubscription = this.eventService.events.subscribe((events: Array<Event>) => {
      this.events = events
    });
    this.userSubscription = this.userService.currentUser.subscribe((user: User) => {
      if (user) {
        this.user = new User(user._id, user.email, user.name, user.profile_type, user.amis);
      }
    });
  }

  displayEvent(event: Event) {
    this.eventToDisplay = event;
  }

  ngOnDestroy(): void {
    if (this.eventSubscription) { this.eventSubscription.unsubscribe(); }
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
  }

}
