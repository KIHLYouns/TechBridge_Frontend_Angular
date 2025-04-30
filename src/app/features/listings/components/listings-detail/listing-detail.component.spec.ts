import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalDetailComponent } from './listing-detail.component';

describe('RentalDetailComponent', () => {
  let component: RentalDetailComponent;
  let fixture: ComponentFixture<RentalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RentalDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
