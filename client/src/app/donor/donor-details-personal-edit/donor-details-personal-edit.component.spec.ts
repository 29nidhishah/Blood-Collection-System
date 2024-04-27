import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorDetailsPersonalEditComponent } from './donor-details-personal-edit.component';

describe('DonorDetailsPersonalEditComponent', () => {
  let component: DonorDetailsPersonalEditComponent;
  let fixture: ComponentFixture<DonorDetailsPersonalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonorDetailsPersonalEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorDetailsPersonalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
