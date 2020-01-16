import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteTaskPage } from './complete-task.page';

describe('CompleteTaskPage', () => {
  let component: CompleteTaskPage;
  let fixture: ComponentFixture<CompleteTaskPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteTaskPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
