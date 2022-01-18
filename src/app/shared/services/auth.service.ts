import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, timer, of, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { JwtToken } from '../models/jwt-token.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public jwtToken: BehaviorSubject<JwtToken> = new BehaviorSubject({
    isAuthenticated: null,
    token: null,
  });
  public subscription: Subscription;
  constructor(private http: HttpClient,
    private route: Router) {
    this.initToken();
    //this.subscription = this.initTimer();
  }

  public initTimer() {
    console.log("init timer")
    return timer(1000, 250000).pipe(
      switchMap(() => {
        if (localStorage.getItem('jwt')) {
          return this.http.get<string>('/api/auth/refresh-token').pipe(
            tap((token: string) => {
              this.jwtToken.next({
                isAuthenticated: true,
                token: token
              });
              localStorage.setItem('jwt', token);
            }
            ))
        } else {
          return of(null);
        }
      })
    ).subscribe(() => { }, err => {
      this.jwtToken.next({
        isAuthenticated: false,
        token: null
      });
      localStorage.removeItem('jwt');
      this.subscription.unsubscribe();
    });
  }

  private initToken() {
    const token = localStorage.getItem('jwt');
    if (token) {
      this.jwtToken.next({
        isAuthenticated: true,
        token: token,
      });
    } else {
      this.jwtToken.next({
        isAuthenticated: false,
        token: null,
      });
    }
  }

  public signup(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/signup', user);
  }

  public signin(credentials: {
    email: string;
    password: string;
  }): Observable<string> {
    return this.http.post<string>('/api/auth/signin', credentials).pipe(
      tap((token: string) => {
        this.jwtToken.next({
          isAuthenticated: true,
          token: token,
        });
        localStorage.setItem('jwt', token);
        //this.subscription = this.initTimer();
      })
    );
  }

  public editPassword(infos: {
    email: string;
    oldPass: string;
    newPass: string
  }) {
    return this.http.post<string>('/api/auth/editPass', infos);
  }

  public logout() {
    this.jwtToken.next({
      isAuthenticated: false,
      token: null,
    });
    localStorage.removeItem('jwt');
    this.route.navigate(['/']);
  }
}
