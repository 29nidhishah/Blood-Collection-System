import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DonorService } from '../../donor/donor.service';
import { DisplayVal, DonorDoctorViewRecord, DonorViewRecord } from '../../donor/donor';

@Component({
  selector: 'app-donor-list-for-doctor',
  templateUrl: './donor-list-for-doctor.component.html',
  styleUrls: ['./donor-list-for-doctor.component.scss']
})
export class DonorListForDoctorComponent implements OnInit {
  public doctorId: any;
  public donorRecordsObs$?: Observable<Array<DonorDoctorViewRecord>>;
  public headerNames = [
    new DisplayVal(DonorViewRecord.prototype.donorId, 'Donor Id'),
    new DisplayVal(DonorViewRecord.prototype.firstName, 'First Name'),
    new DisplayVal(DonorViewRecord.prototype.lastName, 'Last Name')
  ];

  constructor(
  private readonly route: ActivatedRoute,
  private readonly donorService: DonorService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.doctorId = params['doctorId']||'';
      this.refresh();
    });
  }

  public refresh(): void {
    this.donorRecordsObs$ = this.donorService.fetchAllDonors();
  }
}
