import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { DoctorService } from '../doctor.service';
import { DoctorRecord, DoctorViewRecord } from '../doctor';
import { DisplayVal } from '../../donor/donor';
import { DonorService } from '../../donor/donor.service';

@Component({
  selector: 'app-doctor-list-for-donor',
  templateUrl: './doctor-list-for-donor.component.html',
  styleUrls: ['./doctor-list-for-donor.component.scss']
})
export class DoctorListForDonorComponent implements OnInit, OnDestroy {
  public donorID: any;
  public doctorRecords: Array<DoctorViewRecord> = [];
  public permissions = [];
  public grantObs$?: Observable<any>;
  public revokeObs$?: Observable<any>;
  private allSubs = new Subscription();
  public headerNames = [
    new DisplayVal(DoctorViewRecord.prototype.doctorId, 'Doctor Id'),
    new DisplayVal(DoctorViewRecord.prototype.fullName, 'Full Name')
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly doctorService: DoctorService,
    private readonly donorService: DonorService
  ) { }

  ngOnInit(): void {
    this.allSubs.add(
      this.route.params.subscribe((params: Params) => {
        this.donorID = params.donorId;
        this.refresh();
      })
    );
  }

  ngOnDestroy(): void {
    this.allSubs.unsubscribe();
  }

  public refresh(): void {
    this.doctorRecords = [];
    this.allSubs.add(
      this.donorService.getDonorByKey(this.donorID).subscribe(x => {
        this.permissions = x.permissionGranted;
        this.fetchDoctorData();
      })
    );
  }

  public fetchDoctorData(): void {
    this.allSubs.add(
      this.doctorService.getDoctorsByHospitalId(1).subscribe(x => {
        const data = x as Array<DoctorRecord>;
        data.map(y => this.doctorRecords.push(new DoctorViewRecord(y)));
      })
    );
    this.allSubs.add(
      this.doctorService.getDoctorsByHospitalId(2).subscribe(x => {
        const data = x as Array<DoctorRecord>;
        data.map(y => this.doctorRecords.push(new DoctorViewRecord(y)));
      })
    );
    /*this.allSubs.add(
      this.doctorService.getDoctorsByHospitalId(3).subscribe(x => {
        const data = x as Array<DoctorRecord>;
        data.map(y => this.doctorRecords.push(new DoctorViewRecord(y)));
      })*/
    //);
  }

  public grant(doctorId: string): void {
    this.allSubs.add(
      this.donorService.grantAccessToDoctor(this.donorID, doctorId).subscribe(x => {
        console.log(x);
        this.refresh();
      })
    );
  }

  public revoke(doctorId: string): void {
    this.allSubs.add(
      this.donorService.revokeAccessFromDoctor(this.donorID, doctorId).subscribe(x => {
        console.log(x);
        this.refresh();
      })
    );
  }

  public isDoctorPresent(doctorId: string): boolean {
    // @ts-ignore
    return this.permissions.includes(doctorId);
  }
}
