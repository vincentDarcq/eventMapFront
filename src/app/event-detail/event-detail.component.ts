import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EventService } from '../shared/services/event.service';
import { Event } from '../shared/models/event';
import { timer } from 'rxjs';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  idEvent: string;
  event: Event;
  serverImg: String = "/upload?img=";

  constructor(
    private eventService: EventService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.idEvent = params.get('_id');
    });
    this.eventService.events.subscribe((events: Array<Event>) => {
      const id = events.findIndex((event) => this.idEvent === event._id);
      this.event = events[id];
    });
  }

}
