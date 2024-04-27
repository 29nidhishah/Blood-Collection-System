// blood-test.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-blood-test',
  template: `
    <!-- blood-test.component.html -->

<div class="blood-test-form-container">
  <div *ngIf="apiResponse" class="api-response">
    <ng-container *ngIf="apiResponse.success; else failureBlock">
      <h4 [style.color]="'green'">Blood Test successful !!</h4>
    </ng-container>
    <ng-template #failureBlock>
      <h4 [style.color]="'red'">Blood Test Failed !!</h4>
    </ng-template>
  </div>
  <form [formGroup]="bloodTestForm" (submit)="submitForm()">
    <div class="form-group">
      <label for="technicianId">Technician ID:</label>
      <input type="text" id="technicianId" formControlName="technicianId" [attr.disabled]="true" />
    </div>
    <div class="form-group">
      <label for="bloodBagUnitNo">Blood Bag Unit No:</label>
      <input type="text" id="bloodBagUnitNo" formControlName="bloodBagUnitNo" required />
    </div>
    <div class="form-group">
      <label for="bloodBagSegmentNo">Blood Bag Segment No:</label>
      <input type="text" id="bloodBagSegmentNo" formControlName="bloodBagSegmentNo" required />
    </div>

    <div class="form-group">
      <label for="malaria">Malaria:</label>
      <select formControlName="malaria">
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </div>

    <div class="form-group">
      <label for="syphilis">Syphilis:</label>
      <select formControlName="syphilis">
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </div>

    <div class="form-group">
      <label for="hcv">HCV:</label>
      <select formControlName="hcv">
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </div>

    <div class="form-group">
      <label for="hepatitisB">Hepatitis B:</label>
      <select formControlName="hepatitisB">
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </div>

    <div class="form-group">
      <label for="irregularAntibody">Irregular Antibody:</label>
      <select formControlName="irregularAntibody">
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </div>

    <div class="button-container">
      <button type="submit" [disabled]="bloodTestForm.invalid">Submit</button>
    </div>
  </form>
  
  <!--<div clss="button-container">
    <button (click)="sendGetRequest()">Read bags</button>
    </div>-->
    
</div>

  `,
  styles: [`
    .select-group {
  display: flex;
  align-items: center;
}

.select-group label {
  margin-right: 20px;
  font-size: 14px;
}

select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}


.blood-test-form-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

.button-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20px;
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

.api-response {
  margin-top: 20px;
}

.api-response h4 {
  font-size: 18px;
  margin-bottom: 10px;
}



  `]
})
export class BloodTestComponent implements OnInit {
  apiResponse!: any;
  bloodTestForm!: FormGroup;
  technicianId!: string;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.technicianId = params['technicianId'];
    });

    this.bloodTestForm = this.formBuilder.group({
      technicianId: [this.technicianId, Validators.required],
      bloodBagUnitNo: ['', Validators.required],
      bloodBagSegmentNo: ['', Validators.required],
      malaria: [null, Validators.required],
      syphilis: [null, Validators.required],
      hcv: [null, Validators.required],
      hepatitisB: [null, Validators.required],
      irregularAntibody: [null, Validators.required],
    });
  }

  submitForm() {
    if (this.bloodTestForm.valid) {
      console.log('Form submitted:', this.bloodTestForm.value);
    
    const apiUrl = 'http://localhost:3001/technician/bloodtest';

    this.http.post(apiUrl, this.bloodTestForm.value)
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
    
    /*sendGetRequest() {
    const apiUrl = 'http://localhost:3001/technician/readBags';

    this.http.get(apiUrl).subscribe(
      (data) => {
        console.log('API Response:', data);
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }*/
  }
}

