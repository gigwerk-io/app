import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTutorialPage } from './customer-tutorial.page';

describe('CustomerTutorialPage', () => {
  let component: CustomerTutorialPage;
  let fixture: ComponentFixture<CustomerTutorialPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerTutorialPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTutorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
