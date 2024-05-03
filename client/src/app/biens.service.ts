import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BiensService {

  private url = 'http://localhost:8888/biens';

  constructor(private http: HttpClient) { }

  getBiens(): Observable<any> {
    return this.http.get(this.url);
  }

  getAvisBienById(id: string): Observable<any> {
    return this.http.get(`${this.url}/avis/${id}`);
  }

  getUserByIdBien(id: string): Observable<any> {
    return this.http.get(`${this.url}/user/${id}`);
  }

  getBiensFiltered(filters: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.url}/filter`, JSON.stringify(filters), { headers });
  }

  getUserByMail(mail: string): Observable<any> {
    return this.http.get(`http://localhost:8888/utilisateur/${mail}`);
  }

  getAvisByIdBien(id: string): Observable<any> {
    return this.http.get(`${this.url}/avis/${id}`);
  }

  // getBiensFiltered(filters: any = {}): Observable<any> {
  //   let params = new HttpParams();
  //   if (filters.destination) {
  //     params = params.append('destination', filters.destination);
  //   }
  //   if (filters.arrival) {
  //     params = params.append('arrival', filters.arrival);
  //   }
  //   if (filters.departure) {
  //     params = params.append('departure', filters.departure);
  //   }
  //   if (filters.travelers) {
  //     params = params.append('travelers', filters.travelers);
  //   }
  //
  //   return this.http.get(this.url, { params });
  // }

  getBien(id: string): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }

  //
  // addBien(bien: any): Observable<any> {
  //   return this.http.post(this.url, bien);
  // }
  //
  // updateBien(id: string, bien: any): Observable<any> {
  //   return this.http.put(`${this.url}/${id}`, bien);
  // }
  //
  // deleteBien(id: string): Observable<any> {
  //   return this.http.delete(`${this.url}/${id}`);
  // }

}
