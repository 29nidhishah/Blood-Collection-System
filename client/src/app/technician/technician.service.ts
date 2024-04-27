import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {

  private technicianURL = 'http://localhost:3001/technicians';

  constructor(private http: HttpClient) { }

  public createTechnician(data: any): Observable<any> {
    return this.http.post(this.technicianURL + '/register', data);
  }

  public getTechniciansByHospitalId(hospitalId: number): Observable<any> {
    return this.http.get(this.technicianURL + `/${hospitalId}/_all`);
  }

  public getTechnicianByHospitalId(hospitalId: string, techId: any): Observable<any> {
    return this.http.get(this.technicianURL + `/${hospitalId}/${techId}`);
  }
}
