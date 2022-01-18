import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Event } from '../shared/models/event';
import { EventService } from '../shared/services/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnChanges {

  @Input() inputFiltersType;
  @Input() inputFiltersDate;
  @Input() events;
  @Output() outputEvent = new EventEmitter();
  eventsFiltered: Array<Event>;
  event: Event;
  filter: Boolean = false;

  constructor(private eventService: EventService) {
    this.eventsFiltered = new Array<Event>();
  }

  ngOnInit(): void {
    this.eventService.getBounds().subscribe((b) => {
      this.upgradeFilteredTypeEvents();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const inputFiltersType = changes.inputFiltersType;
    const inputFiltersDate = changes.inputFiltersDate;
    if (typeof inputFiltersType !== 'undefined' && inputFiltersType.currentValue !== null && typeof inputFiltersType.currentValue[0] !== 'undefined') {
      this.upgradeFilteredTypeEvents();
      this.filter = true;
    } else if (typeof inputFiltersDate !== 'undefined' && inputFiltersDate.currentValue !== null && typeof inputFiltersDate.currentValue[0] !== 'undefined') {
      this.eventsFiltered = new Array<Event>();
      for (let event of this.events) {
        if (this.inputFiltersDate.indexOf("1 jour") !== -1) {
          if (event.timeLeft.days <= 1) {
            this.eventsFiltered.push(event);
          }
        }
        if (this.inputFiltersDate.indexOf("2 jours") !== -1) {
          if (event.timeLeft.days <= 2) {
            if (this.eventsFiltered.indexOf(event) === -1) {
              this.eventsFiltered.push(event);
            }
          }
        }
        if (this.inputFiltersDate.indexOf("3 jours") !== -1) {
          if (event.timeLeft.days <= 3) {
            if (this.eventsFiltered.indexOf(event) === -1) {
              this.eventsFiltered.push(event);
            }
          }
        }
        if (this.inputFiltersDate.indexOf("4 jours") !== -1) {
          if (event.timeLeft.days <= 4) {
            if (this.eventsFiltered.indexOf(event) === -1) {
              this.eventsFiltered.push(event);
            }
          }
        }
        if (this.inputFiltersDate.indexOf("5 jours") !== -1) {
          if (event.timeLeft.days <= 5) {
            if (this.eventsFiltered.indexOf(event) === -1) {
              this.eventsFiltered.push(event);
            }
          }
        }
        if (this.inputFiltersDate.indexOf("6 jours") !== -1) {
          if (event.timeLeft.days <= 6) {
            if (this.eventsFiltered.indexOf(event) === -1) {
              this.eventsFiltered.push(event);
            }
          }
        }
        if (this.inputFiltersDate.indexOf("1 semaine") !== -1) {
          if (event.timeLeft.days <= 7) {
            if (this.eventsFiltered.indexOf(event) === -1) {
              this.eventsFiltered.push(event);
            }
          }
        }
        if (this.inputFiltersDate.indexOf("2 semaines") !== -1) {
          if (event.timeLeft.days <= 14) {
            if (this.eventsFiltered.indexOf(event) === -1) {
              this.eventsFiltered.push(event);
            }
          }
        }
        if (this.inputFiltersDate.indexOf("3 semaines") !== -1) {
          if (event.timeLeft.days <= 21) {
            if (this.eventsFiltered.indexOf(event) === -1) {
              this.eventsFiltered.push(event);
            }
          }
        }
        if (this.inputFiltersDate.indexOf("1 mois") !== -1) {
          if (event.timeLeft.days <= 28) {
            if (this.eventsFiltered.indexOf(event) === -1) {
              this.eventsFiltered.push(event);
            }
          }
        }
      }
      this.filter = true;
    } else {
      this.eventsFiltered = new Array<Event>();
      this.filter = false;
    }
  }

  upgradeFilteredTypeEvents() {
    if (this.inputFiltersType !== null) {
      this.eventsFiltered = new Array<Event>();
      for (let event of this.events) {
        if (this.inputFiltersType.indexOf(event.type) !== -1) {
          this.eventsFiltered.push(event);
        }
      }
    }
  }

  displayEvent(index: number) {
    this.event = this.events[index]
    this.outputEvent.emit(this.event)
  }

}
