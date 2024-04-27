// blood-collection.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blood-collection',
  template: `
    <div class="blood-collection-form">
      <div class="result" *ngIf="resultMessage" [style.color]="resultMessage === 'Blood collection successful' ? 'green' : 'red'">
  {{ resultMessage }}
</div>

      <form [formGroup]="bloodCollectionForm" (submit)="submitForm()">
        <label for="donorId">Donor ID:</label>
        <input type="text" id="donorId" formControlName="donorId" [attr.disabled]="true">
        
        <label for="doctorId">Doctor ID:</label>
        <input type="text" id="doctorId" formControlName="doctorId" [attr.disabled]="true">

        <label for="bloodBagUnitNo">Blood Bag Unit Number:</label>
        <input type="text" id="bloodBagUnitNo" formControlName="bloodBagUnitNo">

        <label for="bloodBagSegmentNo">Blood Bag Segment Number:</label>
        <input type="text" id="bloodBagSegmentNo" formControlName="bloodBagSegmentNo">

        <label for="quantity">Quantity:</label>
        <input type="number" id="quantity" formControlName="quantity">

        <button type="submit">Submit</button>
      </form>

      
    </div>
  `,
  styles: [`
    /* blood-collection.component.css */
    .blood-collection-form {
      max-width: 400px;
      margin: auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      background-color: #fff;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
    }

    input {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
    }

    button {
      padding: 10px;
      background-color: #007BFF;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    button:hover {
      background-color: #45a049;
    }

    .result {
      margin-top: 20px;
      font-weight: bold;
    }
  `],
})
export class BloodCollectionComponent implements OnInit {
  bloodCollectionForm!: FormGroup;
  resultMessage!: string;
  donorId!: string;
  doctorId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.donorId = params['donorId'];
      this.doctorId = params['doctorId'];

      this.bloodCollectionForm = this.formBuilder.group({
        donorId: [this.donorId, Validators.required],
        doctorId: [this.doctorId, Validators.required],
        bloodBagUnitNo: ['', Validators.required],
        bloodBagSegmentNo: ['', Validators.required],
        quantity: ['', Validators.required],
      });
    });
  }

  submitForm() {
    console.log('Form submitted:', this.bloodCollectionForm.value);

    const formData = this.bloodCollectionForm.value;

    this.http.post('http://localhost:3001/doctor/blood-collect', formData)
      .subscribe(
        (response) => {
          console.log('API Response:', response);
          this.resultMessage = 'Blood collection successful';
        },
        (error) => {
          console.error('API Error:', error);
          this.resultMessage = 'Blood collection failed';
        }
      );
  }
}

