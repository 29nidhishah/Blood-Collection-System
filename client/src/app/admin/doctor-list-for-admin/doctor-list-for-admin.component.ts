import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DoctorService } from '../../doctor/doctor.service';
import { DisplayVal } from '../../donor/donor';
import { DoctorViewRecord } from '../../doctor/doctor';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-doctor-list-for-admin',
  templateUrl: './doctor-list-for-admin.component.html',
  styleUrls: ['./doctor-list-for-admin.component.scss']
})
export class DoctorListForAdminComponent implements OnInit, OnDestroy {
  public adminId: any;
  public doctorRecords$?: Observable<Array<DoctorViewRecord>>;
  private sub?: Subscription;
  public headerNames = [
    //new DisplayVal(DoctorViewRecord.prototype.doctorId, 'Doctor Id'),
    new DisplayVal(DoctorViewRecord.prototype.registration, 'Registration'),
    new DisplayVal(DoctorViewRecord.prototype.fullName, 'Full Name'),
    new DisplayVal(DoctorViewRecord.prototype.address, 'Address'),
    new DisplayVal(DoctorViewRecord.prototype.phoneNumber, 'Phone Number'),
    new DisplayVal(DoctorViewRecord.prototype.emergPhoneNumber, 'Emergency Phone Number')
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly doctorService: DoctorService,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params: Params) => {
      this.adminId = params.adminId;
      this.refresh();
    }, error => {
      console.error('Error in subscription:', error);
      // Handle the error as needed, e.g., show a user-friendly message
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    if (this.adminId === 'hosp1admin') {
      this.doctorRecords$ = this.doctorService.getDoctorsByHospitalId(1);
    } else if (this.adminId === 'hosp2admin') {
      this.doctorRecords$ = this.doctorService.getDoctorsByHospitalId(2);
    } else {
      this.doctorRecords$ = this.doctorService.getDoctorsByHospitalId(3);
    }
  }

  public deleteDoctor(adminId: string, registration: string, role: string): void {
    const hospitalId = adminId.substring(4, 5);
    const Id = 'HOSP' + hospitalId +'-'+ role + registration;
    const userConfirmed = window.confirm(`Are you sure you want to delete ${Id}?`);

    if (userConfirmed) {
      // If the user confirmed, proceed with sending the HTTP request
      const url = `http://localhost:3001/${adminId}/delete/${Id}`;

      this.http.delete(url).subscribe(response => {
        // Handle response if needed
        console.log('Doctor deleted successfully', response);
        // Alert the user with the HTTP response
        window.alert('Doctor deleted successfully:\n');
      }, error => {
        // Handle error if needed
        console.error('Error in deleting', error);
        // Alert the user with the error message
        window.alert('Error deleting doctor:\n' + JSON.stringify(error));
      });
    } else {
      // If the user canceled, do nothing
      console.log('Request canceled');
    }
  }
}
