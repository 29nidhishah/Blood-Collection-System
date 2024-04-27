// geo-button.component.ts
import { Component } from '@angular/core';
import { GeoService } from './geo.service';

@Component({
  selector: 'app-geo-button',
  template: `
    <button class="geo-btn" (click)="getLocation()">Get nearest hospitals</button>
    <div *ngIf="responseData && responseData.length > 0">
    <h3>Nearest hospitals from your current location:</h3>
    <ul>
    <li *ngFor="let item of responseData">
      {{ item | json }}
    </li>
  </ul>
  </div>
  `,
  styles: [`
    .geo-btn {
      /* Add your styling for the button if needed */
    }
  `]
})
export class GeoButtonComponent {
  responseData=[];
  constructor(private geoService: GeoService) {}

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Send coordinates to the server using the GeoService
          this.geoService.sendCoordinates(latitude, longitude).subscribe(
            (response) => {
              console.log('Coordinates sent successfully:', response);
              this.responseData=response;
              // Handle success if necessary
            },
            (error) => {
              console.error('Error sending coordinates:', error);
              // Handle error if necessary
            }
          );
        },
        (error) => {
          console.error('Error getting location:', error);
          // Handle error if necessary
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Handle lack of geolocation support if necessary
    }
  }
}

