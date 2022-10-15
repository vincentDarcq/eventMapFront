import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Event } from '../models/event';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class EventsApiService {

  oauth_consumer_key: string = "a14d1c112fde9c831ff661131e0c9a74aa9245b1";
  oauth_signature: string = 'PlcsrTwPRsL92IJgtOfphj/N/8Q=';
  // url: string = "http://api.music-story.com/oauth/request_token?";
  // request: string = this.url+'oauth_consumer_key='+this.oauth_consumer_key;

  secret_client_predicthq: string = 'pXvVMluSU15u-SCe-VGGuPqursMVXPvv8JITamlKQHe2fbmMdeEz0w';
  client_ID_predicthq: string = 'CeHqBL1ZrqQ';
  token_predicthq: string = 'aWmqoOlYofV-atAnbidoNjtupvopmThQOHbUyp7Z';
  events: Array<any>;

  constructor(
    private http: HttpClient,
    private eventService: EventService
  ) { }

  public callOpenData() {
    let cpt = 0;
    for (let i = 3001; i < 5000; i += 20) {
      this.http.get<any>(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=evenements-publics-openagenda&q=&rows=20&start=${i}&facet=keywords_fr&facet=updatedat&facet=firstdate_begin&facet=firstdate_end&facet=lastdate_begin&facet=lastdate_end&facet=location_city&facet=location_department&facet=location_region&facet=location_countrycode&refine.keywords_fr=CONCERT`)
        .subscribe(res => {
          res.records.forEach(element => {
            cpt++;
            console.log("concert : "+cpt);
            const f = element.fields;
            let event = new Event();
            event.setName(f.title_fr);
            event.setDescription(f.description_fr);
            event.setLieu(f.location_address);
            event.setLatitude(f.location_coordinates[0]);
            event.setLongitude(f.location_coordinates[1]);
            event.setDateDebut(new Date(f.firstdate_begin));
            event.setDateFin(new Date(f.firstdate_end));
            event.setSpaceAndTime(f.space_time_info);
            event.setCreateByOwner(false);
            event.setPricingInfo(f.conditions_fr);
            event.setScope("public");
            event.setImageUrl(f.originalimage);
            event.setType("Concert");
            this.eventService.createEventFromOpendata(event);
          });
        })
      this.http.get<any>(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=evenements-publics-openagenda&q=&rows=20&start=${i}&facet=keywords_fr&facet=updatedat&facet=firstdate_begin&facet=firstdate_end&facet=lastdate_begin&facet=lastdate_end&facet=location_city&facet=location_department&facet=location_region&facet=location_countrycode&refine.keywords_fr=exposition`)
        .subscribe(res => {
          res.records.forEach(element => {
            cpt++;
            console.log("exposition : "+cpt);
            const f = element.fields;
            let event = new Event();
            event.setName(f.title_fr);
            event.setDescription(f.description_fr);
            event.setLieu(f.location_address);
            event.setLatitude(f.location_coordinates[0]);
            event.setLongitude(f.location_coordinates[1]);
            event.setDateDebut(new Date(f.firstdate_begin));
            event.setDateFin(new Date(f.firstdate_end));
            event.setSpaceAndTime(f.space_time_info);
            event.setCreateByOwner(false);
            event.setPricingInfo(f.conditions_fr);
            event.setScope("public");
            event.setImageUrl(f.originalimage);
            event.setType("Exposition");
            this.eventService.createEventFromOpendata(event);
          });
        })
      this.http.get<any>(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=evenements-publics-openagenda&q=&rows=20&start=${i}&facet=keywords_fr&facet=updatedat&facet=firstdate_begin&facet=firstdate_end&facet=lastdate_begin&facet=lastdate_end&facet=location_city&facet=location_department&facet=location_region&facet=location_countrycode&refine.keywords_fr=sport`)
        .subscribe(res => {
          res.records.forEach(element => {
            cpt++;
            console.log("sport : "+cpt);
            const f = element.fields;
            let event = new Event();
            event.setName(f.title_fr);
            event.setDescription(f.description_fr);
            event.setLieu(f.location_address);
            event.setLatitude(f.location_coordinates[0]);
            event.setLongitude(f.location_coordinates[1]);
            event.setDateDebut(new Date(f.firstdate_begin));
            event.setDateFin(new Date(f.firstdate_end));
            event.setSpaceAndTime(f.space_time_info);
            event.setCreateByOwner(false);
            event.setPricingInfo(f.conditions_fr);
            event.setScope("public");
            event.setImageUrl(f.originalimage);
            event.setType("Sport");
            this.eventService.createEventFromOpendata(event);
          });
        })
      this.http.get<any>(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=evenements-publics-openagenda&q=&rows=20&start=${i}&facet=keywords_fr&facet=updatedat&facet=firstdate_begin&facet=firstdate_end&facet=lastdate_begin&facet=lastdate_end&facet=location_city&facet=location_department&facet=location_region&facet=location_countrycode&refine.keywords_fr=spectacle`)
        .subscribe(res => {
          res.records.forEach(element => {
            cpt++;
            console.log("spectacle : "+cpt);
            const f = element.fields;
            let event = new Event();
            event.setName(f.title_fr);
            event.setDescription(f.description_fr);
            event.setLieu(f.location_address);
            event.setLatitude(f.location_coordinates[0]);
            event.setLongitude(f.location_coordinates[1]);
            event.setDateDebut(new Date(f.firstdate_begin));
            event.setDateFin(new Date(f.firstdate_end));
            event.setSpaceAndTime(f.space_time_info);
            event.setCreateByOwner(false);
            event.setPricingInfo(f.conditions_fr);
            event.setScope("public");
            event.setImageUrl(f.originalimage);
            event.setType("Spectacle");
            this.eventService.createEventFromOpendata(event);
          });
        })
      this.http.get<any>(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=evenements-publics-openagenda&q=&rows=20&start=${i}&facet=keywords_fr&facet=updatedat&facet=firstdate_begin&facet=firstdate_end&facet=lastdate_begin&facet=lastdate_end&facet=location_city&facet=location_department&facet=location_region&facet=location_countrycode&refine.keywords_fr=salon`)
        .subscribe(res => {
          res.records.forEach(element => {
            cpt++;
            console.log("salon : "+cpt);
            const f = element.fields;
            let event = new Event();
            event.setName(f.title_fr);
            event.setDescription(f.description_fr);
            event.setLieu(f.location_address);
            event.setLatitude(f.location_coordinates[0]);
            event.setLongitude(f.location_coordinates[1]);
            event.setDateDebut(new Date(f.firstdate_begin));
            event.setDateFin(new Date(f.firstdate_end));
            event.setSpaceAndTime(f.space_time_info);
            event.setCreateByOwner(false);
            event.setPricingInfo(f.conditions_fr);
            event.setScope("public");
            event.setImageUrl(f.originalimage);
            event.setType("Salon");
            this.eventService.createEventFromOpendata(event);
          });
        })
      this.http.get<any>(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=evenements-publics-openagenda&q=&rows=20&start=${i}&facet=keywords_fr&facet=updatedat&facet=firstdate_begin&facet=firstdate_end&facet=lastdate_begin&facet=lastdate_end&facet=location_city&facet=location_department&facet=location_region&facet=location_countrycode&refine.keywords_fr=cinema`)
        .subscribe(res => {
          res.records.forEach(element => {
            cpt++;
            console.log("cinema : "+cpt);
            const f = element.fields;
            let event = new Event();
            event.setName(f.title_fr);
            event.setDescription(f.description_fr);
            event.setLieu(f.location_address);
            event.setLatitude(f.location_coordinates[0]);
            event.setLongitude(f.location_coordinates[1]);
            event.setDateDebut(new Date(f.firstdate_begin));
            event.setDateFin(new Date(f.firstdate_end));
            event.setSpaceAndTime(f.space_time_info);
            event.setCreateByOwner(false);
            event.setPricingInfo(f.conditions_fr);
            event.setScope("public");
            event.setImageUrl(f.originalimage);
            event.setType("Cinema");
            this.eventService.createEventFromOpendata(event);
          });
        })
      this.http.get<any>(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=evenements-publics-openagenda&q=&rows=20&start=${i}&facet=keywords_fr&facet=updatedat&facet=firstdate_begin&facet=firstdate_end&facet=lastdate_begin&facet=lastdate_end&facet=location_city&facet=location_department&facet=location_region&facet=location_countrycode&refine.keywords_fr=cirque`)
        .subscribe(res => {
          res.records.forEach(element => {
            cpt++;
            console.log("cirque : "+cpt);
            const f = element.fields;
            let event = new Event();
            event.setName(f.title_fr);
            event.setDescription(f.description_fr);
            event.setLieu(f.location_address);
            event.setLatitude(f.location_coordinates[0]);
            event.setLongitude(f.location_coordinates[1]);
            event.setDateDebut(new Date(f.firstdate_begin));
            event.setDateFin(new Date(f.firstdate_end));
            event.setSpaceAndTime(f.space_time_info);
            event.setCreateByOwner(false);
            event.setPricingInfo(f.conditions_fr);
            event.setScope("public");
            event.setImageUrl(f.originalimage);
            event.setType("Cirque");
            this.eventService.createEventFromOpendata(event);
          });
        })
    }
  }

}
