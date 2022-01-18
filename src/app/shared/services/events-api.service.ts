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

  // signRequestForMusicStory(){
  //   this.http.get<string>('/api/music_story/sign_request', {
  //     params: {
  //       oauth_consumer_key: this.oauth_consumer_key
  //     }
  //   })
  //   .subscribe( (res) => {
  //     this.request = this.request+'&oauth_signature='+res;
  //   })
  // }

  public callOpenData() {
    let cpt = 0;
    for (let i = 10004; i < 12004; i += 20) {
      this.http.get<any>(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=evenements-publics-cibul&q=&rows=20&start=${i}&facet=tags&facet=placename&facet=department&facet=region&facet=city&facet=date_start&facet=date_end&facet=pricing_info&facet=updated_at&facet=city_district&refine.date_start=2022&timezone=Europe%2FParis`)
        .subscribe(res => {
          res.records.forEach(element => {
            cpt++;
            console.log(cpt)
            const f = element.fields;
            let event = new Event();
            event.setName(f.title);
            event.setDescription(f.free_text);
            event.setLieu(f.address);
            event.setLatitude(f.latlon[0]);
            event.setLongitude(f.latlon[1]);
            const timetable: Array<string> = f.timetable.split(" ");
            event.setDateDebut(new Date(timetable[0]));
            event.setDateFin(new Date(timetable[1]));
            event.setSpaceAndTime(f.space_time_info);
            event.setCreateByOwner(false);
            event.setPricingInfo(f.pricing_info);
            event.setScope("public");
            event.setImageUrl(f.image);
            if (typeof f.tags !== 'undefined') {
              const types = f.tags.split(",");
              if (types.indexOf("Théâtre Fémina") !== -1 || types.indexOf("Le Théâtre") !== -1 || types.indexOf("Incandescences") !== -1 || types.indexOf("SPECTACLE") !== -1 || types.indexOf("spectacle de danse") !== -1 || types.indexOf("Théâtre de Thalie") !== -1 || types.indexOf("rire") !== -1 || types.indexOf("danse") !== -1 || types.indexOf("spectacle") !== -1 || types.indexOf("Spectacle") !== -1) {
                event.setType("Spectacle");
              }
              if (types.indexOf("le petit théâtre Cugandais") !== -1 || types.indexOf("THÉÂTRE") !== -1 || types.indexOf("théâtre") !== -1 || types.indexOf("théatre") !== -1 || types.indexOf("theatre") !== -1 || types.indexOf("Théâtre") !== -1 || types.indexOf("théâtre musical") !== -1) {
                event.setType("Theatre");
              }
              if (types.indexOf("Musique") !== -1 || types.indexOf("CONCERT-DECOUVERTE") !== -1 || types.indexOf("pop") !== -1 || types.indexOf("Rap / Hip Hop") !== -1 || types.indexOf("#concert") !== -1 || types.indexOf("Thrash Metal") !== -1 || types.indexOf("Rock") !== -1 || types.indexOf("RAP") !== -1 || types.indexOf("rap") !== -1 || types.indexOf("JAZZ") !== -1 || types.indexOf("jazz") !== -1 || types.indexOf("guitare classique") !== -1 || types.indexOf("CONCERT") !== -1 || types.indexOf("orchestre") !== -1 || types.indexOf("guitariste chanteuse") !== -1 || types.indexOf("musique") !== -1 || types.indexOf("concert") !== -1 || types.indexOf("Concert") !== -1 || types.indexOf("Bachar Mar-Khalifé") !== -1) {
                event.setType("Concert");
              }
              if (types.indexOf("cirque") !== -1 || types.indexOf("Cirque") !== -1) {
                event.setType("Cirque");
              }
              if (types.indexOf("Hockey sur glace") !== -1 || types.indexOf("basket féminin") !== -1 || types.indexOf("sport") !== -1 || types.indexOf("skate") !== -1 || types.indexOf("Spéléologie") !== -1) {
                event.setType("Sport");
              }
              if (types.indexOf("Exposition") !== -1 || types.indexOf("exposition") !== -1) {
                event.setType("Exposition");
              }
              if (types.indexOf("visite guidée") !== -1 || types.indexOf("Visite") !== -1 || types.indexOf("visite") !== -1) {
                event.setType("Visite");
              }
              if (types.indexOf("Salon") !== -1 || types.indexOf("salon") !== -1) {
                event.setType("Salon");
              }
              if (types.indexOf("Essonne") !== -1 || types.indexOf("opera") !== -1 || types.indexOf("opéra") !== -1) {
                event.setType("Opera");
              }
              if (types.indexOf("Cinéma") !== -1 || types.indexOf("Cinema") !== -1 || types.indexOf("cinema") !== -1 || types.indexOf("cinéma") !== -1) {
                event.setType("Cinema");
              }
              if (event.getType() == null) {
                event.setType("Divers");
              }
              this.eventService.createEvent(event);
            }
          });
        })
    }
  }

  getEventsFromPredictHQ(offset: number) {
    return this.http.get<any>('https://api.predicthq.com/v1/events', {
      headers: {
        Authorization: "Bearer aWmqoOlYofV-atAnbidoNjtupvopmThQOHbUyp7Z",
        Accept: "application/json"
      },
      params: {
        country: "FR",
        limit: "10000",
        offset: `${offset}`
      }
    })
  }
}
