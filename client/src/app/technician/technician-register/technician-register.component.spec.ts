import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianRegisterComponent } from './technician-register.component';

describe('TechnicianNewComponent', () => {
  let component: TechnicianRegisterComponent;
  let fixture: ComponentFixture<TechnicianRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicianRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicianRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
