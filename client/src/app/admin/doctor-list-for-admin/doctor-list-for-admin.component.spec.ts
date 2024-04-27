import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorListForAdminComponent } from './doctor-list-for-admin.component';

describe('DoctorListForAdminComponent', () => {
  let component: DoctorListForAdminComponent;
  let fixture: ComponentFixture<DoctorListForAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorListForAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorListForAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
