import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// @ts-ignore
import { FavrCategoryCardButtonsComponent } from './favr-category-card-buttons.component';

describe('FavrCategoryCardButtonsComponent', () => {
  let component: FavrCategoryCardButtonsComponent;
  let fixture: ComponentFixture<FavrCategoryCardButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavrCategoryCardButtonsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavrCategoryCardButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
