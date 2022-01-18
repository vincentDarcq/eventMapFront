import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { LatLngBounds } from 'leaflet';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Event } from '../models/event';
import { LeftTime } from '../models/left-time';
import { mapSquare } from '../models/mapSquare';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  public events: BehaviorSubject<Array<Event>>;
  currentDate: Date;
  eventNameFromTopBar = new Subject<Event>();
  bounds = new Subject<LatLngBounds>();

  constructor(
    private http: HttpClient,
    private zone: NgZone
  ) {
    this.events = new BehaviorSubject(Array<Event>());
    this.currentDate = new Date();
    this.getBounds().subscribe(bounds => {
      const mapSquar = new mapSquare(
        bounds.getSouthWest().lat, bounds.getNorthWest().lat,
        bounds.getSouthWest().lng, bounds.getSouthEast().lng);
      this.getEvents(mapSquar);
    })
  }

  public getEvents(map: mapSquare) {
    let ev = new Array<Event>();
    this.http.post<Array<Event>>('/api/event/get', map).subscribe((events) => {
      for (let event of Object.keys(events)) {
        const e = events[event];
        let newEvent = new Event(e._id, e.name, new Date(e.dateDebut),
          e.beginTime, new Date(e.dateFin), e.endTime, e.type, e.description,
          e.lieu, e.latitude, e.longitude, e.createur, e.emailCreateur,
          this.timeBefore(e.dateDebut), e.createByOwner);
        if (new Date(e.dateDebut).getHours() === 0 && new Date(e.dateDebut).getMinutes() === 0) {
          newEvent.setDateDebutString(new Date(e.dateDebut).toLocaleString().substring(0, 10))
        } else {
          newEvent.setDateDebutString(new Date(e.dateDebut).toLocaleString())
        }
        if (e.dateFin !== null) {
          newEvent.setDateFin(new Date(e.dateFin));
        } else {
          newEvent.setDateFin(null);
        }
        newEvent.setInvites(e.invites)
        newEvent.setScope(e.scope);
        newEvent.setSpaceAndTime(e.space_and_time);
        newEvent.setPricingInfo(e.pricing_info);
        newEvent.image1 = e.image1;
        newEvent.image2 = e.image2;
        newEvent.image3 = e.image3;
        if (newEvent.getDateFin()) {
          const time_before_end = this.timeBefore(newEvent.getDateFin());
          if (time_before_end.days < 0 || time_before_end.hours < 0 || time_before_end.minutes < 0) {
            this.deleteEvent(newEvent._id);
          } else {
            ev.push(newEvent);
          }
        } else {
          if (newEvent.getTimeLeft().days < 0) {
            this.deleteEvent(newEvent._id);
          } else {
            ev.push(newEvent);
          }
        }
      }
      this.events.next(ev);
    })
  }

  public getEventsForNameStartWith(value: string): Observable<Array<Event>> {
    return this.http.post<Array<Event>>(`/api/event/find`, { value: value });
  }

  public createEvent(event: Event, formData?: FormData) {
    this.http.post<Event>('/api/event/create', event).subscribe((e) => {
      if (formData) {
        this.http.post<any>('/api/event/uploadImages', formData, {
          params: {
            eventId: e._id
          }
        }).subscribe((upload) => {
          if (upload.image1) {
            e.image1 = upload.image1;
          }
          if (upload.image2) {
            e.image2 = upload.image2;
          }
          if (upload.image3) {
            e.image3 = upload.image3;
          }
          this.addEvent(e);
        })
      } else {
        this.addEvent(e);
      }
    });
  }


  private addEvent(e: Event) {
    e.setTimeLeft(this.timeBefore(e.dateDebut));
    e.setDateDebut(new Date(e.dateDebut));
    e.setDateFin(new Date(e.dateFin));
    e.setDateDebutString(new Date(e.dateDebut).toLocaleString());
    e.setDateFinString(new Date(e.dateFin).toLocaleString());
    this.events.next([...this.events.value, e]);
  }

  public editEvent(event: Event, formData?: FormData) {
    this.http.put<Event>('/api/event/modify', event).subscribe((e) => {
      const index = this.getIndexEvent(e._id);
      if (formData) {
        this.http.post<any>('/api/event/uploadImages', formData, {
          params: {
            eventId: e._id
          }
        }).subscribe((upload) => {
          if (upload.image1) {
            e.image1 = upload.image1;
          }
          if (upload.image2) {
            e.image2 = upload.image2;
          }
          if (upload.image3) {
            e.image3 = upload.image3;
          }
          this.replaceEvent(index, e);
        })
      } else {
        if (index >= 0) {
          this.replaceEvent(index, e);
        }
      }
    });
  }

  private replaceEvent(index: number, e: Event) {
    let ev = this.events.value;
    let editEvent = new Event(e._id, e.name, new Date(e.dateDebut), e.beginTime,
      new Date(e.dateFin), e.endTime, e.type, e.description, e.lieu, e.latitude,
      e.longitude, e.createur, e.emailCreateur);
    editEvent.setDateDebut(new Date(e.dateDebut));
    editEvent.setDateDebutString(new Date(e.dateDebut).toLocaleString());
    editEvent.setDateFinString(new Date(e.dateFin).toLocaleString());
    editEvent.setTimeLeft(this.timeBefore(e.dateDebut));
    editEvent.setScope(e.scope);
    editEvent.setInvites(e.invites);
    editEvent.image1 = e.image1;
    editEvent.image2 = e.image2;
    editEvent.image3 = e.image3;
    ev.splice(index, 1, ...[editEvent]);
    this.events.next(ev);
  }

  public getEventsByUser(email: string) {
    let e = new Array<Event>();
    for (let event of this.events.value) {
      if (event.getEmailCreateur() === email) {
        e.push(event);
      }
    }
    return e;
  }

  public deleteEvent(eventId: string) {
    this.http.delete<Event>('/api/event/deleteOne', {
      params: {
        eventId: eventId
      }
    }).subscribe(() => {
      let events = this.events.value;
      const index = events.findIndex((event) => event._id === eventId);
      events.splice(index, 1);
      this.events.next(events);
    }, (e) => {
      console.log(e);
    });
  }

  public getEvent(id: string) {
    return this.events.value.find(e => e._id === id);
  }

  public setBounds(bounds: LatLngBounds) {
    this.zone.run(() => {
      this.bounds.next(bounds);
    });
  }

  public getBounds(): Observable<LatLngBounds> {
    return this.bounds;
  }

  private timeBefore(date: Date) {
    const datePipe = new DatePipe('fr-FR');
    const fd = new Date(datePipe.transform(date, 'yyyy-MM-dd HH:mm'));
    const diff = fd.getTime() - this.currentDate.getTime();
    let days = Math.floor((diff / 1000) / 60);
    const mins = days % 60;
    days = Math.floor((days - mins) / 60);
    const hours = days % 24;
    days = Math.floor((days - hours) / 24);
    const leftTime = new LeftTime(days, hours, mins);
    return leftTime;
  }

  private getIndexEvent(id: string): number {
    return this.events.value.findIndex((event) => event._id === id);
  }

  public setEventFromTopBar(event: Event) {
    this.eventNameFromTopBar.next(event);
  }

  public getEventFromTopBar() {
    return this.eventNameFromTopBar;
  }

}
