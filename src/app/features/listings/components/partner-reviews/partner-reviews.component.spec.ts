import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerReviewsComponent } from './partner-reviews.component';

describe('PartnerReviewsComponent', () => {
  let component: PartnerReviewsComponent;
  let fixture: ComponentFixture<PartnerReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartnerReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
