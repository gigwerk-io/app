import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReferralPage } from './customer-referral.page';

describe('CustomerReferralPage', () => {
  let component: CustomerReferralPage;
  let fixture: ComponentFixture<CustomerReferralPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerReferralPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerReferralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
