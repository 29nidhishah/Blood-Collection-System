import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorListForAdminComponent } from './donor-list-for-admin.component';

describe('DonorListForAdminComponent', () => {
  let component: DonorListForAdminComponent;
  let fixture: ComponentFixture<DonorListForAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonorListForAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorListForAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
