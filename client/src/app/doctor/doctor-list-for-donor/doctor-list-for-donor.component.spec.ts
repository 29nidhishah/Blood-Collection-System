import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorListForDonorComponent } from './doctor-list-for-donor.component';

describe('DoctorListForDonorComponent', () => {
  let component: DoctorListForDonorComponent;
  let fixture: ComponentFixture<DoctorListForDonorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorListForDonorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorListForDonorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
