import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { DonorService } from '../donor.service';
import { DisplayVal, DonorViewRecord } from '../donor';
import { RoleEnum } from '../../utils';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-donor-history',
  templateUrl: './donor-history.component.html',
  styleUrls: ['./donor-history.component.scss']
})
export class DonorHistoryComponent implements OnInit, OnDestroy {
  public donorID: any;
  public donorRecordHistoryObs$?: Observable<Array<DonorViewRecord>>;
  public data: any;
  private sub?: Subscription;
  headerNames = [
    new DisplayVal(DonorViewRecord.prototype.Timestamp, 'Date'),
    new DisplayVal(DonorViewRecord.prototype.changedBy, 'Last changed by'),
    new DisplayVal(DonorViewRecord.prototype.firstName, 'First Name'),
    new DisplayVal(DonorViewRecord.prototype.lastName, 'Last Name'),
    new DisplayVal(DonorViewRecord.prototype.dob, 'Date of Birth'),
    new DisplayVal(DonorViewRecord.prototype.bloodGroup, 'Blood Group'),
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly donorService: DonorService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.isDonor()) {
      this.headerNames.push(
        new DisplayVal(DonorViewRecord.prototype.address, 'Address'),
        new DisplayVal(DonorViewRecord.prototype.phoneNumber, 'Contact number'),
        new DisplayVal(DonorViewRecord.prototype.aadhar, 'Aadhar number')
      );
    }
    this.headerNames.push(
      new DisplayVal(DonorViewRecord.prototype.alert, 'Alert'),
      new DisplayVal(DonorViewRecord.prototype.isDiseased, 'Is Diseased'),
      new DisplayVal(DonorViewRecord.prototype.creditCard, 'Credit Card'),
      new DisplayVal(DonorViewRecord.prototype.donationStatus, 'Donation Status'),
      new DisplayVal(DonorViewRecord.prototype.donationHistory, 'Donation History')
    );
    this.sub = this.route.params
      .subscribe((params: Params) => {
        this.donorID = params.donorId;
        this.refresh();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.donorRecordHistoryObs$ = this.donorService.getDonorHistoryByKey(this.donorID);
  }

  public isDonor(): boolean {
    return this.authService.getRole() === RoleEnum.DONOR;
  }

  public convertToDate(val: any): string{
    return new Date(val.seconds.low * 1000).toDateString();
  }
}
