import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferACustomerPage } from './refer-a-customer.page';

describe('ReferACustomerPage', () => {
  let component: ReferACustomerPage;
  let fixture: ComponentFixture<ReferACustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferACustomerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferACustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
