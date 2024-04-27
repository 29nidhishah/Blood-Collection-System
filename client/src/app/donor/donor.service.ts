import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonorService {

  private donorURL = 'http://localhost:3001/donors';

  constructor(private http: HttpClient) { }

  public fetchAllDonors(): Observable<any> {
    return this.http.get(this.donorURL + '/_all');
  }

  public getDonorByKey(key: string): Observable<any> {
    return this.http.get(this.donorURL + `/${key}`);
  }

  public getDonorHistoryByKey(key: string): Observable<any> {
    return this.http.get(this.donorURL + `/${key}/history`);
  }

  public createDonor(donorData: any): Observable<any> {
    return this.http.post(this.donorURL + '/register', donorData);
  }

  public updateDonorPersonalDetails(key: string, data: any): Observable<any> {
    return this.http.patch(this.donorURL + `/${key}/details/personal`, data);
  }

  public updateDonorMedicalDetails(key: string, data: any): Observable<any> {
    return this.http.patch(this.donorURL + `/${key}/details/medical`, data);
  }

  public grantAccessToDoctor(donorId: string, doctorId: string): Observable<any> {
    return this.http.patch(this.donorURL + `/${donorId}/grant/${doctorId}`, {});
  }

  public revokeAccessFromDoctor(donorId: string, doctorId: string): Observable<any> {
    return this.http.patch(this.donorURL + `/${donorId}/revoke/${doctorId}`, {});
  }
}
