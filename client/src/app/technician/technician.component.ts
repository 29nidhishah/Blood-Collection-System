import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { RoleEnum } from '../utils';
import { AuthService } from '../core/auth/auth.service';

import { TechnicianViewRecord } from './technician';
import { TechnicianService } from './technician.service';


@Component({
  selector: 'app-technician',
  templateUrl: './technician.component.html',
  styleUrls: ['./technician.component.scss']
})
export class TechnicianComponent implements OnInit, OnDestroy {
  public technicianId: any;
  public technicianRecordObs?: Observable<TechnicianViewRecord>;
  private sub?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly technicianService: TechnicianService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.sub = this.route.params
      .subscribe((params: Params) => {
        this.technicianId = params.technicianId;
        this.refresh();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.technicianRecordObs = this.technicianService.getTechnicianByHospitalId(this.authService.getHospitalId(), this.technicianId);
  }

  public isTechnician(): boolean {
    return this.authService.getRole() === RoleEnum.TECHNICIAN;
  }
}
