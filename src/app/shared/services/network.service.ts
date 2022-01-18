import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Ask } from '../models/ask';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  public asks: Array<Ask>;

  constructor(private http: HttpClient) {
    this.asks = new Array<Ask>();
  }

  public getAsks() {
    return this.http.get<Array<Ask>>(`/network/getAks`)
  }

  public askFriend(askFriend: {
    demandeur: string,
    destinataire: string
  }): Observable<Ask> {
    this.asks = new Array();
    return this.http.post<Ask>(`/network/askFriend`, askFriend).pipe(
      tap((ask: Ask) => {
        this.asks.push(ask);
        return ask;
      })
    )
  }

  public deleteAsk(id: string) {
    return this.http.delete<Ask>(`/network/deleteAskFriend`, {
      params: {
        askId: id
      }
    })
  }

  public acceptFriend(askId: string, destinataire: string, demandeur: string) {
    return this.http.get<any>(`/network/acceptFriend`, {
      params: {
        askId: askId,
        destinataire: destinataire,
        demandeur: demandeur
      }
    })
  }

  public deniedFriend(askId: string) {
    return this.http.get<any>(`/network/deniedFriend`, {
      params: {
        askId: askId
      }
    })
  }

  public deleteFriend(user: string, ami: string) {
    return this.http.get<any>(`/network/deleteFriend`, {
      params: {
        user: user,
        ami: ami
      }
    })
  }

}
