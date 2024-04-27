// geo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeoService {
  private apiUrl = 'http://localhost:3001/geo';

  constructor(private http: HttpClient) {}

  sendCoordinates(latitude: number, longitude: number): Observable<any> {
    const url = `${this.apiUrl}/${latitude}/${longitude}`;
    return this.http.get(url); // The second parameter is the body of the POST request. In this case, we send null since the coordinates are in the URL.
  }
}

