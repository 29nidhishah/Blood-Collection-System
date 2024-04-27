// Import necessary modules from Angular
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-all-hospitals',
  template: `
    <div *ngIf="data">
      <h2>Hospitals List:</h2>
      <ul>
        <li *ngFor="let hospital of data">
          <div>
            <strong>Hospital Name:</strong> {{ hospital.HospitalName }}
          </div>
          <div>
            <strong>City:</strong> {{ hospital.City }}
          </div>
          <div>
            <strong>Area:</strong> {{ hospital.Area }}
          </div>
          <div>
            <strong>Address:</strong> {{ hospital.Address }}
          </div>
          <div>
            <strong>Latitude:</strong> {{ hospital.Latitude }}
          </div>
          <div>
            <strong>Longitude:</strong> {{ hospital.Longitude }}
          </div>
          <hr />
        </li>
      </ul>
    </div>
    <div *ngIf="error">
      <p>Error fetching hospitals: {{ error }}</p>
    </div>
  `,
})
export class ViewAllHospitalsComponent implements OnInit {
  data: any;
  error!: string;

  // Inject the HttpClient service in the constructor
  constructor(private http: HttpClient) {}

  // Implement the OnInit interface to perform initialization
  ngOnInit() {
    // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
    const apiUrl = 'http://localhost:3001/viewhospitals';

    // Make the HTTP request
    this.http.get(apiUrl).subscribe(
      (response) => {
        // Handle successful response
        this.data = response;
      },
      (err) => {
        // Handle error
        this.error = err.message || 'An error occurred';
      }
    );
  }
}

