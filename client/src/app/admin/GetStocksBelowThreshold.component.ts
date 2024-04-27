// Import necessary modules from Angular
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-get-stocks-below-threshold',
  template: `
    <div>
      <h2>Stocks Below Threshold</h2>
      <label for="thresholdInput">Enter Threshold:</label>
      <input type="number" id="thresholdInput" [(ngModel)]="threshold" required>
      <button (click)="fetchStocks()">Fetch Stocks</button>

      <div *ngFor="let stock of stocks">
        <p>Hospital Name: {{ stock.HospitalName }}</p>
        <p>Blood Group: {{ stock.BloodGroup }}</p>
        <p>Total Quantity: {{ stock.TotalBloodQuantity }}</p>
        <hr>
      </div>
    </div>
  `,
  styles:[
   /* Add the following styles to your component's CSS file (e.g., get-stocks-below-threshold.component.css) */

`div {
  margin: 20px;
}

h2 {
  color: #333;
}

label {
  margin-right: 10px;
  font-weight: bold;
}

input {
  padding: 5px;
  margin-right: 10px;
}

button {
  padding: 8px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

div p {
  margin: 5px 0;
}

hr {
  border: 1px solid #ddd;
}`

  ]
})
export class GetStocksBelowThresholdComponent implements OnInit {
  stocks: any[] = [];
  threshold: number | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Initial data fetch on component initialization
    //this.fetchStocks();
  }

  fetchStocks() {
    // Ensure threshold is set before making the request
    if (this.threshold === undefined) {
      console.error('Threshold value is required');
      return;
    }

    const apiUrl = `http://localhost:3001/displayStocksBelowThreshold?threshold=${this.threshold}`;

    // Make the HTTP request
	this.http.get<any[]>(apiUrl).subscribe(
	  (response) => {
	    this.stocks = response;
	  },
	  (error) => {
	    console.error('Error fetching stocks:', error);
	  }
	);

// ...

  }
}

