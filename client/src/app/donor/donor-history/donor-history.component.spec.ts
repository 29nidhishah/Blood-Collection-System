import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorHistoryComponent } from './donor-history.component';

describe('DonorHistoryComponent', () => {
  let component: DonorHistoryComponent;
  let fixture: ComponentFixture<DonorHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonorHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
