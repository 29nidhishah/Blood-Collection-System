// Import necessary modules from Angular
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-insert-hospital',
  template: `
    <div>
      <h2>Insert Hospital Details</h2>
      <form (submit)="submitForm()" class="hospital-form">
        <div class="form-group">
          <label for="hospitalName">Hospital Name:</label>
          <input type="text" id="hospitalName" [(ngModel)]="hospitalName" name="hospitalName" required>
        </div>

        <div class="form-group">
          <label for="city">City:</label>
          <input type="text" id="city" [(ngModel)]="city" name="city" required>
        </div>

        <div class="form-group">
          <label for="area">Area:</label>
          <input type="text" id="area" [(ngModel)]="area" name="area" required>
        </div>

        <div class="form-group">
          <label for="latitude">Latitude:</label>
          <input type="text" id="latitude" [(ngModel)]="latitude" name="latitude" required>
        </div>

        <div class="form-group">
          <label for="longitude">Longitude:</label>
          <input type="text" id="longitude" [(ngModel)]="longitude" name="longitude" required>
        </div>

        <div class="form-group">
          <label for="address">Address:</label>
          <input type="text" id="address" [(ngModel)]="address" name="address" required>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  `,
  styles: [`
    .hospital-form {
      max-width: 400px;
      margin: auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      font-weight: bold;
      margin-bottom: 5px;
    }

    input {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    button {
      background-color: #4caf50;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background-color: #45a049;
    }
  `]
})

export class InsertHospitalComponent {
  hospitalName: string = '';
  city: string = '';
  area: string = '';
  latitude: string = '';
  longitude: string = '';
  address: string = '';

  constructor(private http: HttpClient) {}

  submitForm() {
    const apiUrl = 'http://localhost:3001/addHospital';

    const formData = {
      HospitalName: this.hospitalName,
      City: this.city,
      Area: this.area,
      Latitude: this.latitude,
      Longitude: this.longitude,
      Address: this.address,
    };

    // Make the HTTP request
    this.http.post(apiUrl, formData).subscribe(
      (response) => {
        console.log('Data successfully submitted:', response);
        // Optionally, you can reset the form or show a success message
        this.resetForm();
      },
      (error) => {
        console.error('Error submitting data:', error);
        // Optionally, you can show an error message
      }
    );
  }

  resetForm() {
    // Reset all input fields
    this.hospitalName = '';
    this.city = '';
    this.area = '';
    this.latitude = '';
    this.longitude = '';
    this.address = '';
  }
}

