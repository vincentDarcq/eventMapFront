import { Injectable } from '@angular/core';
import { Marker, marker, icon, latLng, LatLng, Map } from 'leaflet';
import { MapPoint } from '../models/map-point.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  public addBlueMarker(Latitude: number, Longitude: number): Marker {
    const marker = new Marker([Latitude, Longitude], {
      title: "your position", riseOnHover: true, riseOffset: 2
    }).setIcon(
      icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/marker-icon.png',
      })
    );
    return marker;
  }

  public getRedIcon() {
    return icon({
      iconSize: [50, 50],
      iconAnchor: [13, 41],
      iconUrl: 'assets/icon-red.png',
    });
  }

  public createPoint(mapPoint: MapPoint): LatLng {
    const coordinates = latLng([
      mapPoint.latitude,
      mapPoint.longitude,
    ]);
    return coordinates;
  }
}
