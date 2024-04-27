import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { DonorService } from '../../donor/donor.service';
import { DisplayVal, DonorAdminViewRecord, DonorViewRecord } from '../../donor/donor';

@Component({
  selector: 'app-donor-list-for-admin',
  templateUrl: './donor-list-for-admin.component.html',
  styleUrls: ['./donor-list-for-admin.component.scss']
})
export class DonorListForAdminComponent implements OnInit, OnDestroy { 
  public adminId:any;
  public donorRecords$?: Observable<Array<DonorAdminViewRecord>>;
  private sub?: Subscription;
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
    this.sub = this.route.params
      .subscribe((params: Params) => {
      	this.adminId=params.adminId;
        this.refresh();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.donorRecords$ = this.donorService.fetchAllDonors();
  }
}
