import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUser: BehaviorSubject<User>;
  public subscription: Subscription;

  constructor(
    private http: HttpClient
  ) {
    this.subscription = this.getCurrentUser();
    this.currentUser = new BehaviorSubject(new User());
  }

  getCurrentUser() {
    return this.http.get<User>('/api/auth/current').pipe(
      tap((user: User) => {
        this.currentUser.next(user);
      }),
      switchMap(() => {
        return this.currentUser;
      })
    ).subscribe(() => {
      this.subscription.unsubscribe();
    })
  }

  setCurrentUser() {
    this.http.get<User>('/api/auth/current').subscribe((user: User) => {
      this.currentUser.next(user);
    });
  }

  public getUser(user: string): Observable<User> {
    return this.http.get<User>(`/api/auth/user`, {
      params: {
        user: user
      }
    }).pipe(
      tap((user: User) => {
        return user;
      })
    )
  }

  public updateListFriends(currentUser: User, friend: string, type?: string) {
    if (type === "add") {
      currentUser.amis.push(friend);
    } else {
      currentUser.amis.splice(currentUser.amis.indexOf(friend), 1);
    }
    this.currentUser.next(currentUser);
  }
}

