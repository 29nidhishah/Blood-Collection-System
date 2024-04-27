import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { TechnicianService } from '../technician.service';
import { AuthService } from '../../core/auth/auth.service';
interface Hospital
{
   id: string;
   name: string;
}

@Component({
  selector: 'app-technician-new',
  templateUrl: './technician-register.component.html',
  styleUrls: ['./technician-register.component.scss']
})
export class TechnicianRegisterComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public error: any = null;
  public registration: string = '';

  public hospitalList: Hospital[] = [];
  private sub?: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly technicianService: TechnicianService
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      emergPhoneNumber: ['', Validators.required],
      hospitalId: ['', Validators.required],
      registration: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.populateHospitalList();
  }
  
  private populateHospitalList(): void {
    const adminUsername = this.getAdminUsername();

    if (adminUsername === 'hosp1admin') {
      this.hospitalList.push({ id: '1', name: 'Hospital 1' });
    } else if (adminUsername === 'hosp2admin') {
      this.hospitalList.push({ id: '2', name: 'Hospital 2' });
    } else {
      this.hospitalList.push({ id: '3', name: 'Hospital 3' });
    }
  }

  ngOnInit(): void {
   this.form.get('registration')?.valueChanges.subscribe((value: string) => {
    this.generateUsername(value, this.form.get('hospitalId')?.value);
  });
  this.form.get('hospitalId')?.valueChanges.subscribe((value: string) => {
    this.generateUsername(this.form.get('registration')?.value, value);
  });
    this.refresh();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.form.reset();
  }

  public getAdminUsername(): string {
    return this.authService.getUsername();
  }
  
  private generateUsername(registration: string, hospitalId: string): void {
  
  if(registration && hospitalId)
  {let hospitalAbbreviation: string;
  
  switch (hospitalId) {
    case '1':
      hospitalAbbreviation = 'HOSP1';
      break;
    case '2':
      hospitalAbbreviation = 'HOSP2';
      break;
    case '3':
      hospitalAbbreviation = 'HOSP3';
      break;
    default:
      hospitalAbbreviation = 'UNKNOWN';
      break;
  }
  
  const username = hospitalAbbreviation + '-TECH' + registration;
  this.form.get('username')?.setValue(username);
  }
  else
  this.form.get('username')?.setValue('');
  }

  public save(): void {
    console.log(this.form.value);
    this.sub = this.technicianService.createTechnician(this.form.value)
    .subscribe(
      x => {
        const docRegResponse = x;
        if (docRegResponse.error) {
          this.error = docRegResponse.error;
        }
        this.router.navigate(['/', 'admin', this.getAdminUsername()]);
      },
      error => {
        // Handle the error appropriately
        console.error('Error occurred while creating technician:', error);
        // Optionally, you can set an error flag or message to display to the user
        this.error = 'An error occurred while saving the technicians details.';
      }
    );
  }
}
