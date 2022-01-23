import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { User } from '../shared/models/user.model';
import { EventService } from '../shared/services/event.service';
import { UserService } from '../shared/services/user.service';
import { Event } from '../shared/models/event';
import { NetworkService } from '../shared/services/network.service';
import { Ask } from '../shared/models/ask';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.component.html',
  styleUrls: ['./other-profile.component.css']
})
export class OtherProfileComponent implements OnInit, DoCheck, OnDestroy {

  profile: string;
  user: User;
  events: Array<Event>;
  currentUser: User;
  asks: Array<Ask>;
  ask: Ask;
  asked: boolean = false;
  toAnswer: boolean = false;
  friend: boolean = false;
  public subCurrentUser: Subscription;
  public subEvents: Subscription;

  constructor(private userService: UserService,
    private networkService: NetworkService,
    private eventService: EventService,
    private route: ActivatedRoute) {
    this.user = new User();
    this.events = new Array<Event>();
    this.asks = new Array<Ask>();
  }

  ngOnInit(): void {
    this.profile = this.route.snapshot.paramMap.get('user');
    this.userService.getUser(this.profile).subscribe((user) => {
      this.user = user
      if (this.events.length === 0) {
        this.subEvents = this.eventService.getEventsByUser(user.email).subscribe((events: Array<Event>) => {
          this.events = events;
        })
      }
    });
    this.subCurrentUser = this.userService.currentUser.subscribe((user: User) => {
      this.currentUser = user;
    })
    this.networkService.getAsks().subscribe((asks) => {
      for (let ask of Object.keys(asks)) {
        const a = asks[ask]
        const newAsk = new Ask(a._id, a.demandeur, a.destinataire);
        this.asks.push(newAsk);
      }
    });
  }

  ngDoCheck(): void {
    if (this.currentUser && this.user && !this.friend) {
      for (let ami of this.user.amis) {
        if (ami === this.currentUser.name) {
          this.friend = true;
        }
      }
    }
    if (this.asks.length > 0 && !this.asked && this.currentUser) {
      for (let ask of this.asks) {
        this.ask = new Ask(ask.id, ask.demandeur, ask.destinataire);
        if (ask.demandeur === this.currentUser.name && ask.destinataire === this.profile) {
          this.asked = true;
        } else if (ask.demandeur === this.profile && ask.destinataire === this.currentUser.name) {
          this.toAnswer = true;
        }
      }
    }
  }

  askFriend() {
    this.networkService.askFriend({
      demandeur: this.currentUser.name,
      destinataire: this.profile
    }).subscribe((ask) => {
      this.asks.push(ask);
      this.asked = true;
    })
  }

  cancelAskFriend() {
    this.networkService.deleteAsk(this.ask.id).subscribe(() => {
      this.asks.splice(this.asks.indexOf(this.ask, 1));
      this.asked = false;
    });
  }

  acceptFriend() {
    this.networkService.acceptFriend(
      this.ask.id, this.currentUser.name, this.profile).subscribe((res) => {
        this.asks.splice(this.asks.indexOf(res, 1));
        this.userService.updateListFriends(this.currentUser, this.profile, "add");
        this.toAnswer = false;
        this.friend = true;
      })
  }

  deniedFriend() {
    this.networkService.deniedFriend(this.ask.id).subscribe((res) => {
      this.asks.splice(this.asks.indexOf(res, 1));
      this.toAnswer = false;
    })
  }

  ngOnDestroy(): void {
    if (this.subCurrentUser) { this.subCurrentUser.unsubscribe(); }
  }
}
