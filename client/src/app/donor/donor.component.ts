import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { DonorService } from './donor.service';
import { DonorViewRecord,DonationHistory, DonationDetails,DonorRecord } from './donor';
import { AuthService } from '../core/auth/auth.service';
import { RoleEnum } from '../utils';


@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.scss']
})
export class DonorComponent implements OnInit, OnDestroy {
  public donorID: any;
  public doctorID: any;
  public donorRecordObs?: Observable<DonorViewRecord>;
  public donorRecord: DonorViewRecord | undefined;
  private sub?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly donorService: DonorService,
    private readonly authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sub = this.route.params
      .subscribe((params: Params) => {
        this.donorID = params.donorId
        this.doctorID = params.doctorId||'';
        this.refresh();
      });
    this.accessDonationDetails();
  }
  
  /*public openScreeningForm(): void {
    this.router.navigate(['/screening-form']);
  }*/
  
  accessDonationDetails(): void {
    if (this.donorRecord) { // Check if donorRecord is defined
      const donationHistory: DonationHistory = this.donorRecord.donationHistory;
      const specificDonationDetails: DonationDetails | undefined = donationHistory['donationNumber'];

      if (specificDonationDetails) {
        const dateOfDonation: string = specificDonationDetails.dateOfDonation;
        const status: string = specificDonationDetails.status;
        const bloodBagUnitNo: string = specificDonationDetails.bloodBagUnitNo;
        const bloodBagSegmentNo: string = specificDonationDetails.bloodBagSegmentNo;
        const quantity: string = specificDonationDetails.quantity;
      }
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.donorRecordObs = this.donorService.getDonorByKey(this.donorID);
  }

  public isDonor(): boolean {
    return this.authService.getRole() === RoleEnum.DONOR;
  }

  public isDoctor(): boolean {
    return this.authService.getRole() === RoleEnum.DOCTOR;
  }
}
