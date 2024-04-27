import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorListForDoctorComponent } from './donor-list-for-doctor.component';

describe('DonorListForDoctorComponent', () => {
  let component: DonorListForDoctorComponent;
  let fixture: ComponentFixture<DonorListForDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonorListForDoctorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorListForDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
