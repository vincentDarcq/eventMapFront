import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MailsService {

  constructor(private http: HttpClient) { }

  forgotPass(to: string) {
    this.http.post<any>(`/api/mails/forgotPass`, { mail: to }).subscribe((res) => {
      console.log(res);
    })
  }

}
