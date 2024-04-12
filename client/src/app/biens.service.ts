import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  // getBien(id: string): Observable<any> {
  //   return this.http.get(`${this.url}/${id}`);
  // }
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
