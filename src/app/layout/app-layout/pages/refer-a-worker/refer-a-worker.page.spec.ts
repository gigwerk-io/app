import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferAWorkerPage } from './refer-a-worker.page';

describe('ReferAWorkerPage', () => {
  let component: ReferAWorkerPage;
  let fixture: ComponentFixture<ReferAWorkerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferAWorkerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferAWorkerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
