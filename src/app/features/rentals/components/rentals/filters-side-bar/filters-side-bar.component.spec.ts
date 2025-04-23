import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersSideBarComponent } from './filters-side-bar.component';

describe('FiltersSideBarComponent', () => {
  let component: FiltersSideBarComponent;
  let fixture: ComponentFixture<FiltersSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiltersSideBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
