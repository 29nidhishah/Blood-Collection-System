// read-blood-bag.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-read-blood-bag',
  template: `
    <div class="blood-bag-form-container">
      <form [formGroup]="bloodBagForm" (ngSubmit)="submitForm()">
        <div class="form-group">
          <label for="bloodBagUnitNo">Blood Bag Unit No:</label>
          <input type="text" id="bloodBagUnitNo" formControlName="bloodBagUnitNo" required />
        </div>
        <div class="form-group">
          <label for="bloodBagSegmentNo">Blood Bag Segment No:</label>
          <input type="text" id="bloodBagSegmentNo" formControlName="bloodBagSegmentNo" required />
        </div>
        <div class="form-group">
          <label for="bloodBagType">Blood Bag Cross-matching Status:</label>
          <select id="bloodBagType" formControlName="bloodBagType" required>
            <option value="finalrecord">Finished</option>
            <option value="temprecord">Pending</option>
          </select>
        </div>
        <button type="submit" [disabled]="bloodBagForm.invalid">Submit</button>
      </form>

      <div *ngIf="responseData" class="response-container">
        <h3>Blood Bag Details:</h3>
        <pre>{{ responseData | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .blood-bag-form-container {
      max-width: 400px;
      margin: auto;
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      font-weight: bold;
    }

    input, select {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
    }

    button {
      background-color: #4CAF50;
      color: white;
      padding: 12px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s;
    }

    button:disabled {
      background-color: #ddd;
      cursor: not-allowed;
    }

    button:hover:not([disabled]) {
      background-color: #45a049;
    }

    .response-container {
      margin-top: 20px;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
  `],
})

export class ReadBloodBagComponent implements OnInit {
  bloodBagForm!: FormGroup;
  responseData: any;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.bloodBagForm = this.fb.group({
      bloodBagUnitNo: ['', Validators.required],
      bloodBagSegmentNo: ['', Validators.required],
      bloodBagType: ['', Validators.required],
    });
  }

  submitForm(): void {
    if (this.bloodBagForm.valid) {
      const formData = this.bloodBagForm.value;
      console.log(formData);
      const apiEndpoint = 'http://localhost:3001/technician/readbloodbag';

      this.http.post(apiEndpoint, formData).subscribe(
        (response) => {
          console.log('Post request successful', response);
          this.responseData = response;
        },
        (error) => {
          console.error('Error in post request', error);
          this.responseData = `Blood Bag not found. Please check again!!`;
        }
      );
    }
  }
}
