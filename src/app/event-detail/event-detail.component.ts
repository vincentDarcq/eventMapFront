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
    this.activatedRoute.params.subscribe((params: ParamMap) => {
      this.idEvent = params['id'];
      this.eventService.events.subscribe((events: Array<Event>) => {
        const id = events.findIndex((event) => this.idEvent === event._id);
        this.event = events[id];
        if(!this.event){
          this.eventService.fetchEvent(this.idEvent).subscribe( (event: Event) => {
            this.event = event;
          })
        }
      });
    });
  }

}
