import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'http://localhost:8888/locations'; // Adjust the URL based on your environment

  constructor(private http: HttpClient) { }

  addLocation(locationData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };
    return this.http.post(`${this.apiUrl}/ajouter`, locationData);
  }

  getLocationsByLocataireId(mail: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/loueur/${mail}`);
  }

  deleteLocationById(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/supprimer/${id}`);
  }
}
