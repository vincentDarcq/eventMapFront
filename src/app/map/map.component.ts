import { Component, OnInit, DoCheck, Input, OnChanges, SimpleChanges, EventEmitter, Output, NgZone } from '@angular/core';
import {
  latLng, MapOptions, tileLayer, Map,
  marker, icon, LatLng, Layer, LatLngBounds
} from 'leaflet';
import { MapPoint } from '../shared/models/map-point.model';
import { Event } from '../shared/models/event';
import { Subscription } from 'rxjs';
import { EventService } from '../shared/services/event.service';
import { EventsApiService } from '../shared/services/events-api.service';
import { MapService } from '../shared/services/map.service';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, DoCheck, OnChanges {
  map: Map;
  mapOptions: MapOptions;
  mapPoint: MapPoint;
  layers: Array<Layer>;
  currentLatitude: number;
  currentLongitude: number;
  displayMap: boolean = false;
  @Input() inputFiltersType;
  @Input() inputFiltersDate;
  @Input() inputEventToZoom;
  @Input() inputEvents;
  @Output() outputEvent = new EventEmitter();
  eventToDisplay: Event;
  bounds: LatLngBounds;
  public subCurrentUser: Subscription;
  user: User;

  constructor(
    private userService: UserService,
    private mapService: MapService,
    private eventService: EventService,
    private zone: NgZone,
    private apiService: EventsApiService
  ) {
    this.mapPoint = new MapPoint();
    this.eventToDisplay = new Event();
    this.layers = new Array<any>();
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.currentLatitude = position.coords.latitude;
      this.currentLongitude = position.coords.longitude;
      this.initializeMap();
    });
    this.eventService.getEventFromTopBar().subscribe((event) => {
      this.getZoomOnEvent(new LatLng(event.latitude, event.longitude));
    });
    this.subCurrentUser = this.userService.currentUser.subscribe((user: User) => {
      this.user = user;
    })
  }

  callOpenData() {
    this.apiService.callOpenData();
  }

  private initializeMap() {
    this.mapOptions = {
      center: latLng(this.currentLatitude, this.currentLongitude),
      zoom: 15,
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Map data © OpenStreetMap contributors',
        }),
      ],
    };
    this.displayMap = true;
  }

  private onMapReady(map: Map) {
    this.map = map.on('moveend', () => {
      this.eventService.setBounds(map.getBounds());
    });
    this.eventService.setBounds(map.getBounds());
    const marker = this.mapService.addBlueMarker(this.currentLatitude, this.currentLongitude);
    marker.addTo(this.map).bindTooltip("votre position");
  }

  ngOnChanges(changes: SimpleChanges): void {
    const ptZoom = changes.inputEventToZoom;
    if (typeof ptZoom !== 'undefined') {
      if (typeof ptZoom.currentValue !== 'undefined') {
        const markerZoom = this.mapService.createPoint({
          latitude: ptZoom.currentValue.latitude,
          longitude: ptZoom.currentValue.longitude,
          address: ptZoom.currentValue.address
        })
        this.getZoomOnEvent(markerZoom);
      }
    }
  }

  ngDoCheck(): void {
    if (this.displayMap && this.map) {
      if (this.inputFiltersType !== null && this.inputFiltersType.length >= 1) {
        for (let layer of this.layers) {
          this.clearMap(layer);
        }
        for (let event of this.inputEvents) {
          if (this.inputFiltersType.indexOf(event.type) !== -1) {
            this.newPoint(event.latitude, event.longitude, event.lieu);
            this.createMarker(event);
          }
        }
      } else if (this.inputFiltersDate !== null && this.inputFiltersDate.length >= 1) {
        for (let layer of this.layers) {
          this.clearMap(layer);
        }
        for (let event of this.inputEvents) {
          if (this.inputFiltersDate.indexOf("1 jour") !== -1) {
            if (event.timeLeft.days <= 1) {
              this.newPoint(event.latitude, event.longitude, event.lieu);
              this.createMarker(event);
            }
          }
          if (this.inputFiltersDate.indexOf("2 jours") !== -1) {
            if (event.timeLeft.days <= 2) {
              this.newPoint(event.latitude, event.longitude, event.lieu);
              this.createMarker(event);
            }
          }
          if (this.inputFiltersDate.indexOf("3 jours") !== -1) {
            if (event.timeLeft.days <= 3) {
              this.newPoint(event.latitude, event.longitude, event.lieu);
              this.createMarker(event);
            }
          }
          if (this.inputFiltersDate.indexOf("4 jours") !== -1) {
            if (event.timeLeft.days <= 4) {
              this.newPoint(event.latitude, event.longitude, event.lieu);
              this.createMarker(event);
            }
          }
          if (this.inputFiltersDate.indexOf("5 jours") !== -1) {
            if (event.timeLeft.days <= 5) {
              this.newPoint(event.latitude, event.longitude, event.lieu);
              this.createMarker(event);
            }
          }
          if (this.inputFiltersDate.indexOf("6 jours") !== -1) {
            if (event.timeLeft.days <= 6) {
              this.newPoint(event.latitude, event.longitude, event.lieu);
              this.createMarker(event);
            }
          }
          if (this.inputFiltersDate.indexOf("1 semaine") !== -1) {
            if (event.timeLeft.days <= 7) {
              this.newPoint(event.latitude, event.longitude, event.lieu);
              this.createMarker(event);
            }
          }
          if (this.inputFiltersDate.indexOf("2 semaines") !== -1) {
            if (event.timeLeft.days <= 14) {
              this.newPoint(event.latitude, event.longitude, event.lieu);
              this.createMarker(event);
            }
          }
          if (this.inputFiltersDate.indexOf("3 semaines") !== -1) {
            if (event.timeLeft.days <= 21) {
              this.newPoint(event.latitude, event.longitude, event.lieu);
              this.createMarker(event);
            }
          }
          if (this.inputFiltersDate.indexOf("1 mois") !== -1) {
            if (event.timeLeft.days <= 28) {
              this.newPoint(event.latitude, event.longitude, event.lieu);
              this.createMarker(event);
            }
          }
        }
      } else {
        for (let layer of this.layers) {
          this.clearMap(layer);
        }
        for (let event of this.inputEvents) {
          this.newPoint(event.latitude, event.longitude, event.lieu);
          this.createMarker(event);
        }
      }
    }
  }

  private newPoint(latitude: number, longitude: number, address?: string) {
    this.mapPoint = {
      latitude: latitude,
      longitude: longitude,
      address: address ? address : this.mapPoint.address,
    };
  }

  private createMarker(e) {
    const point = this.mapService.createPoint(this.mapPoint);
    let time = e.timeLeft.days + "j " + e.timeLeft.hours + "h " + e.timeLeft.minutes + "min";
    const layer = marker(point).setIcon(this.getRedIcon())
      .addTo(this.map)
      .on('click', () => {
        this.zone.run(() => {
          this.outputEvent.emit(e);
          this.getZoomOnEvent(point);
        })
      })
      .bindTooltip(time);
    this.layers.push(layer);
  }

  getZoomOnEvent(point: LatLng) {
    this.map.flyTo(point, this.map.getZoom());
  }

  private getRedIcon() {
    return icon({
      iconSize: [50, 50],
      iconAnchor: [13, 41],
      iconUrl: 'assets/icon-red.png',
    });
  }

  backToPosition() {
    const currentPos = this.mapService.createPoint({
      latitude: this.currentLatitude,
      longitude: this.currentLongitude,
      address: '',
    })
    this.map.flyTo(currentPos, this.map.getZoom());
  }

  private clearMap(layer) {
    if (this.map.hasLayer(this.layers[this.layers.indexOf(layer)])) {
      this.map.removeLayer(this.layers[this.layers.indexOf(layer)]);
    }
  }
}
