import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorDetailsMedicalEditComponent } from './donor-details-medical-edit.component';

describe('DonorDetailsMedicalEditComponent', () => {
  let component: DonorDetailsMedicalEditComponent;
  let fixture: ComponentFixture<DonorDetailsMedicalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonorDetailsMedicalEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorDetailsMedicalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
