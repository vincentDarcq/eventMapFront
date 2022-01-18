import { Component, DoCheck, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GeoService } from '../shared/services/geo.service';
import { GeoResponse } from '../shared/models/geo-response.model';
import { EventService } from '../shared/services/event.service';
import { Events } from '../shared/models/event-list';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { Event } from '../shared/models/event';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { latLng, MapOptions, tileLayer, Map, marker } from 'leaflet';
import { MapService } from '../shared/services/map.service';
import { MapPoint } from '../shared/models/map-point.model';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit, DoCheck, OnDestroy {

  @ViewChild('fileInput1', { static: true }) inputRef1: ElementRef;
  @ViewChild('fileInput2', { static: true }) inputRef2: ElementRef;
  @ViewChild('fileInput3', { static: true }) inputRef3: ElementRef;

  map: Map;
  mapPoint: MapPoint;
  lastLayer: any;
  searchResults: GeoResponse[];
  events = Events;
  createur: User;
  newEvent: Event;
  id: string;
  oldPlace: string;
  mapOptions: MapOptions;
  displayMap: boolean = false;
  changePlace: boolean = false;
  beginTime: string;
  endTime: string;
  scope: string;
  invitations: FormControl;
  errorPlace: string;
  errorCreator: string;
  serverImg: String = "/upload?img=";
  public subscription: Subscription;

  constructor(
    private markerService: MapService,
    private geoService: GeoService,
    private eventService: EventService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.searchResults = [];
    this.createur = new User();
    this.invitations = new FormControl();
    this.newEvent = new Event();
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('_id');
    });
    this.subscription = this.userService.currentUser.subscribe((user) => {
      this.createur.setName(user.name);
      this.createur.setEmail(user.email);
      this.createur.setAmis(user.amis);
    });
    if (this.id) {
      this.eventService.events.subscribe((events: Array<Event>) => {
        this.newEvent = events.find((event) => this.id === event._id);
        this.newEvent.setDateDebut(new Date(this.newEvent.dateDebut));
      });
    }
  }

  ngDoCheck() {
    if (this.newEvent && this.newEvent.lieu && this.newEvent.lieu.length > 0 && this.changePlace) {
      this.changePlace = false;
      for (let result of this.searchResults) {
        if (result.address === this.newEvent.lieu) {
          this.newEvent.setLatitude(result.latitude);
          this.newEvent.setLongitude(result.longitude);
          if (!this.mapOptions) {
            this.initializeMap();
          } else {
            this.updateMap();
          }
        }
      };
    }
  }

  openFile1() {
    this.inputRef1.nativeElement.click();
  }

  openFile2() {
    this.inputRef2.nativeElement.click();
  }

  openFile3() {
    this.inputRef3.nativeElement.click();
  }

  selectAdress() {
    this.changePlace = true;
  }

  public onImage1Change(event) {
    if (typeof this.newEvent.formData === 'undefined') {
      this.newEvent.formData = new FormData();
    }
    if (event.target.files[0]) {
      this.newEvent.formData.append('image1', event.target.files[0], event.target.files[0].name);
    }
  }

  public onImage2Change(event) {
    if (typeof this.newEvent.formData === 'undefined') {
      this.newEvent.formData = new FormData();
    }
    if (event.target.files[0]) {
      this.newEvent.formData.append('image2', event.target.files[0], event.target.files[0].name);
    }
  }

  public onImage3Change(event) {
    if (typeof this.newEvent.formData === 'undefined') {
      this.newEvent.formData = new FormData();
    }
    if (event.target.files[0]) {
      this.newEvent.formData.append('image3', event.target.files[0], event.target.files[0].name);
    }
  }

  createEvent() {
    if (typeof this.newEvent.latitude === 'undefined') {
      this.errorPlace = "Vous devez sélectionner une adresse parmis celles proposées en fonction de votre recherche";
      return;
    }
    if (this.id) {
      this.whichCreator();
      this.makeDate();
      this.checkScope();
      this.eventService.editEvent(this.newEvent, this.newEvent.formData);
      this.router.navigate(['/']);
    } else {
      this.whichCreator();
      this.makeDate();
      this.checkScope();
      this.eventService.createEvent(this.newEvent, this.newEvent.formData);
      this.router.navigate(['/']);
    }
  }

  checkScope() {
    if (this.scope === "privé") {
      this.newEvent.setScope("privé");
      this.newEvent.setInvites(this.invitations.value);
    } else {
      this.newEvent.setScope("public");
    }
  }

  makeDate() {
    let dateform = new Date(this.newEvent.dateDebut);
    if (this.newEvent.beginTime) {
      dateform.setHours(Number(this.newEvent.beginTime.substring(0, 2)));
      dateform.setMinutes(Number(this.newEvent.beginTime.substring(3, 5)));
    }
    this.newEvent.setDateDebut(dateform);
    if (this.newEvent.dateFin) {
      dateform = new Date(this.newEvent.dateFin);
      if (this.newEvent.endTime) {
        dateform.setHours(Number(this.newEvent.endTime.substring(0, 2)));
        dateform.setMinutes(Number(this.newEvent.endTime.substring(3, 5)));
      }
      this.newEvent.setDateFin(dateform);
    }
  }

  whichCreator() {
    if (!this.createur.name) {
      this.errorCreator = "Vous n'êtes pas connecté en tant qu'utilisateur connu, vous devez donc spécifier un organisateur pour cet évènement ou vous connecter";
      return;
    }
    if (!this.newEvent.createur && !this.newEvent.emailCreateur) {
      this.newEvent.setCreateur(this.createur.name);
      this.newEvent.setEmailCreateur(this.createur.email);
      this.newEvent.setCreateByOwner(true);
    } else {
      this.newEvent.setCreateByOwner(false);
    }
  }

  addresseFromGeoApi() {
    this.geoService.getLocationFromGeoapify(this.newEvent.lieu).subscribe((results: any) => {
      this.searchResults = new Array<GeoResponse>();
      for (let feature of results.features) {
        const result = new GeoResponse(
          feature.properties.lat, feature.properties.lon, feature.properties.formatted)
        this.searchResults.push(result);
      }
    });
  }

  private initializeMap() {
    this.mapOptions = {
      center: latLng(this.newEvent.latitude, this.newEvent.longitude),
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
    this.map = map;
    this.newPoint(this.newEvent.latitude, this.newEvent.longitude);
    const point = this.markerService.createPoint(this.mapPoint)
    this.lastLayer = marker(point).setIcon(this.markerService.getRedIcon()).addTo(this.map);
  }

  private updateMap() {
    if (this.map && this.map.hasLayer(this.lastLayer)) {
      this.map.removeLayer(this.lastLayer);
      this.newPoint(this.newEvent.latitude, this.newEvent.longitude);
      this.createMarker();
    }
  }

  private newPoint(latitude: number, longitude: number, address?: string) {
    this.mapPoint = {
      latitude: latitude,
      longitude: longitude,
      address: ""
    };
  }

  private createMarker() {
    const point = this.markerService.createPoint(this.mapPoint)
    this.lastLayer = marker(point).setIcon(this.markerService.getRedIcon())
      .addTo(this.map).on('click', (event) => {
        console.log(event)
      })
    this.map.flyTo(point, this.map.getZoom());
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }
}
