import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { DonorService } from '../donor.service';
import { DonorRecord } from '../donor';
import { RoleEnum } from '../../utils';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-donor-new',
  templateUrl: './donor-edit.component.html',
  styleUrls: ['./donor-edit.component.scss']
})
export class DonorEditComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public error: any = null;
  public title = '';
  public donorId: any;
  public newDonorData: any;
  private allSub = new Subscription();

  public bloodGroupTypes = [
    {id: 'a+', name: 'A +'},
    {id: 'a-', name: 'A -'},
    {id: 'b+', name: 'B +'},
    {id: 'b-', name: 'B -'},
    {id: 'ab+', name: 'AB +'},
    {id: 'ab-', name: 'AB -'},
    {id: 'o+', name: 'O +'},
    {id: 'o-', name: 'O -'}
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly donorService: DonorService,
    private readonly authService: AuthService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      dob: ['', [ Validators.required]],
      phoneNumber: ['', Validators.required],
      aadhar: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      alert: [''],
      isDiseased: [''],
      creditCard: [''],
      donationStatus: [''],
      donationHistory: ['']
    });
  }

  ngOnInit(): void {
    this.allSub.add(
      this.route.params.subscribe((params: Params) => {
        this.donorId = params.self;
        this.refresh();
      })
    );
  }
  
  public isEditForm(): boolean {
    return !this.isNew(); // Assuming isNew() returns true for a new donor
  }

  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  public refresh(): void {
    this.setTitle();
    if (this.isNew()) {
      this.form.reset();
    }
    else {
      this.allSub.add(
        this.donorService.getDonorByKey(this.donorId).subscribe(x => {
          const data = x as DonorRecord;
          this.loadRecord(data);
        })
      );
    }
    this.error = null;
  }

  public isNew(): boolean {
    return this.donorId === 'new';
  }

  public isDonor(): boolean {
    return this.authService.getRole() === RoleEnum.DONOR;
  }

  public isDoctor(): boolean {
    return this.authService.getRole() === RoleEnum.DOCTOR;
  }

  public getAdminUsername(): string {
    return this.authService.getUsername();
  }

  public save(): void {
    if (this.isNew()) {
      this.allSub.add(
        this.donorService.createDonor(this.form.value).subscribe(x => this.newDonorData = x)
      );
    }
    else if (this.isDonor()) {
      this.allSub.add(
        this.donorService.updateDonorPersonalDetails(this.donorId, this.form.value).subscribe(x => {
          const response = x;
          if (response.error) {
            this.error = response.error;
          }
          this.router.navigate(['/', 'donor', this.donorId]);
        })
      );
    }
    else {
      this.allSub.add(
        this.donorService.updateDonorMedicalDetails(this.donorId, this.form.value).subscribe(x => {
          const response = x;
          if (response.error) {
            this.error = response.error;
          }
          this.router.navigate(['/', 'donor', this.donorId]);
        })
      );
    }
  }

  public findInvalidControls(): void {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
  }

  public reset(): void {
    this.newDonorData = null;
    this.router.navigate(['/', 'admin', this.getAdminUsername()]);
  }
  
  public toggleAlert(): void {
  if (this.isDoctor() && !this.isNew()) {
    const currentValue = this.form.get('alert')!.value;
    this.form.get('alert')!.setValue(currentValue === 'true' ? 'false' : 'true');
  }
}

public toggleIsDiseased(): void {
  if (this.isDoctor() && !this.isNew()) {
    const currentValue = this.form.get('isDiseased')!.value;
    this.form.get('isDiseased')!.setValue(currentValue === 'true' ? 'false' : 'true');
  }
}


  private setTitle(): void {
    this.title = (this.isNew() ? 'Create' : 'Edit') + ' Donor';
  }

  private loadRecord(record: DonorRecord): void {
    this.clearValidators();
    if (this.isDonor()) {
      this.form.patchValue({
        firstName: record.firstName,
        lastName: record.lastName,
        address: record.address,
        dob: record.dob,
        phoneNumber: record.phoneNumber,
        aadhar: record.aadhar
      });
    }
    else {
      this.form.patchValue({
        alert: record.alert,
        isDiseased: record.isDiseased,
        creditCard: record.creditCard,
        donationStatus: record.donationStatus,
        donationHistory: record.donationHistory
      });
    }
  }

  private clearValidators(): void {
    // tslint:disable-next-line:forin
    for (const key in this.form.controls) {
      this.form.get(key)?.clearValidators();
      this.form.get(key)?.updateValueAndValidity();
    }
    // this.findInvalidControls();
  }
}
