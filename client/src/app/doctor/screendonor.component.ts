// screendonor.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-screendonor',
  template: `
    <div class="container">
    <div *ngIf="apiResponse">
    <ng-container *ngIf="apiResponse.success; else failureBlock">
    <h4 [style.color]="'green'">Screening successful !!</h4>
    </ng-container>
    <ng-template #failureBlock>
    <h4 [style.color]="'red'">Screening Failed !!</h4>
    </ng-template>
    </div>
      <h2>Screen Donor</h2>

      <form [formGroup]="screeningForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="donorId">Donor ID:</label>
          <input type="text" id="donorId" formControlName="donorId" [attr.disabled]="true">
        </div>

        <div class="form-group">
          <label for="doctorId">Doctor ID:</label>
          <input type="text" id="doctorId" formControlName="doctorId" [attr.disabled]="true">
        </div>

        <div class="form-group">
          <label for="dob">DOB:</label>
          <input type="text" id="dob" formControlName="dob" [attr.disabled]="true">
        </div>

        <div class="form-group">
          <label for="systolic">Systolic Pressure:</label>
          <input type="text" id="systolic" formControlName="systolic" required>
        </div>

        <div class="form-group">
          <label for="diastolic">Diastolic Pressure:</label>
          <input type="text" id="diastolic" formControlName="diastolic" required>
        </div>

        <div class="form-group">
          <label for="weight">Weight:</label>
          <input type="text" id="weight" formControlName="weight" required>
        </div>

        <button type="submit" [disabled]="screeningForm.invalid">Submit</button>
      </form>
    </div>
    
    
    

  `,
  styles: [`
    .container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    .form-group {
      margin-bottom: 15px;
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

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class ScreenDonorComponent implements OnInit {
  apiResponse: any;
  donorId!: string;
  doctorId!: string;
  dob!: string;

  screeningForm!: FormGroup;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.donorId = params['donorId'];
      this.doctorId = params['doctorId'];
      this.dob = params['dob'];
    });

    this.screeningForm = this.fb.group({
      donorId: [this.donorId, Validators.required],
      doctorId: [this.doctorId, Validators.required],
      dob: [this.dob, Validators.required],
      systolic: ['', Validators.required],
      diastolic: ['', Validators.required],
      weight: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log('Form submitted:', this.screeningForm.value);
    
    const apiUrl = 'http://localhost:3001/doctor/screendonor/' + this.screeningForm.value.doctorId;

    this.http.post(apiUrl, this.screeningForm.value)
      .subscribe(
        (response) => {
          console.log('API Response:', response);
          this.apiResponse = response;
        },
        (error) => {
          console.error('API Error:', error);
          this.apiResponse = error;
        }
      );
  }
}

