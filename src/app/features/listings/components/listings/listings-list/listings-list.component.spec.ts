import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingsListComponent } from './listings-list.component';

describe('ListingsListComponent', () => {
  let component: ListingsListComponent;
  let fixture: ComponentFixture<ListingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListingsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
