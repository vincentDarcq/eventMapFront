import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeoResponse } from '../models/geo-response.model';
import { map } from 'rxjs/operators';
import { BASE_NOMINATIM_URL, DEFAULT_VIEW_BOX } from '../../app.constants';

@Injectable()
export class GeoService {

  api_key = '5d8f413175434fb2bc4593e77c84aeef';
  constructor(private http: HttpClient) { }

  addressLookupFromNominatim(req?: any): Observable<GeoResponse[]> {
    let url = `https://${BASE_NOMINATIM_URL}?text=${req}&apiKey=201b5061580e488ead945c5658496306`;
    return this.http
      .get(url)
      .pipe(
        map((data: any[]) =>
          data.map(
            (item: any) =>
              new GeoResponse(item.lat, item.lon, item.display_name)
          )
        )
      );
  }

  getLocationFromGeoapify(req: string) {
    req.replace(' ', '%20');
    const url =
      // "https://cors-anywhere.herokuapp.com/" +
      "https://api.geoapify.com/v1/geocode/autocomplete"
    return this.http.get(url, {
      params: {
        text: req,
        apiKey: this.api_key
      }
    });
  }
}
