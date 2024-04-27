import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianListForAdminComponent } from './technician-list-for-admin.component';

describe('TechnicianListForAdminComponent', () => {
  let component: TechnicianListForAdminComponent;
  let fixture: ComponentFixture<TechnicianListForAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicianListForAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicianListForAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
