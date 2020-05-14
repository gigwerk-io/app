import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPage } from './request.page';

describe('RequestPage', () => {
  let component: RequestPage;
  let fixture: ComponentFixture<RequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
