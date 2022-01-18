import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Event } from '../shared/models/event';
import { User } from '../shared/models/user.model';
import { EventService } from '../shared/services/event.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, OnChanges, OnDestroy {

  @Input() details;
  @Input() inputEvent;
  event: Event;
  public currentUser: User;
  public subscription: Subscription;

  constructor(private userService: UserService,
    private eventService: EventService) {
    this.event = new Event();
  }

  ngOnInit(): void {
    this.subscription = this.userService.currentUser.subscribe((user: User) => {
      this.currentUser = user;
    });
    this.eventService.getEventFromTopBar().subscribe((event) => {
      this.event = event;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const e = changes.inputEvent.currentValue;
    if (typeof e !== 'undefined') {
      this.event = new Event(e._id, e.name, e.dateDebut, e.beginTime, e.dateFin, e.endTime,
        e.type, e.description, e.lieu, e.latitude, e.longitude, e.createur, e.emailCreateur,
        e.timeLeft, e.createOwner);
      this.event.setSpaceAndTime(e.space_and_time);
      this.event.setPricingInfo(e.pricing_info);
    }
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

}
